var assert = require('assert')

global.window = require('./dummy-window')
assert(! window.addEventListenerCalled)

var History = require('../')
var history = History()
assert(window.addEventListenerCalled)

var popstate_emitted = 0
var popstate_arguments
var change_emitted = 0
var change_arguments

history.on('popstate', function() {popstate_emitted++; popstate_arguments=Array.prototype.slice.call(arguments)});
history.on('change', function() {change_emitted++; change_arguments=Array.prototype.slice.call(arguments)});

assert(! popstate_emitted)
assert(! change_emitted)

window.emit('popstate')
assert(popstate_emitted)
assert(change_emitted)

window.emit('popstate')
assert(popstate_emitted === 2)
assert(change_emitted === 2)
