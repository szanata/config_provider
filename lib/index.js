

/**
 * Dynamic load configuration files
 * Filter env sensitive configurations (development, staging, etc)
 * Apply overwrites from env vars
 */

const walk = require( 'walk.js' );
const path = require( 'path' );
const fs = require( 'fs' );
const deepmerge = require('deepmerge')

let configs = { };
const defaultPath = path.join( process.cwd(), 'config' );

function loadFilesFromPath( cfgPath ) {
  if ( !fs.existsSync( cfgPath ) ) {
    return;
  }

  configs = walk( cfgPath )
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

/**
 * Converts ENv var value
 * Only number and bool strings are converted
 */
function parseEnvValue( value ) {
  if ( /^[0-9]+(?:\.[0-9]+)?$/.test( value ) ) {
    return parseFloat( value );
  } else if ( value === 'true' ) {
    return true;
  } else if ( value === 'false' ) {
    return false;
  }
  return value;
}

/**
 * Apply values in the ENV vars to the configs
 * Use __ (double underscore) as a symbol to nest properties
 * Do not apply ENV vars not conforming with the IEEE Std 1003.1-2001 standart
 * (tl:dr A-Z_0-9)
 */
function overwriteEnvVars( ) {
  const vars = Object.keys( process.env ).filter( name => /^[A-Z_0-9]+$/.test(name) );

  vars.forEach( variable => {
    const propsCascade = variable.split( '__' ).map( v => v.toLowerCase() );
    const value = parseEnvValue( process.env[variable] );
    const tree = { };

    propsCascade.reduce( (obj, key, index, array) => {
      obj[key] = ( array.length - 1 === index ) ? value : { };
      return obj[key];
    }, tree );

    configs = deepmerge( configs, tree );
  } );
}

module.exports = {

  // load config files
  load( userPath = null ) {
    configs = {};
    const cfgPath = userPath || defaultPath;

    loadFilesFromPath( cfgPath );
    filterEnvSensitiveConfigs( );
    overwriteEnvVars( );
  },

  // get some key
  get( key ) {
    return key.split( '.' ).reduce( ( prev, curr ) => ( prev ? prev[curr] : undefined ), configs );
  }
};

module.exports.load();
