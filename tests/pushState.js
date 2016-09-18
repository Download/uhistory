var assert = require('assert')

var createDummyHistory = require('./dummy-history')
var History = require('../')
var history = History(createDummyHistory())

var pushState_emitted = 0
var pushState_arguments
var change_emitted = 0
var change_arguments

// sanity check
history.on('pushState', function() {pushState_emitted++; pushState_arguments=Array.prototype.slice.call(arguments)});
history.on('change', function() {change_emitted++; change_arguments=Array.prototype.slice.call(arguments)});

assert(! pushState_emitted)
assert(! change_emitted)

history.pushState({data: 'data'}, 'title', '/some/url')
assert(pushState_emitted)
assert.deepEqual(pushState_arguments, [{data:'data'}, 'title', '/some/url'])
assert(change_emitted)
assert.deepEqual(change_arguments, ['/some/url', {data:'data'}, 'pushState'])

history.pushState()
assert(pushState_emitted === 2)
assert(change_emitted === 2)
