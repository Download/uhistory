var EventEmitter = require('uevents')

module.exports = function History(ctx) {
	var win = typeof window == 'object' && window
	// enhance the passed history, or a new object, or, only if window was passed explicitly, window.history
	var his = ctx && !ctx.history ? ctx : (ctx === win ? win.history : {})
	ctx = ctx && ctx.history && ctx || win
	var h = ctx.history 
	if (! h) {throw new Error('History API is not available')}
	if (! ctx.location) {throw new Error('Location API is not available')}
	if (his.emit) {return his}

	var addEvent = ctx.addEventListener || ctx.on, 
			back = h.back, forward = h.forward, go = h.go, push = h.pushState, replace = h.replaceState

	EventEmitter(his)

	Object.defineProperties(his, {
		back: {value: function(){
			his.emit('back')
			back.call(h)
		}},

		forward: {value:function(){
			his.emit('forward')
			forward.call(h)
		}},

		go: {value:function(delta){
			his.emit('go', delta)
			go.call(h, delta)
		}},

		pushState: {value:function(state, title, url){
			his.emit('pushState', state, title, url)
			push.call(h, state, title, url)
			his.emit('change', ctx.location, state, 'pushState')
		}},

		replaceState: {value:function(state, title, url){
			his.emit('replaceState', state, title, url)
			replace.call(h, state, title, url)
			his.emit('change', ctx.location, state, 'replaceState')
		}},
	})

	if (his.length === undefined) {
		Object.defineProperties(his, {
			length: {get: function(){
				return h.length
			}},
			state: {get: function(){
				return h.state
			}},
		})
	}

	if (addEvent) {
		addEvent.call(ctx, 'popstate', function(e){
			his.emit('popstate', e)
			his.emit('change', ctx.location, h.state, 'popstate')
		})
	}

	return his
}
