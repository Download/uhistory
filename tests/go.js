var assert = require('assert')

var createDummyHistory = require('./dummy-history')
var History = require('../')
var history = History(createDummyHistory())

var go_emitted = 0
var go_arguments
var change_emitted = 0
var change_arguments

history.on('go', function() {go_emitted++; go_arguments=Array.prototype.slice.call(arguments)});
history.on('change', function() {change_emitted++; change_arguments=Array.prototype.slice.call(arguments)});

assert(! go_emitted)
assert(! change_emitted)

history.go(-1)
assert(go_emitted)
assert.deepEqual(go_arguments, [-1])
assert(! change_emitted)

history.go()
assert(go_emitted === 2)
assert(!change_emitted)
