const repl = require('repl')

function FastifyRepl () {
  this.replServer = {}
}

function run (ctx) {
  const config = { ...ctx.config }
  this.replServer = repl.start(config)

  Object.assign(this.replServer.context, ctx.handles)
  this.defineUsage(ctx)
  // wrap eval method of repl to process promises
  this.replServer.eval = this.wrapReplEval(this.replServer)
  // quite console and exit process
  this.replServer.on('exit', () => {
    process.exit()
  })
  return this.replServer
}

function defineUsage (ctx) {
  const self = this
  this.replServer.defineCommand('usage', {
    help: 'Fastify Console usage information',
    action () {
      this.outputStream.write(self.usage(ctx, true))
      this.displayPrompt()
    }
  })
}

function usage (ctx) {
  const modelsHandles = Object.keys(ctx.models)
  let info = '======================================\nFastify console \nPrimary handles available\n'
  Object.keys(ctx.handleInfo).forEach((key) => {
    info += ` - ${key}: ${ctx.handleInfo[key]}\n`
  })
  if (modelsHandles.length) {
    info += '\nModels: \n'
    info += ` - ${modelsHandles.join(', ')}\n`
  }
  return info
}

function wrapReplEval (replServer) {
  const defaultEval = replServer.eval
  // eslint-disable-next-line func-names
  return function (code, context, file, cb) {
    function resolvePromises (promise, resolved) {
      Object.keys(context).forEach((key) => {
        // Replace any promise handles in the REPL context with the resolved promise
        if (context[key] === promise) {
          context[key] = resolved
        }
      })
    }
    return defaultEval.call(this, code, context, file, (err, result) => {
      if (!result || !result.then) {
        return cb(err, result)
      }
      result.then((resolved) => {
        resolvePromises(result, resolved)
        cb(null, resolved)
      }).catch((error) => {
        resolvePromises(result, error)
        // eslint-disable-next-line no-console
        console.log('\x1b[31m [Promise Rejection] \x1b[0m')
        if (error && error.message) {
          // eslint-disable-next-line no-console
          console.log(`\x1b[31m  ${error.message} \x1b[0m`)
        }
        // Application errors are not REPL errors
        cb(null, err)
      })
    })
  }
}

/*
* Start REPL server with required config
*/
FastifyRepl.prototype.run = run
FastifyRepl.prototype.defineUsage = defineUsage
FastifyRepl.prototype.usage = usage
FastifyRepl.prototype.wrapReplEval = wrapReplEval
/*!
  * The exports object is an instance of FastifyRepl.
  */
// eslint-disable-next-line no-multi-assign
module.exports = exports = new FastifyRepl()
