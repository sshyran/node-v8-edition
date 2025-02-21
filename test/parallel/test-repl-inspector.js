'use strict';

const common = require('../common');
const assert = require('assert');
const repl = require('repl');

common.skipIfInspectorDisabled();

// This test verifies that the V8 inspector API is usable in the REPL.

const putIn = new common.ArrayStream();
let output = '';
putIn.write = function(data) {
  output += data;
};

const testMe = repl.start('', putIn);

putIn.run(['const myVariable = 42']);

testMe.complete('myVar', common.mustCall((error, data) => {
  assert.deepStrictEqual(data, [['myVariable'], 'myVar']);
}));

putIn.run([
  'const inspector = require("inspector")',
  'const session = new inspector.Session()',
  'session.connect()',
  'session.post("Runtime.evaluate", { expression: "\'a\' + \'b\'" }, ' +
    'console.log)',
  'session.disconnect()'
]);

assert(output.includes(
  "null { result: { type: 'string', value: 'ab' } }"));
