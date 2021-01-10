const repl = require('./lib/repl')

const DEFAULT_HANDLE_INFO = {
  app: 'Fastify app handle',
  cb: 'results callback which will print the output',
  result: 'handle on which cb() store results'
}

const DEFAULT_CONFIG = {
  quiet: false,
  prompt: 'fastify > ',
  useGlobal: true,
  ignoreUndefined: true,
  historyPath: ''
}

function FastifyConsole () {
  this.ctx = {
    config: { ...DEFAULT_CONFIG },
    handles: {},
    handleInfo: {},
    models: []
  }
}

function active () {
  return process.argv.indexOf('--console') !== -1
}

function start (app, config) {
  // assign app to ctx
  this.ctx.app = this.ctx.app || app
  // assing require deafult config
  Object.assign(this.ctx.config, config)

  // assign app in ctx handle if not exists
  if (!(app in this.ctx.handles)) {
    this.ctx.handles.app = app
    this.ctx.handleInfo.app = DEFAULT_HANDLE_INFO.app
  }
  // assign models in ctx from mongoose decorator
  const { mongoose } = app
  if (mongoose) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(mongoose.instance.models)) {
      this.ctx.models[key] = value
    }
  }
  // print info about handles and usase information
  if (!config.quite) {
    // eslint-disable-next-line no-console
    console.log(repl.usage(this.ctx))
  }
  return repl.run(this.ctx)
}

/*
  Returns boolean value if console should be active or not
*/
FastifyConsole.prototype.active = active

/*
  Loads configurations and starts REPL console
*/
FastifyConsole.prototype.start = start

/*!
 * The exports object is an instance of FastifyConsole.
 */
// eslint-disable-next-line no-multi-assign
module.exports = exports = new FastifyConsole()
