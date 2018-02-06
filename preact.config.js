// preact.config.js
export default function (config, env, helpers) {
  config.output.filename = '[name].js'
  let { plugin } = helpers.getPluginsByName(config, 'UglifyJsPlugin')[0]
  plugin.options.sourceMap = false
}