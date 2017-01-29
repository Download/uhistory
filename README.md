# uhistory

## Microscopically small History API based on uevents

[![npm](https://img.shields.io/npm/v/uhistory.svg)](https://npmjs.com/package/uhistory)
[![license](https://img.shields.io/npm/l/uhistory.svg)](https://creativecommons.org/licenses/by/4.0/)
[![travis](https://img.shields.io/travis/Download/uhistory.svg)](https://travis-ci.org/Download/uhistory)
[![greenkeeper](https://img.shields.io/david/Download/uhistory.svg)](https://greenkeeper.io/)
![mind BLOWN](https://img.shields.io/badge/mind-BLOWN-ff69b4.svg)


## Install ##

```
npm install --save uhistory
```

## Require

```js
var History = require('uhistory')  
```

## Import

```js
import History from 'uhistory'
```

## Use

```js
var history = History()
history.on('change', function(){console.info('Changed!')})
history.pushState({some:'state'}, 'title', '/some/url')
//  >  'Changed!'
```

## Why
The standard History object in browsers offers a decent API to *change* the
history, but is a bit awkward to work with when you want to *listen* for changes,
because you need to listen to `popstate` on the `window` object, instead of on
the history object itself, and because 'pushState' and 'replaceState' don't
lead to a `popstate` event being emitted...

`uhistory` is microscopically small (~0.7kB minified and gzipped) and has only 
one dependency, on [uevents](https://github.com/download/uevents), which is a 
lean version of the widely popular Node JS EventEmitter library. Together, they 
create an API that feels natural and standard:

```js
const history = require('uhistory')()
history.on('back', function(){
	console.info('Back!')
})
history.on('change', function(location, state, source){
	// location = new location
	// state = any state associated with the history entry
	// source = 'pushState', 'replaceState' or 'popState' (back/forward/go actions)
	console.info('Change!')
})
history.pushState({some:'state'}, 'title', '/new/page')
//  > Change!
history.back()
//  > Back!
//  > Change!
```

## History (ctx)
Creates a history object.

### ctx
The backing context for the history object.

In browsers, you don't need to pass any arguments. `History` will pick up
the native `window.history` object automatically:

```js
var History = require('uhistory')  
var history = History()
```

In Node, there is no native `history` object. So you need to pass in another 
context for `History` to use:

```js
var History = require('uhistory')  
var MemoryContext = require('uhistory/memorycontext')  
var ctx = MemoryContext()
var history = History(ctx)
```
See [MemoryContext](#memorycontext) for more information.

In browsers, when you create a new history object without passing in an eplicit 
context, uhistory will pick up `window` as the context and use `window.history` and
`window.location` as backing mechanism, returning a **new** object. `window.history`
is not affected.

```js
var History = require('uhistory')  
var history = History()
history === window.history    // false
```

Sometimes, you *want* `window.history` to be affected, so any code that uses it 
will trigger events on it. In that case, explicitly pass `window` as the context:

```js
var History = require('uhistory')  
var history = History(window) // pass in explicitly
history === window.history    // true
```

### Events
The following events are emitted by the history object:

#### change (location, state, source)
The `change` event is emitted a a result of calling `pushState()` or `replaceState()`,
or the `popstate` event firing.

##### location
The location object. `location.href` contains the (canonical version of the) url.

##### state
The state object associated with the current history entry (`history.state`)

##### source
The source of the event. One of `'pushState'`, `'replaceState'` and `'popstate'`.

#### popstate (event)
As a result of the `popstate` event firing on the context.

##### event
The event object that was received from `ctx.popstate`

#### back
As a result of the `back()` method being called.

#### forward
As a result of the `forward()` method being called.

#### go (delta)
As a result of the `go()` method being called.

##### delta
The number of entries to move. Can be negative to move backward.
This is the number that was passed to the `go()` method

#### pushState (state, title, url)
As a result of the `pushState()` method being called.

##### state
The state object that was passed to `pushState`, if any
##### title
The title string that was passed to `pushState`, if any
##### url
The url string that was passed to `pushState`, if any

#### replaceState (state, title, url)
As a result of the `replaceState()` method being called.

##### state
The state object that was passed to `pushState`, if any
##### title
The title string that was passed to `pushState`, if any
##### url
The url string that was passed to `pushState`, if any


## MemoryContext 
To allow you to use uhistory on node, we need to provide the services it depends 
on. The context argument you pass to `history` mimics the way the history object
operates on browsers and the objects it interacts with:

* `back`, `forward`, `go`, `pushState` and `replaceState` affect `window.location`
* `back`, `forward` and `go` cause a `'popstate'` event to be emitted on `window`

So, including `window.history`, three objects are involved in this interaction. 

MemoryContext is modeled exactly like this. It provides an object that takes the
place of `window`, that has properties `location` and `history` to replace those
services and it simulates the interaction between those objects to be consistent
with how it happens in the browser.

To use it, require the separate module `memorycontext` from the `uhistory` package:

```js
var History = require('uhistory')
var MemoryContext = require('uhistory/memorycontext')
```

> Keeping this endpoint separate prevents it from bloating your web bundle

Now, instantiate the context object. It's `location.href` property will be set to 
`'http://localhost'`: 

```js
var ctx = MemoryContext()
ctx.location.href // 'http://localhost'
```

To set a different value, pass it as an argument:

```js
var ctx = MemoryContext('https://www.example.com')
ctx.location.href // 'https://www.example.com'
```

Now, pass the created context to `History`:

```js
var history = History(ctx)
```

> MemoryContext depends on [ulocation](https://github.com/download/ulocation)


## Issues

Add an issue in this project's [issue tracker](https://github.com/download/uhistory/issues)
to let me know of any problems you find, or questions you may have.

## Copyright

Copyright 2017 by [Stijn de Witt](http://StijnDeWitt.com). Some rights reserved.

## License

[Creative Commons Attribution 4.0 (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/)

