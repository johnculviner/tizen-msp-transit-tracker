const cp = require('child_process')
const process = require('process')
const fs = require('fs')
const packageJson = require('./package.json')
const _ = require('lodash')

// handle input and run appropriate script
const args = process.argv.join('')
if (args.includes('hmr-emulator')) {
  return hmrBuild()
}
if (args.includes('emulator')) {
  return emulatorBuild()
}
if (args.includes('device')) {
  return deviceBuild()
}


function emulatorBuild(includePreactBuild = true) {
  writeMessage('Get emulator name...')
  const emulator = cp.execSync('em-cli list-vm').toString().trim()
  console.log(`${emulator} ✅`)
  writeMessage(`Assert ${emulator} running...`)
  let emulatorRunning = true
  try { cp.execSync(`pgrep -f ${emulator}`) } catch (ex) { emulatorRunning = false}
  if (emulatorRunning) {
    console.log('Was running ✅')
  } else {
    console.log(`Wasn't running, starting it...`)
    cp.spawn('em-cli', ['launch', '-n', emulator], { detached: true })
    runShellStep(`Waiting for ${emulator} to come up for 10 seconds...`, 'sleep 10')
  }
  buildDeployCore(includePreactBuild)
  runShellStep('open the app', `tizen run -p ${packageJson.tizen.projectId}`)
  runShellStep('sdb console output...\n', 'sdb dlog ConsoleMessage:V')
}

function hmrBuild() {
  const myNetworkIp = getMyNetworkIp()

  runShellStep('Cleaning old build...', 'rm -rf tizen-build')
  runShellStep('Making build output folder...', 'mkdir tizen-build')
  runShellStep('Wait for the HMR server to spin up...', `while ! echo exit | nc localhost 8080; do sleep 1; done`)
  runShellStep(`Downloading HMR server's index.html`, `curl "http://${myNetworkIp}:8080/index.html" > ./tizen-build/index.html`)
  runShellStep(`Downloading HMR server's bundle.js`, `curl "http://${myNetworkIp}:8080/bundle.js" > ./tizen-build/bundle.js`)
  runShellStep(`Fix HMR bundle.js to work on device (1)...`, `sed -i '' 's|__webpack_require__.p = "/";|__webpack_require__.p = "http://${myNetworkIp}:8080/";|' ./tizen-build/bundle.js`)
  runShellStep(`Fix HMR bundle.js to work on device (2)...`, `sed -i '' 's|/sockjs-node|http://${myNetworkIp}:8080/sockjs-node|' ./tizen-build/bundle.js`)

  emulatorBuild(false)
}

function deviceBuild() {
  runShellStep(`Connect to your device on the network ${packageJson.tizen.deviceIp}...`, `sdb connect ${packageJson.tizen.deviceIp}`)
  buildDeployCore()
}


function buildDeployCore(includePreactBuild = true) {
  const tizenBuildCwd = { cwd: './tizen-build', stdio: 'inherit' }

  if (includePreactBuild) {
    runShellStep('Cleaning old build...', 'rm -rf tizen-build')
    runShellStep('Making build output folder...', 'mkdir tizen-build')
    runShellStep('Including preact build output...', 'cp ./build/* ./tizen-build')
    runShellStep('Remove un-necessary files from preact build output...', 'rm favicon.ico *.map sw.js', tizenBuildCwd)
  }

  runShellStep('Copy in tizen stuff...', 'cp ./tizen/* ./tizen-build')

  //template transforms
  runStep('Transform .project.ejs > .project', () => transformTizenTemplate('.project.ejs'))
  runStep('Transform config.xml.ejs > config.xml', () => transformTizenTemplate('config.xml.ejs'))

  runShellStep('Build tizen web project', 'tizen build-web', tizenBuildCwd)
  runShellStep('Package tizen project using specified signature', `tizen package -t wgt -s ${packageJson.tizen.signatureName}`, tizenBuildCwd)
  runShellStep('Install package on device', `tizen install -n ${packageJson.name}.wgt`, tizenBuildCwd)
}


function transformTizenTemplate(fileName) {
  const args = Object.assign({ projectName: packageJson.name }, packageJson.tizen)
  const output = _.template(fs.readFileSync(`./tizen/${fileName}`).toString())(args)
  fs.writeFileSync(`./tizen-build/${fileName.replace('.ejs', '')}`, output)
}

function writeMessage(message) {
  process.stdout.write(`\x1b[36m${message}\x1b[0m`)
}

function runStep(whatsHappeningText, actionFunc) {
  writeMessage(whatsHappeningText)

  let failureReason = false

  try {
    actionFunc()
  } catch (err) {
    failureReason = err.toString()
  }

  if (failureReason) {
    console.log()
    console.log(` ❌  ${failureReason}`)
    console.log()
    console.log('\x1b[31mAborting beta release due to above error(s)\x1b[0m')
    process.exit(1)
  }
  console.log(' ✅')
}

function runShellStep (whatsHappeningText, command, params = {}) {
  runStep(whatsHappeningText, () => (cp.execSync(command, params) || '').toString())
}

function getMyNetworkIp() {
  let interfaces = require('os').networkInterfaces()
  for (let devName in interfaces) {
    let iface = interfaces[devName]

    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address
    }
  }
  return '0.0.0.0'
}