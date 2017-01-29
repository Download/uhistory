var expect = require('chai').expect
var Location = require('ulocation')

var MemoryContext = require('./memorycontext')

describe('MemoryContext(url)', function(){
	it('is a (constructor) function', function(){
		expect(MemoryContext).to.be.a('function')
	})

	it('can be called without `new`', function(){
		var mc = MemoryContext()
		expect(mc).to.be.an('object')
	})

	describe('url', function(){
		it('optionally specifies the url of the initial location', function(){
			var url = 'https://www.example.com/'
			var mc = MemoryContext(url)
			expect(mc.location.href).to.eq(url)
		})
	})

	describe('result', function(){
		it('is an object', function(){
			var mc = MemoryContext()
			expect(mc).to.be.an('object')
		})

		it('is an event emitter', function(){
			var mc = MemoryContext()
			expect(mc.emit).to.be.a('function')
		})

		it('has properties `location` and `history`', function(){
			var mc = MemoryContext()
			expect(mc).to.have.a.property('location')
			expect(mc).to.have.a.property('history')
		})

		describe('location', function(){
			it('is an object', function(){
				var mc = MemoryContext()
				expect(mc.location).to.be.an('object')
			})

			it('acts like the browser location object', function(){
				var mc = MemoryContext()
				expect(mc.location).to.have.a.property('href')
				expect(mc.location).to.have.a.property('protocol')
				expect(mc.location).to.have.a.property('baseURI')
			})

			it('is an event emitter', function(){
				var mc = MemoryContext()
				expect(mc.location.emit).to.be.a('function')
			})
		})

		describe('history', function(){
			it('is an object', function(){
				var mc = MemoryContext()
				expect(mc.history).to.be.an('object')
			})

			it('acts like the browser history object', function(){
				var mc = MemoryContext()
				expect(mc.history).to.have.a.property('state')
				expect(mc.history).to.have.a.property('back')
				expect(mc.history.back).to.be.a('function')
				expect(mc.history).to.have.a.property('pushState')
				expect(mc.history.pushState).to.be.a('function')
			})
		})
	})
})
