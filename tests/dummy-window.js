var EventEmitter = require('uevents')
var createDummyHistory = require('./dummy-history')

module.exports = EventEmitter({
	history: createDummyHistory(),
	addEventListener: function(type, fn){
		this.on(type, fn)
		this.addEventListenerCalled++
	},
	addEventListenerCalled: 0
})