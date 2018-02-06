import { Component } from 'preact'
import Stop from './Stop/Stop'
import tizen from './tizen'
import { loadUserStops } from './stopService'

require('./index.scss')

if (module.hot) {
  require('preact/debug')
}

export default class App extends Component {
  constructor(props) {
    super(props)

    const stops = loadUserStops()

    this.state = {
      stops,
      currentStop: stops[0]
    }
  }

  nextStop = () => {
    const { stops, currentStop } = this.state
    const newStop = stops[stops.indexOf(currentStop) + 1]
    this.setState({ currentStop: newStop || stops[0] })
  }

  prevStop = () => {
    const { stops, currentStop } = this.state
    const newStop = stops[stops.indexOf(currentStop) - 1]
    this.setState({ currentStop: newStop || stops[stops.length - 1] })
  }

  componentDidMount() {
    tizen('power.request', x => x('SCREEN', 'SCREEN_NORMAL'))
    document.addEventListener('tizenhwkey', () => {
      console.log('Exiting Bus Tracker!')
      window.tizen.application.getCurrentApplication().exit()
    })

    document.addEventListener('rotarydetent', ev => ev.detail.direction === 'CW' ? this.nextStop() : this.prevStop())
  }

  render(props, {currentStop, stops}) {
    return (
      <div id="app">
        <Stop key={currentStop.number} stop={currentStop} stops={stops} />
        <div class="faux-bezel">
          <button class="cw" onClick={this.nextStop}>&gt;</button>
          <button class="ccw" onClick={this.prevStop}>&lt;</button>
        </div>
      </div>
    )
  }
}
