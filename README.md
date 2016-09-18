# uhistory <sup><sub>0.1.0</sub></sup>

## Microscopically small History API based on uevents

[![npm](https://img.shields.io/npm/v/uhistory.svg)](https://npmjs.com/package/uhistory)
[![license](https://img.shields.io/npm/l/uhistory.svg)](https://creativecommons.org/licenses/by/4.0/)
[![travis](https://img.shields.io/travis/Download/uhistory.svg)](https://travis-ci.org/Download/uhistory)
[![greenkeeper](https://img.shields.io/david/Download/uhistory.svg)](https://greenkeeper.io/)
![mind BLOWN](https://img.shields.io/badge/mind-BLOWN-ff69b4.svg)

**Turn the browser History API into an EventEmitter!**

## Install ##

```
npm install --save uhistory
```

## Require ##

```js

const history = require('uhistory')()  // needs `window` and `window.history`
// or
const History = require('uhistory')  
const history = History()  // needs `window` and `window.history`
// or
const memoryHistory = ..   // create your own backing object
const history = History(memoryHistory)  // pass it to History
```

## Import

```js
import History from 'uhistory'
const history = History()  // needs `window` and `window.history`
// or
const memoryHistory = ..   // create your own backing object
const history = History(memoryHistory)  // pass it to History
```

## Why
There are a couple of History APIs going around, but people are looking
for [alternatives](http://stackoverflow.com/questions/11230581/is-there-an-alternative-to-history-js)
as most implementations have their own API, are bulky or have bugs, or
all of the above.

The standard History object in browsers offers a decent API to *change* the
history, but is a bit awkward to work with when you want to *listen* for changes,
because you need to listen to `popstate` on the `window` object, instead of on
the history object itself, and because 'pushState' and 'replaceState' don't
lead to a `popstate` event being emitted...

`uhistory` is microscopically small and has only one dependency, on
[uevents](https://github.com/download/uevents), which is a lean version of the
widely popular Node JS EventEmitter library. Together, they create an API that
feels natural and standard:

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
history.pushState({}, '', '/new/page')
//  > Change!
history.back()
//  > Back!
//  > Change!
```

Basically, what `uhistory` does, is change the `history` object into an
event emitter. If you don't pass any arguments to the `History` function,
it will enhance the `window.history` object. If you do pass an argument,
it will enhance whichever object you passed.

If the `window` object exists and the enhanced history object is the `window.history`
instance, `uhistory` will automatically listen for `popstate` events on the
`window` object and make them emit `popstate` and `change` events on the `history`
object. This way, listening for history events becomes a breeze.

> If you passed a custom backing object, you will need to make sure that the
`popstate` and `change` events on the newly created history object are emitted
at the appropriate moments yourself.

## Events
The following events are emitted:

### change (location, state, source)
The `change` event is emitted a a result of calling `pushState()` or `replaceState()`,
or the `window.popstate` event firing.

#### location
The new location showing in the address bar (if any)

#### state
The state object associated with the current history entry (`history.state`)

#### source
The source of the event. One of `'pustState'`, `'replaceState'` and `'popstate'`.

### popstate (event)
As a result of the `window.popstate` event firing

#### event
The event object that was received from `window.popstate`

### back
As a result of the `back()` method being called.

### forward
As a result of the `forward()` method being called.

### go (n)
As a result of the `go()` method being called.

#### n
The number of entries to move. Can be negative to move backward.
This is the number that was passed to the `go()` method

### pushState (state, title, url)
As a result of the `pushState()` method being called.

#### state
The state object that was passed to `pushState`, if any
#### title
The title string that was passed to `pushState`, if any
#### url
The url string that was passed to `pushState`, if any

### replaceState (state, title, url)
As a result of the `replaceState()` method being called.

#### state
The state object that was passed to `pushState`, if any
#### title
The title string that was passed to `pushState`, if any
#### url
The url string that was passed to `pushState`, if any

## Issues

Add an issue in this project's [issue tracker](https://github.com/download/uhistory/issues)
to let me know of any problems you find, or questions you may have.


## Copyright

Copyright 2016 by [Stijn de Witt](http://StijnDeWitt.com). Some rights reserved.

## License

[Creative Commons Attribution 4.0 (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/)
