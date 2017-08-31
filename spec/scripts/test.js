const ConfigProvider = require('../../lib/index');
const foo = ConfigProvider.get( 'foo' );

console.log( `RESULT=${foo.bar}` );
