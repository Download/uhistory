var assert = require('assert')

var createDummyHistory = require('./dummy-history')
var History = require('../')
var history = History(createDummyHistory())

var replaceState_emitted = 0
var replaceState_arguments
var change_emitted = 0
var change_arguments

// sanity check
history.on('replaceState', function() {replaceState_emitted++; replaceState_arguments=Array.prototype.slice.call(arguments)});
history.on('change', function() {change_emitted++; change_arguments=Array.prototype.slice.call(arguments)});

assert(! replaceState_emitted)
assert(! change_emitted)

history.replaceState({data: 'data'}, 'title', '/some/url')
assert(replaceState_emitted)
assert.deepEqual(replaceState_arguments, [{data:'data'}, 'title', '/some/url'])
assert(change_emitted)
assert.deepEqual(change_arguments, ['/some/url', {data:'data'}, 'replaceState'])

history.replaceState()
assert(replaceState_emitted === 2)
assert(change_emitted === 2)
