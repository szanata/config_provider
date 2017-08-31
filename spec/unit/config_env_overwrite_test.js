const chai = require('chai');
const cfgPath = require( 'path' ).join( __dirname, '../config' );

const expect = chai.expect;

process.env.NODE_ENV = 'test';

describe('Config Overwrite with ENV vars', () => {

  let ConfigProvider;

  before(() => {
    process.env.SETTINGS__COLOR = 'yellow';
    process.env.GLOBAL__SETTINGS__COLORS__RED = '#00fd00';
    process.env.GLOBAL__SETTINGS__MENU = 3;
    process.env.xandar_green = 'some_value';
    process.env.FOO__BAR = 'foo-bar';
    process.env.FALSE_BOOL_VALUE = false;
    process.env.TRUE_BOOL_VALUE = true;
    process.env.NUMBER_VALUE = 0;
  });

  beforeEach( () => {
    ConfigProvider = require('../../lib/index');
    ConfigProvider.load( cfgPath );
  });

  after(() => {
    delete require.cache[require.resolve( '../../lib/index' )];
    delete process.env.SETTINGS__COLOR;
    delete process.env.GLOBAL__SETTINGS__COLORS__RED;
    delete process.env.GLOBAL__SETTINGS__MENU;
    delete process.env.xandar_green;
    delete process.env.FOO__BAR;
    delete process.env.FALSE_BOOL_VALUE;
    delete process.env.TRUE_BOOL_VALUE;
    delete process.env.NUMBER_VALUE;
  });

  it('Should replace configs with env vars with the same name (and path)', () => {
    const color = ConfigProvider.get( 'settings.color' );
    const red = ConfigProvider.get( 'global.settings.colors.red' );
    const menu = ConfigProvider.get( 'global.settings.menu' );
    expect( color ).to.eql( process.env.SETTINGS__COLOR );
    expect( red ).to.eql( process.env.GLOBAL__SETTINGS__COLORS__RED );
    expect( menu ).to.eql( parseFloat( process.env.GLOBAL__SETTINGS__MENU ) );
  });

  it('Should only set ENV vars on the IEEE Std 1003.1-2001 standart', () => {
    const value = ConfigProvider.get( 'xandar_green' );
    expect( value ).to.eql( undefined );
  });

  it('Should set any ENV var, even if is not overwriting anything', () => {
    const value = ConfigProvider.get( 'foo.bar' );
    expect( value ).to.eql( process.env.FOO__BAR );
  });

  it('Should parse ENV var value to boolean "true" if possible', () => {
    const value = ConfigProvider.get( 'true_bool_value' );
    expect( value ).to.eql( true );
  });

  it('Should parse ENV var value to boolean "false" if possible', () => {
    const value = ConfigProvider.get( 'false_bool_value' );
    expect( value ).to.eql( false );
  });

  it('Should parse ENV var value to number if possible', () => {
    const value = ConfigProvider.get( 'number_value' );
    expect( value ).to.eql( parseFloat( process.env.NUMBER_VALUE ) );
  });
});
