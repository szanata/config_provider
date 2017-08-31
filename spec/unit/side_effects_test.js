const chai = require('chai');
const cfgPath = require( 'path' ).join( __dirname, '../config' );

const expect = chai.expect;

process.env.NODE_ENV = 'test';

describe('Side Effects test', () => {

  afterEach(() => {
    delete require.cache[require.resolve( '../../lib/index' )];
  });

  it('After loading from a file, overwriting from the environment, the config file should still be unharmed', () => {
    process.env.GLOBAL__SETTINGS__MENU = 10;

    const ConfigProvider = require('../../lib/index');
    ConfigProvider.load( cfgPath );

    const menu = ConfigProvider.get( 'global.settings.menu' );
    expect( menu ).to.eql( 10 );

    const originalConfig = require( '../config/global' );
    expect( originalConfig.settings.menu ).to.eq( 2 );

    delete process.env.GLOBAL__SETTINGS__MENU;
  });

  it('Should remove old config after another .load() call', () => {
    const ConfigProvider = require('../../lib/index');
    ConfigProvider.load( cfgPath );

    let menu = ConfigProvider.get( 'global.settings.menu' );
    expect( menu ).to.eql( 2 );

    ConfigProvider.load( 'random-folder' );

    menu = ConfigProvider.get( 'global.settings.menu' );
    expect( menu ).to.eq( undefined );
  });
});
