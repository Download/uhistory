var EventEmitter = require('uevents')

module.exports = function History(h) {
	h = h || (typeof history == 'object' && history) || (typeof window == 'object' && window.history)
	if (! h) {throw new Error('History API is not available')}
	if (h.emit) {return h}

	var back=h.back.bind(h), forward=h.forward.bind(h), go=h.go.bind(h), 
		pushState=h.pushState.bind(h), replaceState=h.replaceState.bind(h)

	EventEmitter(h)

	Object.defineProperties(h, {
		back: {value: function(){
			h.emit('back')
			back()
		}},

		forward: {value:function(){
			h.emit('forward')
			forward()
		}},

		go: {value:function(){
			h.emit('go', arguments[0])
			go(arguments[0])
		}},

		pushState: {value:function(state, title, url){
			h.emit('pushState', state, title, url)
			pushState(state, title, url)
			h.emit('change', url, state, 'pushState')
		}},

		replaceState: {value:function(state, title, url){
			h.emit('replaceState', state, title, url)
			replaceState(state, title, url)
			h.emit('change', url, state, 'replaceState')
		}},
	})

	if (typeof window == 'object' && h === window.history) {
		window.addEventListener('popstate', function(e){
			h.emit('popstate', e)
			h.emit('change', window.location, h.state, 'popstate')
		})
	}

	return h
}
