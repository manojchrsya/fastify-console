# fastify-console
Command line tool to debug fastify app and execute app methods directly.
![alt text](./assets/console.png "Fastify Console")

#### Install
```
  npm i fastify-console --save
```

#### Setup
To use the package you have to intergrate with your `server.js` file in your project.
if you have use `fastify-cli` to create your project, then you might not have `server.js`.

In that case you need to create a new `server.js` file in root directory.

``` javascript
  const Fastify = require('fastify');
  const fp = require('fastify-plugin');
  const FastifyConsole = require('fastify-console');

  // Instantiate Fastify with some config
  const app = Fastify({ logger: true, pluginTimeout: 3000 });
  const App = require('./app');

  // Register your application as a normal plugin.
  app.register(fp(App), {});
```

if you already have `server.js` file then checkout below code to integrate with your app.

```javascript
if (FastifyConsole.active()) {
  app.ready((error) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
    }
    return FastifyConsole.start(app, {
      prompt: 'fastify > ',
    });
  });
} else if (require.main === module) {
  // Start listening.
  app.listen(process.env.PORT || 3000, '0.0.0.0', (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
}
```
#### Configurations
| Option            | Type           | Defaults     |  Descriptions   |
| ----------------- |:-------------: | :----------: | :-------------: |
| quiet             | Boolean        | false        | Displays help descriptions when console get started                |
| prompt            | String         | fastify >    | The input prompt to display.                |
| useGlobal         | Boolean        | true         | Default evaluation function will use the JavaScript global        |
| ignoreUndefined   | Boolean        | true         | Writer will not output the return value of a command if it evaluates to `undefined`                |
| historyPath       | String         | ''           | The path to a file to persist command history.                |

Note: for more details about condig please check [NodeJS Repl](https://nodejs.org/api/repl.html)

-------------------------------------------

#### License

fastify-console uses the MIT license. See [LICENSE](./LICENSE) for more details.
