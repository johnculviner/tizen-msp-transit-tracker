export default (config, env, helpers) => {
  // allow watch/emulator to talk to dev/hot reload server
  if (config.devServer) {
    Object.assign(config.devServer, {
      disableHostCheck: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      quiet: false
    })
  }
}