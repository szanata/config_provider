# Config provider

A service module to load global app configurations from files and join environment variables together
Filter those by the environment (staging, production, test, development, etc)  
And overwrite some of those with ENV variables

## Install & import

`npm install config_provider`

```js
const ConfigProvider = require( 'config_provider' );
```

## Load config files

### Eager loading
All *.json* and *.js* files inside a folder in root of the app called */config* will
be read as soons as this modules is required, so no actions required.


### Lazy loading
You can setup another folder containing your configuration files with the *.load()*:

```js
ConfigProvider.load( './path/to/my/configs' );
```

The parameter path is a string, and should be relative to the current folder.

## Accessing configurations

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

*Note that the file extension is omitted when accessing the value*

## Applying ENV variables to the configs

All environment variables, which names are compliant with the IEEE Std 1003.1-2001 norm
(upper case letters, _ and numbers) are automatically applied to the configs, and can be
accessed the same way as any other config.

```js
process.env.FOO = 'bar';
const ConfigProvider = require( 'config_provider' );

ConfigProvider.get( 'foo' ) === 'bar'; // true
```

### Overwriting via ENV variables

You can overwrite any configuration, even nested ones, via the environment variables, just use __
(double underscores) to indicate a new level:


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
to the current *process.env.NODE_ENV*:

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

*Note that you do not need to write the env name in the path to access the value using the .get()*

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

Any ENV variable which the value is a number or a boolean, will be converted when read by the *.get()*

## Notes

- Don't use camelCase on the configurations, prefer sneak_case.

- This was tested with pm2, mocha, node shell and node script.
