
test('back() emits `back` but no `change` events', function(){require('./back')})
test('forward() emits `forward` but no `change` events', function(){require('./forward')})
test('go() emits `go` but no `change` events', function(){require('./go')})
test('pushState() emits `pushState` and `change` events', function(){require('./pushState')})
test('replaceState() emits `replaceState` and `change` events', function(){require('./replaceState')})
test('on window `popstate` event, history emits `popstate` and `change` events', function(){require('./popstate')})
