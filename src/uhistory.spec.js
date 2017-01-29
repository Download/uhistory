var expect = require('chai').expect

var Location = require('ulocation')
var History = require('./uhistory')
var MemoryContext = require('./memorycontext')
var initialLocation = 'https://www.example.com/path?query=string#fragment'

describe('History(ctx)', function(){
	it('is a (constructor) function', function(){
		expect(History).to.be.a('function')
	})

	it('can be called without `new`', function(){
		var h = History(MemoryContext(initialLocation))
		expect(h).to.be.an('object')
	})

	describe('ctx', function(){
		it('when not specified, defaults to `window` when available', function(){
			var org = 'window' in global ? {w:window} : undefined
			global.window = MemoryContext(initialLocation)
			var h = History()
			expect(h).to.be.an('object')
			if (! org) delete global.window 
			else global.window = org.w
		})

		it('if not specified and `window` is available, returns a new object', function(){
			var org = 'window' in global ? {w:window} : undefined
			global.window = MemoryContext(initialLocation)
			var h = History()
			expect(h).to.not.eq(window.history)
			if (! org) delete global.window 
			else global.window = org.w
		})

		it('if set explicitly to `window`, enhances the window.history object', function(){
			var org = 'window' in global ? {w:window} : undefined
			global.window = MemoryContext(initialLocation)
			var h = History(window)
			expect(h).to.eq(window.history)
			if (! org) delete global.window 
			else global.window = org.w
		})

		it('is required if `window` is not available', function(){
			expect(History).to.throw(Error)
			expect(History).to.throw('History API is not available')
			expect(function(){History({history:{}})}).to.throw(Error)
			expect(function(){History({history:{}})}).to.throw('Location API is not available')
		})
	})

	describe('result', function(){
		it('is an object', function(){
			var h = new History(MemoryContext(initialLocation))
			expect(h).to.be.an('object')
		})

		it('is an event emitter', function(){
			var h = new History(MemoryContext(initialLocation))
			expect(h.emit).to.be.a('function')
		})

		it('supports the History API', function(){
			var h = new History(MemoryContext(initialLocation))
			expect(h.back).to.be.a('function')
			expect(h.forward).to.be.a('function')
			expect(h.go).to.be.a('function')
			expect(h.pushState).to.be.a('function')
			expect(h.replaceState).to.be.a('function')
		})

		describe('length   /* read-only */', function(){
			it('indicates how many entries are in the history', function(){
				var ctx = MemoryContext(initialLocation)
				var history = History(ctx)
				var page2 = Location('/page2', ctx.location.baseURI)
				var page3 = Location('/page3', ctx.location.baseURI)
				expect(history.length).to.eq(1)
				history.pushState({}, '', page2)
				expect(history.length).to.eq(2)
				history.pushState({}, '', page3)
				expect(history.length).to.eq(3)
				history.back()
				history.back()
				history.back()
				expect(history.length).to.eq(3)
				history.pushState({}, '', page2)
				expect(history.length).to.eq(2)
			})
		})

		describe('state    /* read-only */', function(){
			it('The state associated with the current history entry, or `undefined`', function(){
				var ctx = MemoryContext(initialLocation)
				var history = History(ctx)
				expect(history.state).to.eq(undefined)
				var page2 = {page:2}
				var page3 = {page:3}
				history.pushState(page2)
				expect(history.state).to.have.a.property('page')
				expect(history.state.page).to.eq(2)
				history.pushState(page3)
				expect(history.state.page).to.eq(3)
			})
		})

		describe('back()', function(){
			it('moves back one entry in the history', function(){
				var ctx = MemoryContext(initialLocation)
				var history = History(ctx)
				var page2 = '/page2'

				// add another entry to the history so we have something to go back to
				history.pushState({}, '', page2)
				expect(ctx.location.href).to.eq(Location(page2, ctx.location.baseURI).href)

				history.back()
				
				expect(ctx.location.href).to.eq(initialLocation)
			})		

			it('triggers the \'back\' event whenever it is called', function(){
				var back_emitted = 0, back_arguments

				var history = History(MemoryContext(initialLocation))

				// sanity check
				history.on('back', function() {back_emitted++; back_arguments=Array.prototype.slice.call(arguments)});

				expect(back_emitted).to.eq(0)

				history.back()
				expect(back_emitted).to.eq(1)
				expect(back_arguments).to.deep.eq([])

				history.back()
				expect(back_emitted).to.eq(2)
			})		

			it('triggers the \'change\' event only when the location changed', function(){
				var back_emitted = 0, back_arguments
				var change_emitted = 0, change_arguments

				var history = History(MemoryContext(initialLocation))

				history.on('back', function() {back_emitted++; back_arguments=Array.prototype.slice.call(arguments)});
				history.on('change', function() {change_emitted++; change_arguments=Array.prototype.slice.call(arguments)});

				history.back()
				
				expect(back_emitted).to.eq(1)
				expect(change_emitted).to.eq(0)

				// add another entry to the history so we have something to go back to
				history.pushState({}, '', '/page2')
				expect(change_emitted).to.eq(1)

				history.back()
				
				expect(back_emitted).to.eq(2)
				expect(change_emitted).to.eq(2)

				history.back()

				expect(back_emitted).to.eq(3)
				expect(change_emitted).to.eq(2)
			})		
		})

		describe('forward()', function(){
			it('moves forward one entry in the history', function(){
				var ctx = MemoryContext(initialLocation)
				var history = History(ctx)
				var page2 = Location('/page2', ctx.location.baseURI).href
				// add another entry to the history so we have something to go back to
				history.pushState({}, '', page2)
				// go back so we have something to go forward to
				history.back()
				expect(ctx.location.href).to.eq(initialLocation)

				history.forward()
				expect(ctx.location.href).to.eq(page2)
			})		

			it('triggers the \'forward\' event whenever it is called', function(){
				var ctx = MemoryContext(initialLocation)
				var history = History(ctx)
				var page2 = Location('/page2', ctx.location.baseURI).href
				// add another entry to the history so we have something to go back to
				history.pushState({}, '', page2)
				// go back so we have something to go forward to
				history.back()
				expect(ctx.location.href).to.eq(initialLocation)

				var forward_emitted = 0, forward_arguments
				history.on('forward', function() {forward_emitted++; forward_arguments=Array.prototype.slice.call(arguments)});
				history.forward()
				expect(ctx.location.href).to.eq(page2)
				expect(forward_emitted).to.eq(1)
				history.forward()
				expect(ctx.location.href).to.eq(page2)
				expect(forward_emitted).to.eq(2)
				history.back()
				expect(forward_emitted).to.eq(2)
			})		

			it('triggers the \'change\' event only when the location changed', function(){
				var ctx = MemoryContext(initialLocation)
				var history = History(ctx)
				var page2 = Location('/page2', ctx.location.baseURI).href
				// add another entry to the history so we have something to go back to
				history.pushState({}, '', page2)
				// go back so we have something to go forward to
				history.back()
				expect(ctx.location.href).to.eq(initialLocation)

				var forward_emitted = 0, forward_arguments
				var change_emitted = 0, change_arguments
				history.on('forward', function() {forward_emitted++; forward_arguments=Array.prototype.slice.call(arguments)});
				history.on('change', function() {change_emitted++; change_arguments=Array.prototype.slice.call(arguments)});
				history.forward()
				expect(ctx.location.href).to.eq(page2)
				expect(forward_emitted).to.eq(1)
				expect(change_emitted).to.eq(1)
				history.forward()
				expect(ctx.location.href).to.eq(page2)
				expect(forward_emitted).to.eq(2)
				expect(change_emitted).to.eq(1)
				history.back()
				expect(forward_emitted).to.eq(2)
				expect(change_emitted).to.eq(2)
			})		
		})

		describe('go(delta)', function(){
			it('moves `delta` entries forward/backward in the history', function(){
				var ctx = MemoryContext(initialLocation)
				var history = History(ctx)
				var page2 = Location('/page2', ctx.location.baseURI).href
				var page3 = Location('/page3', ctx.location.baseURI).href
				var page4 = Location('/page4', ctx.location.baseURI).href
				var page5 = Location('/page5', ctx.location.baseURI).href
				// add some entries to the history so we can move around
				history.pushState({}, '', page2)
				history.pushState({}, '', page3)
				history.pushState({}, '', page4)
				history.pushState({}, '', page5)

				history.go(-3)
				expect(ctx.location.href).to.eq(page2)
				history.go(2)
				expect(ctx.location.href).to.eq(page4)
				history.go(1)
				expect(ctx.location.href).to.eq(page5)
				history.go(0)
				expect(ctx.location.href).to.eq(page5)
				history.go(-9)
				expect(ctx.location.href).to.eq(initialLocation)
			})		

			it('triggers the \'go\' event whenever it is called', function(){
				var ctx = MemoryContext(initialLocation)
				var history = History(ctx)
				var page2 = Location('/page2', ctx.location.baseURI).href
				var page3 = Location('/page3', ctx.location.baseURI).href
				var page4 = Location('/page4', ctx.location.baseURI).href
				var page5 = Location('/page5', ctx.location.baseURI).href
				// add some entries to the history so we can move around
				history.pushState({}, '', page2)
				history.pushState({}, '', page3)
				history.pushState({}, '', page4)
				history.pushState({}, '', page5)

				var go_emitted = 0, go_arguments
				history.on('go', function() {go_emitted++; go_arguments=Array.prototype.slice.call(arguments)});
				history.go(-3)
				expect(go_emitted).to.eq(1)
				history.go(2)
				expect(go_emitted).to.eq(2)
				history.go(1)
				expect(go_emitted).to.eq(3)
				history.go(0)
				expect(go_emitted).to.eq(4)
			})		

			it('triggers the \'change\' event only when the location changed', function(){
				var ctx = MemoryContext(initialLocation)
				var history = History(ctx)
				var page2 = Location('/page2', ctx.location.baseURI).href
				var page3 = Location('/page3', ctx.location.baseURI).href
				var page4 = Location('/page4', ctx.location.baseURI).href
				var page5 = Location('/page5', ctx.location.baseURI).href
				// add some entries to the history so we can move around
				history.pushState({}, '', page2)
				history.pushState({}, '', page3)
				history.pushState({}, '', page4)
				history.pushState({}, '', page5)

				var change_emitted = 0, change_arguments
				history.on('change', function() {change_emitted++; change_arguments=Array.prototype.slice.call(arguments)});
				history.go(-3)
				expect(change_emitted).to.eq(1)
				history.go(2)
				expect(change_emitted).to.eq(2)
				history.go(0)
				expect(change_emitted).to.eq(2)
				history.go(10)
				expect(change_emitted).to.eq(2)
				history.go(1)
				expect(change_emitted).to.eq(3)
			})		
		})

		describe('pushState(state, title, url)', function(){
			it('pushes the arguments onto the history and changes ctx.location.href', function(){
				var ctx = MemoryContext(initialLocation)
				var history = History(ctx)
				var page2 = Location('/page2', ctx.location.baseURI).href
				var page3 = Location('/page3', ctx.location.baseURI).href
				// add some entries to the history so we can move around
				history.pushState({}, '', page2)
				expect(ctx.location.href).to.eq(page2)
				history.pushState({}, '', page3)
				expect(ctx.location.href).to.eq(page3)
			})		

			it('triggers the \'pushState\' event whenever it is called', function(){
				var ctx = MemoryContext(initialLocation)
				var history = History(ctx)
				var pushState_emitted = 0, pushState_arguments
				history.on('pushState', function() {pushState_emitted++; pushState_arguments=Array.prototype.slice.call(arguments)});
				var page2 = Location('/page2', ctx.location.baseURI).href
				var page3 = Location('/page3', ctx.location.baseURI).href
				var page4 = Location('/page4', ctx.location.baseURI).href
				var page5 = Location('/page5', ctx.location.baseURI).href
				// add some entries to the history so we can move around
				history.pushState({}, '', page2)
				expect(pushState_emitted).to.eq(1)
				history.pushState({}, '', page3)
				expect(pushState_emitted).to.eq(2)
				history.pushState({}, '', page4)
				expect(pushState_emitted).to.eq(3)
				history.pushState({}, '', page5)
				expect(pushState_emitted).to.eq(4)
			})		

			it('triggers the \'change\' event whenever it\'s called', function(){
				var ctx = MemoryContext(initialLocation)
				var history = History(ctx)
				var change_emitted = 0, change_arguments
				history.on('change', function() {change_emitted++; change_arguments=Array.prototype.slice.call(arguments)});
				var page2 = Location('/page2', ctx.location.baseURI).href
				var page3 = Location('/page3', ctx.location.baseURI).href
				// add some entries to the history so we can move around
				history.pushState({}, '', page2)
				expect(change_emitted).to.eq(1)
				history.pushState({}, '', page2)
				expect(change_emitted).to.eq(2)
				history.pushState({}, '', page3)
				expect(change_emitted).to.eq(3)
			})		
		})

		describe('replaceState(state, title, url)', function(){
			it('replaces the last history entry with the arguments and changes ctx.location.href', function(){
				var ctx = MemoryContext(initialLocation)
				var history = History(ctx)
				var page2 = Location('/page2', ctx.location.baseURI).href
				var page3 = Location('/page3', ctx.location.baseURI).href
				// add some entries to the history so we can move around
				history.pushState({}, '', page2)
				expect(ctx.location.href).to.eq(page2)
				history.replaceState({}, '', page3)
				expect(ctx.location.href).to.eq(page3)
				history.back()
				expect(ctx.location.href).to.eq(initialLocation)
			})		

			it('triggers the \'replaceState\' event whenever it is called', function(){
				var ctx = MemoryContext(initialLocation)
				var history = History(ctx)
				var replaceState_emitted = 0, replaceState_arguments
				history.on('replaceState', function() {replaceState_emitted++; replaceState_arguments=Array.prototype.slice.call(arguments)});
				var page2 = Location('/page2', ctx.location.baseURI).href
				var page3 = Location('/page3', ctx.location.baseURI).href
				var page4 = Location('/page4', ctx.location.baseURI).href
				var page5 = Location('/page5', ctx.location.baseURI).href
				// add some entries to the history so we can move around
				history.replaceState({}, '', page2)
				expect(replaceState_emitted).to.eq(1)
				history.replaceState({}, '', page3)
				expect(replaceState_emitted).to.eq(2)
				history.replaceState({}, '', page4)
				expect(replaceState_emitted).to.eq(3)
				history.replaceState({}, '', page5)
				expect(replaceState_emitted).to.eq(4)
			})		

			it('triggers the \'change\' event whenever it\'s called', function(){
				var ctx = MemoryContext(initialLocation)
				var history = History(ctx)
				var change_emitted = 0, change_arguments
				history.on('change', function() {change_emitted++; change_arguments=Array.prototype.slice.call(arguments)});
				var page2 = Location('/page2', ctx.location.baseURI).href
				var page3 = Location('/page3', ctx.location.baseURI).href
				// add some entries to the history so we can move around
				history.replaceState({}, '', page2)
				expect(change_emitted).to.eq(1)
				history.replaceState({}, '', page2)
				expect(change_emitted).to.eq(2)
				history.replaceState({}, '', page3)
				expect(change_emitted).to.eq(3)
			})		
		})
	})
})
