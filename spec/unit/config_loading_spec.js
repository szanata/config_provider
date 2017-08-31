const chai = require('chai');
const should = require('chai').should();
const expect = chai.expect;
const spawnSync = require( 'child_process' ).spawnSync;

const cfgPath = require( 'path' ).join( __dirname, '../config' );

describe('Config loading tests', () => {

  afterEach(() => {
    delete require.cache[require.resolve( '../../lib/index' )];
  });

  describe('Custom config load via .load()', () => {

    it('Should load all configs from given path (.js & .json)', () => {
      const ConfigProvider = require('../../lib/index');
      ConfigProvider.load( cfgPath );

      const red = ConfigProvider.get( 'global.settings.colors.red' );
      const menu = ConfigProvider.get( 'global.settings.menu' );
      const gThreshold = ConfigProvider.get( 'config.crawler.global_threshold' );

      expect( red ).to.eql( '#00ff00' );
      expect( menu ).to.eql( 2 );
      expect( gThreshold ).to.eql( 1000 );
    });

    it('Should not load anything if the path do not exists', () => {
      const ConfigProvider = require('../../lib/index');
      ConfigProvider.load( 'random_path' );
      const foo = ConfigProvider.get( 'foo' );

      expect( foo ).to.eql( undefined );
    });
  });

  describe('Default config load via ./config/', () => {

    after( () => {
      spawnSync('mv', ['./not_the_config_you_are_looking_for', './config'] )
    });

    it('Should load all configs from default "/config" folder if none was specified', () => {
      const ConfigProvider = require('../../lib/index');
      const foo = ConfigProvider.get( 'foo' );

      expect( foo.bar ).to.eql( 1 );
    });

    it('Should not load default config if ./config does not exists', () => {
      spawnSync('mv', ['./config', './not_the_config_you_are_looking_for'] )
      const ConfigProvider = require('../../lib/index');
      const foo = ConfigProvider.get( 'foo' );

      expect( foo ).to.eql( undefined );
    });
  });
});
