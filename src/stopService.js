const KEY = 'stops'

// TODO for real
export function loadUserStops() {
  return [{ route: '6', name: '50th & Xerxes', number: 6243, lat: 44.912357, lon: -93.318793 },
    { route: '6', name: '44th & France', number: 1292, lat: 44.921891, lon: -93.329013 },
    { route: '146', name: 'Marquette & 10th', number: 53305, lat: 44.973523, lon: -93.273283 },
    { route: '146', name: 'Marquette & 4th', number: 53302, lat: 44.979315, lon: -93.268434 },
    { route: '6', name: 'Hennepin & 10th', number: 17924, lat: 44.975879, lon: -93.277893 }]
  // return JSON.parse(window.localStorage.getItem(KEY))
}

export function saveUserStops(newStops) {
  window.localStorage.setItem(KEY, JSON.stringify(newStops))
}

export function getStopInfo(number){
  return fetch(`http://johnculviner.hopto.org/stops/${number}`)
}

export function addStop(number, route, name, lat, lon) {
  const stops = loadUserStops()
  stops.push({ number, route, name, lat, lon })
  saveUserStops(stops)
}

export function deleteStop(number) {
  saveUserStops(loadUserStops().filter(x => x.number !== number))
}
