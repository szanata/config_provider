const chai = require('chai');
const should = require('chai').should();
const expect = chai.expect;
const cfgPath = require( 'path' ).join( __dirname, '../config' );

describe('Config Provider tests', () => {

  let ConfigProvider;

  beforeEach(() => {
    ConfigProvider = require('../../index');
  });

  afterEach(() => {
    delete require.cache[require.resolve( '../../index' )];
  });

  it('Should load ENV "staging" config', () => {
    process.env.NODE_ENV = 'staging'
    ConfigProvider.load( cfgPath );
    const stagingColor = ConfigProvider.get( 'settings.color' );

    expect( stagingColor ).to.eql( 'blue' );
  });

  it('Should load ENV "production" config', () => {
    process.env.NODE_ENV = 'production'
    ConfigProvider.load( cfgPath );
    const productionColor = ConfigProvider.get( 'settings.color' );

    expect( productionColor ).to.eql( 'white' );
  });

  it('Should overload configs with env vars', () => {

    process.env.SETTINGS__COLOR = 'yellow';
    process.env.GLOBAL__SETTINGS__COLORS__RED = '#00fd00';
    process.env.GLOBAL__SETTINGS__MENU = 3;
    ConfigProvider.load( cfgPath );

    const color = ConfigProvider.get( 'settings.color' );
    const red = ConfigProvider.get( 'global.settings.colors.red' );
    const menu = ConfigProvider.get( 'global.settings.menu' );

    expect( color ).to.eql( 'yellow' );
    expect( red ).to.eql( '#00fd00' );
    expect( menu ).to.eql( 3 );
  });
});
