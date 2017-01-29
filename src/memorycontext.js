var EventEmitter = require('uevents')
var Location = require('ulocation')

function MemoryContext(url) {
	if (! (this instanceof MemoryContext)) return new MemoryContext(url)
	var history, location = EventEmitter(Location(url || 'http://localhost'))
	EventEmitter(this)
	history = new MemoryHistory(this, location)
	Object.defineProperties(this, {
		location: {value: location, readonly:true},
		history:  {value: history,  readonly:true},
	})
	return this
}

function MemoryHistory(ctx, location) {
	function entry(state, title, url) {return {state:state, title:title, url:url}}


	// first entry represents arrival on the page
	var h = [entry(undefined, '', location.href)],
			idx = h.length - 1,
			suppressChange = false

	Object.assign(this, {
		back: function(){
			if (idx > 0) {
				idx--
				change(h[idx].url)
			}
		},
		forward: function(){
			if (idx < h.length - 1) {
				idx++
				change(h[idx].url)
			}
		},
		go: function(delta){
			delta = delta % h.length
			if (delta)	{
				delta = idx + delta
				idx = delta < 0 ? h.length + delta : delta
				change(h[idx].url)
			}
		},
		pushState: function(state, title, url){
			if (idx + 1 < h.length) h.splice(idx + 1, h.length - (idx + 1))
			idx++
			change(url, true /* suppress */)
			h[idx] = entry(Object.assign({}, state), title, location.href)
		},
		replaceState: function(state, title, url){
			change(url, true /* suppress */)
			h[idx] = entry(Object.assign({}, state), title, location.href)
		},
	})

	Object.defineProperties(this, {
		length: {get: function(){
			return h.length
		}},
		state: {get: function(){
			return h[idx] && h[idx].state
		}},
	})

	function change(url, suppress) {
		var org
		if (suppress !== undefined) {org = suppressChange; suppressChange = suppress}
		location.href = url || ''
		if (org !== undefined) suppressChange = org
	}

	location.on('change', function(){
		if (! suppressChange) ctx.emit('popstate', {state: this.history.state})
	}.bind(ctx))
	

	return this
}

module.exports = MemoryContext
