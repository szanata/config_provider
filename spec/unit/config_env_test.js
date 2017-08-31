const chai = require('chai');
const cfgPath = require( 'path' ).join( __dirname, '../config' );

const expect = chai.expect;

describe('Environment sensitive config test', () => {
  describe('Should load from the root key with the same name as the NODE_ENV, ignoring the other paths in the file', () => {

    afterEach(() => {
      delete require.cache[require.resolve( '../../lib/index' )];
      process.env.NODE_ENV = 'test';
    });

    it('Should load NODE_ENV "staging" config', () => {
      process.env.NODE_ENV = 'staging';

      const ConfigProvider = require('../../lib/index');
      ConfigProvider.load( cfgPath );

      const stagingColor = ConfigProvider.get( 'settings.color' );

      expect( stagingColor ).to.eql( 'blue' );
    });

    it('Should load NODE_ENV "production" config', () => {
      process.env.NODE_ENV = 'production';

      const ConfigProvider = require('../../lib/index');
      ConfigProvider.load( cfgPath );

      const productionColor = ConfigProvider.get( 'settings.color' );

      expect( productionColor ).to.eql( 'white' );
    });
  });
});
