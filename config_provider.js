

/**
 * Dynamic load configuration files
 * Filter env sensitive configurations (development, staging, etc)
 * Apply overwrites from env vars
 */

const walk = require('walk.js');
const path = require('path');

let configs;

function loadFilesFromPath( cgfPath ) {
  configs = walk( cgfPath )
    // load files by their names as an array of { fileNameWithoutExtesion: { content} }
    .map( filePath => {
      const name = filePath.replace( /(.+\/)*/g, '' ).replace( /\.js$|\.json$/, '' );
      return { [name]: require( filePath ) };
    } )
    // map that array to a object
    .reduce( ( output, obj ) => {
      const k = Object.keys( obj )[0];
      output[k] = obj[k];
      return output;
    }, {} );
}

// filter the files that have first level ENV name sensitive configuration
function filterEnvSensitiveConfigs() {
  const env = process.env.NODE_ENV;
  for (let k in configs) {
    if ( configs[k][env] ) {
      configs[k] = configs[k][env];
    }
  }
}

// overwrite env vars on those configurations
// if config is number and env is string, try converting
function overwriteEnvVars( ) {
  const vars = Object.keys( process.env );
  vars.forEach(function (_var) {
    const propsCascade = _var.split('__').map( v => v.toLowerCase() );
    const value = process.env[_var];
    const innerPropName = propsCascade.pop();
    const lastPropObject = propsCascade.reduce( (o, p) => o[p] , configs );
    if (!lastPropObject) { return; }
    let newValue = value;
    if ( typeof lastPropObject[innerPropName] === 'number' ) {
      newValue = parseFloat( newValue );
    }
    lastPropObject[innerPropName] = newValue
  });
}

module.exports = {

  // load config files  
  load( cgfPath ) {
    loadFilesFromPath( cgfPath );
    filterEnvSensitiveConfigs( );
    overwriteEnvVars( );
  },
  
  // get some key
  get( key ) {
    return key.split('.').reduce( (prev, curr) => {
      return prev ? prev[curr] : undefined
    }, configs );
  }
}
