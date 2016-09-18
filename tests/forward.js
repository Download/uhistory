var assert = require('assert')

var createDummyHistory = require('./dummy-history')
var History = require('../')
var history = History(createDummyHistory())

var forward_emitted = 0
var forward_arguments
var change_emitted = 0
var change_arguments

// sanity check
history.on('forward', function() {forward_emitted++; forward_arguments=Array.prototype.slice.call(arguments)});
history.on('change', function() {change_emitted++; change_arguments=Array.prototype.slice.call(arguments)});

assert(! forward_emitted)
assert(! change_emitted)

history.forward()
assert(forward_emitted)
assert.deepEqual(forward_arguments, [])
assert(! change_emitted)

history.forward()
assert(forward_emitted === 2)
assert(!change_emitted)
