module.exports = function createDummyHistory() {
	return {
		back: function(){},
		forward: function(){},
		go: function(){},
		pushState: function(){},
		replaceState: function(){},
	  state: {}
	}
}
