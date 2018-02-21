# tizen-msp-transit-tracker
A Preact app running as a Tizen Web Application to track MetroTransit bus geo-location data and schedule for whatever stops you want on your Gear S3 watch. (Currently stops are hardcoded to ones I use with plans to add ability to customize this in the future)

Some project technical goals:
- Quick application startup and low resource usage (Preact beat out Vue.js here quite handily https://github.com/johnculviner/vuejs-tizen-msp-bus-tracker)
- Avoid using TizenStudio since I was having trouble getting it to work consistently

Personal Goals:
- Stop missing the bus and know when to run to possibly catch the bus

## Action Shot
![action shot](https://raw.githubusercontent.com/johnculviner/tizen-msp-transit-tracker/master/action-shot.jpg)

## Doin stuff

- make sure you have TizenStudio installed (or at least the CLI stuff) with some important stuff in your .(bash|zsh)rc 
``` bash
export PATH="$HOME/tizen-studio/tools:$PATH"
export PATH="$HOME/tizen-studio/tools/ide/bin:$PATH"
export PATH="$HOME/tizen-studio/tools/emulator/bin:$PATH"
```


``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080 in a web browser
# (looks like a pretend watch minus the Tizen APIs but hey you can debug and live reload!)
npm run dev

# run the app in the tizen emulator with hot module reloading
npm run hmr-emulator

# build / deploy to a s3 tizen wearable (currently hardcoded to my watches IP on my home network)
npm run device

# run the app in the tizen emulator
npm run emulator
```
