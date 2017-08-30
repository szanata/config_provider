const chai = require('chai');
const should = require('chai').should();
const expect = chai.expect;
const path = require('path');

describe('Testing whether it can find the root to get the default config folder', () => {

  let originalFileName;
  before( () => {
    originalFileName = require.main.filename;
  });

  afterEach(() => {
    delete require.cache[require.resolve( '../../index' )];
  });

  after(() => {
    require.main.filename = originalFileName;
  });

  it('Should find the root if it was initialized in the root folder of the project (pm2)', () => {
    require.main.filename = path.join( path.dirname( require.resolve( '../../index' ) ), 'server.js' );

    const ConfigProvider = require('../../index');
    const foo = ConfigProvider.get( 'foo' );

    expect( foo.bar ).to.eql( 1 );
  });

  it('Should find the root if it was initialized in another folder from the project (pm2)', () => {
    require.main.filename = path.join( path.dirname( require.resolve( '../../index' ) ), 'spec', 'server.js' );

    const ConfigProvider = require('../../index');
    const foo = ConfigProvider.get( 'foo' );

    expect( foo.bar ).to.eql( 1 );
  });


  it('Should find the root if if it was initialized by one a node_module (mocha)', () => {
    require.main.filename = path.join( path.dirname( require.resolve( '../../index' ) ), 'node_modules', 'app.js' );

    const ConfigProvider = require('../../index');
    const foo = ConfigProvider.get( 'foo' );

    expect( foo.bar ).to.eql( 1 );
  });
});
