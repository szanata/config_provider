# Config provider

A service module to load json configuration files from some path
Filter by environment if its sensitive to this
And overwrite ENV vars on those files

## 1. Install & import

`npm install config_provider`

```js
const ConfigProvider = require( 'config_provider' );
```

## 2. Load files
Se the path to read the files
```js
var cfgPath = require('path').join( __dirname, '../config' );
ConfigProvider.load( cfgPath );
```

## 3. Get configurations
Given a file `settings.json` with:
```js
{
  "global": {
    "method_type": "static"
  }
}
```

You can access the configs as:
```js
const type = ConfigProvider.get( 'settings.global.method_type' );
```

## 4. Overwriting configurations
Given a file `settings.json` with:
```js
{
  "global": {
    "method_type": "static"
  }
}
```

And you want to overwrite that with a ENV var, use:
```bash
  SETTINGS__GLOBAL__METHOD_TYPE=dynamic
```

So:
```js
const type = ConfigProvider.get( 'settings.global.method_type' );
type === 'dynamic' // true
```

## 4. Notes

- The first part of the path used in `get` is the name of the file, without the extension, so if some file is `config.json`, it will be accessible as `config`.

- Don't use camelcase on the configurations, prefer sneak_case.

- On overwriting with ENV vars, use double underscores ( _ + _ ) to split the path.
