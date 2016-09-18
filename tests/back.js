var assert = require('assert')

var createDummyHistory = require('./dummy-history')
var History = require('../')
var history = History(createDummyHistory())

var back_emitted = 0
var back_arguments
var change_emitted = 0
var change_arguments

// sanity check
history.on('back', function() {back_emitted++; back_arguments=Array.prototype.slice.call(arguments)});
history.on('change', function() {change_emitted++; change_arguments=Array.prototype.slice.call(arguments)});

assert(! back_emitted)
assert(! change_emitted)

history.back()
assert(back_emitted)
assert.deepEqual(back_arguments, [])
assert(! change_emitted)

history.back()
assert(back_emitted === 2)
assert(!change_emitted)
