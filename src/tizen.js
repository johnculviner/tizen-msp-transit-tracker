/* eslint-disable no-console */
import get from 'lodash.get'

export default function (apiPath, func) {
  if (!window.tizen) return

  try {
    func(get(window.tizen, apiPath))
  } catch (e) {
    console.log('caught error')
    console.log(JSON.stringify(e))
  }
}