

/**
 * Dynamic load configuration files
 * Filter env sensitive configurations (development, staging, etc)
 * Apply overwrites from env vars
 */

const walk = require( 'walk.js' );
const path = require( 'path' );

let configs;
let alreadyLoaded = false;

const defaultPath = path.join( __dirname, 'config' );

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
      return Object.assign( { }, output, { [k]: obj[k] } );
    }, {} );
}

// filter the files that have first level ENV name sensitive configuration
function filterEnvSensitiveConfigs() {
  const env = process.env.NODE_ENV;
  Object.keys( configs ).forEach( key => {
    if ( configs[key][env] ) {
      configs[key] = configs[key][env];
    }
  } );
}

// overwrite configurations with values in the ENV, if they have the same name
// if config is number and env is string, try converting
function overwriteEnvVars( ) {
  const vars = Object.keys( process.env );
  vars.forEach( variable => {
    const propsCascade = variable.split( '__' ).map( v => v.toLowerCase() );
    const value = process.env[variable];
    const innerPropName = propsCascade.pop();
    const lastPropObject = propsCascade.reduce( ( o, p ) => o[p], configs );

    if ( !lastPropObject ) { return; }

    let newValue = value;
    if ( typeof lastPropObject[innerPropName] === 'number' ) {
      newValue = parseFloat( newValue );
    }
    lastPropObject[innerPropName] = newValue;
  } );
}

module.exports = {

  // load config files
  load( userPath = null ) {
    if ( alreadyLoaded ) { return; } // load only once

    const cfgPath = userPath || defaultPath;

    if ( !cfgPath ) {
      throw new Error( 'You must set up the config path.' );
    }

    loadFilesFromPath( cfgPath );
    filterEnvSensitiveConfigs( );
    overwriteEnvVars( );
    alreadyLoaded = true;
  },

  // get some key
  get( key ) {
    this.load( );
    return key.split( '.' ).reduce( ( prev, curr ) => ( prev ? prev[curr] : undefined ), configs );
  }
};
