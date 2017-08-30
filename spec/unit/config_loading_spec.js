const chai = require('chai');
const should = require('chai').should();
const expect = chai.expect;

const cfgPath = require( 'path' ).join( __dirname, '../config' );

describe('Config loading tests', () => {

  afterEach(() => {
    delete require.cache[require.resolve( '../../index' )];
  });

  it('Should load all configs from given path', () => {
    const ConfigProvider = require('../../index');
    ConfigProvider.load( cfgPath );

    const red = ConfigProvider.get( 'global.settings.colors.red' );
    const menu = ConfigProvider.get( 'global.settings.menu' );
    const gThreshold = ConfigProvider.get( 'config.crawler.global_threshold' );

    expect( red ).to.eql( '#00ff00' );
    expect( menu ).to.eql( 2 );
    expect( gThreshold ).to.eql( 1000 );
  });

  it('Should load all configs from default "/config" folder if none was specified', () => {
    const ConfigProvider = require('../../index');
    const foo = ConfigProvider.get( 'foo' );

    expect( foo.bar ).to.eql( 1 );
  });

  it('Should not load anything but the default config, if the path do not exists', () => {
    const ConfigProvider = require('../../index');
    ConfigProvider.load( 'random_path' );
    const foo = ConfigProvider.get( 'foo' );

    expect( foo ).to.eql( { bar: 1 } );
  });
});
