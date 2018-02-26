import { Component } from 'preact'
import util from '../util'
import getJson from '../getJson'

require('./stop.scss')

export default class Stop extends Component {
  state = {
    times: [],
    nowString: new Date().toLocaleTimeString()
  }

  componentDidMount() {
    this.refreshStop()

    this.interval = setInterval(() => {
      this.setState({ nowString: new Date().toLocaleTimeString() })
      if (new Date() - this.state.lastUpdate > 30000) {
        this.refreshStop()
      }
    }, 1000)
  }

  getTimeTillRefresh() {
    const time = 30 - Math.round((new Date() - this.state.lastUpdate) / 1000)
    return time < 10 ? `0${time}` : time
  }

  refreshStop = () => {
    const { stop } = this.props
    this.setState({ isRefreshing: true, lastUpdate: new Date() })

    getJson(`http://svc.metrotransit.org/NexTrip/${stop.number}?format=json`, obj => {
      const times = obj
        .filter(x => x.Route === stop.route)
        .map(x => ({
          route: x.Route + x.Terminal,
          scheduledDeparture: util.get12HourTime(new Date(parseInt(/\((.*?)-/.exec(x.DepartureTime)[1]))),
          nextTripText: x.DepartureText,
          distanceMiles: x.VehicleLatitude ? util.latLongDistance(x.VehicleLatitude, x.VehicleLongitude, stop.lat, stop.lon).toFixed(2) : null
        }))
      this.setState({ isRefreshing: false, times })
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render({ stop, stops }, { nowString, isRefreshing, times }) {
    return (
      <div class="stop">
        <div class="route-info full-width">
          <div>{stop.route} @</div>
          <div>{stop.name}</div>
          <div class="position-indicators">
            { stops.map(x =>
              <div key={x.number} class={`position-indicator ${stop === x ? 'active' : ''}`} />
            )}
          </div>
        </div>
        <div class="data">
          <h2>
            {nowString}&nbsp;🔄 :{this.getTimeTillRefresh()}
          </h2>
          {isRefreshing && <div class="cog">🔄</div>}
          {!times.length && <h3 class="no-busses">No scheduled buses!</h3>}
          <ul>
            {
              times.map(time => (
                <li key={time.scheduledDeparture} class="time">
                  <span class="route">{time.route}</span>&nbsp;
                  {time.distanceMiles &&
                    <span>{time.nextTripText} - {time.distanceMiles}mi</span>
                  }
                  &nbsp;{time.scheduledDeparture}
                </li>
              ))
            }
          </ul>
        </div>
        <button onClick={this.refreshStop} class="refresh-stop full-width">
          Refresh
        </button>
      </div>
    )
  }
}
