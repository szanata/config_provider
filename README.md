# Config provider

A service module to load global app configurations from files and join environment variables together
Filter those by the environment (staging, production, test, development, etc)  
And overwrite some of those with ENV variables

## Install & import

```bash
npm install config-provider
```

```js
const ConfigProvider = require( 'config-provider' );
```

## Load config files

### Eager loading
All **.json** and **.js** files inside a folder called **/config** in app root will
be read as soon as this module is required by the project, so no actions required.


### Lazy loading
But, you can setup a alternative folder containing your configuration files with the `.load()` method:

```js
ConfigProvider.load( './path/to/my/configs' );
```

The parameter path is a string, and should be relative to the current folder.

## Accessing configurations

Just use the `(.get()` method, with the path to the value, like this:

```js
const value = ConfigProvider.get( 'general.system.input.type' );
```

In this example, there was a file called *general.json* with this content:
```js
{
  "system": {
    "input": {
      "type": "dynamic"
    }
  }
}
```

So the path will be like acessing properties of a JS object, where the first is the file name.

*Note that the file extension is omitted when accessing the value*

## Applying ENV variables to the configs

All environment variables which names are compliant with the IEEE Std 1003.1-2001 norm
(upper case letters, _ and numbers) are automatically applied to the configs, and can be
accessed the same way as any other config.

```js
process.env.FOO = 'bar';
const ConfigProvider = require( 'config_provider' );

ConfigProvider.get( 'foo' ) === 'bar'; // true
```

### Overwriting via ENV variables

You can overwrite any configuration, even nested ones, via the environment variables, just use **__**
(double underscores) to indicate a nexted value:


Given a *configs.json*:
```js
{
  "colors": {
    "red": "#00ff00"
  }
}
```

And a main file:
```js
process.env.CONFIGS__COLORS__RED = 'red';
const ConfigProvider = require( 'configs.json' );

ConfigProvider.get( 'configs.colors.red' ) === 'red'; // true
```

## NODE_ENV sensitive configurations

If in the same config file you have configurations for more than one environment, like staging,
production and development, the **ConfigProvider** will read just the appropriate one according
to the current `process.env.NODE_ENV`:

Given a *config.json*:
```js
{
  "production": {
    "token": "23983748367394"
  },
  "staging": {
    "token": "fake_token"
  }
}
```

And a main file:
```js
process.env.NODE_ENV = 'staging';
const ConfigProvider = require( 'configs.json' );

ConfigProvider.get( 'token' ) === 'fake_token'; // true
```

*Note that you do not need to write the NODE_ENV name in the path to access the value using the `.get()`*

## Supported files

Both *.json* and *.js* files are read as configurations. For *.js* files, it must export a literal object to work:

A *config.js* file:
```js
module.exports = {
  config: {
    color: 'red'
  }
};
```

## Environment variables values parsing

Any ENV variable which the value is a number or a boolean, will be converted when read:

```js
process.env.SOME_VALUE = '3';
const ConfigProvider = require( 'configs.json' );

ConfigProvider.get( 'some_value' ) === 3; // true
```

## Notes

- Don't use camelCase on the configurations, prefer sneak_case.

- This was tested with pm2, mocha, node shell and node script.
