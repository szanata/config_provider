const chai = require('chai');
const should = require('chai').should();
const expect = chai.expect;

const ConfigProvider = require('../../config_provider');

describe('Config Provider tests', () => {
  
  it('Should load all configs from given path', function () {
    ConfigProvider.load( './spec/config' );
    
    var red = ConfigProvider.get( 'global.settings.colors.red' );
    var menu = ConfigProvider.get( 'global.settings.menu' );
    var gThreshold = ConfigProvider.get( 'config.crawler.global_threshold' );
    
    expect( red ).to.eql( '#00ff00' );
    expect( menu ).to.eql( 2 );
    expect( gThreshold ).to.eql( 1000 );
  });
  
  it('Should load some ENV sensitive configuration', function () {
    
    process.env.NODE_ENV = 'production'
    ConfigProvider.load( './spec/config' );
    var productionColor = ConfigProvider.get( 'settings.color' );
    
    process.env.NODE_ENV = 'staging'
    ConfigProvider.load( 'spec/config' );
    var stagingColor = ConfigProvider.get( 'settings.color' );
    
    expect( productionColor ).to.eql( 'white' );
    expect( stagingColor ).to.eql( 'blue' );
  });
  
  it('Should overload configs with env vars', function () {
    
    process.env.SETTINGS__COLOR = 'yellow';
    process.env.GLOBAL__SETTINGS__COLORS__RED = '#00fd00';
    process.env.GLOBAL__SETTINGS__MENU = 3;
    ConfigProvider.load( 'spec/config' );
    
    var color = ConfigProvider.get( 'settings.color' );
    var red = ConfigProvider.get( 'global.settings.colors.red' );
    var menu = ConfigProvider.get( 'global.settings.menu' );
    
    expect( color ).to.eql( 'yellow' );
    expect( red ).to.eql( '#00fd00' );
    expect( menu ).to.eql( 3 );
  });
});
