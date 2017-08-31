const chai = require('chai');
const path = require('path');
const expectedResult = require('../../config/foo').bar;
const spawnSync = require( 'child_process' ).spawnSync;
const spawn = require( 'child_process' ).spawn;

const expect = chai.expect;
const assert = chai.assert;

describe('Root path detection (./config default folder)', () => {

  afterEach(() => {
    delete require.cache[require.resolve( '../../lib/index' )];
  });

  describe('PM2', () => {

    it('Should load from default config folder', () => {
      const pm2 = spawnSync( 'node', ['./node_modules/pm2/bin/pm2', 'start', './spec/scripts/test.js'] );
      const logs = spawnSync( 'node', ['./node_modules/pm2/bin/pm2', 'logs', 'test', '--raw', '--nostream', '--lines', '1'] );

      const result = logs.stdout.toString();
      assert( result.includes(`RESULT=${expectedResult}`) );

      spawnSync( 'node', ['./node_modules/pm2/bin/pm2', 'delete', 'test'] );
    });
  });

  describe('Mocha', () => {
    it('Should load from default config folder', () => {
      const ConfigProvider = require('../../lib/index');
      const foo = ConfigProvider.get( 'foo' );

      expect( foo.bar ).to.eql( expectedResult );
    });
  });

  describe('Node run script', () => {
    it('Should load from default config folder', () => {
      const script = spawnSync( 'node', ['./spec/scripts/test.js'] );
      const result = script.stdout.toString();

      assert( result.includes(`RESULT=${expectedResult}`) );
    });
  });

  describe('Node shell', () => {
    it('Should load from default config folder', (done) => {
      const node = spawn( 'node' );

      node.stdout.on('data', data => {
        assert( data.includes(`RESULT=${expectedResult}`) );
      });

      node.stdin.setEncoding('utf-8');
      node.stdin.write("const ConfigProvider = require('./lib/index');\n");
      node.stdin.write("const foo = ConfigProvider.get('foo');\n");
      node.stdin.write("console.log(`RESULT=${foo.bar}`);\n");
      node.stdin.end();

      setTimeout( () => {
        node.kill();
        done();
      }, 4000);
    });
  });
});
