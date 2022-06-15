# Event emitter based on standard EventTarget

This event emitter simply inherits from global standard class `EventTarget` and create methods aliases: `on` for `addEventListener`, `off` for `removeEventListener` and `emit` for dispatching custom events (see example below).

## Installation

```
npm install @web-alchemy/event-target
```

## Using

```javascript
import EventEmitter from '@web-alchemy/event-target'

const eventEmitter = new EventEmitter()

eventEmitter.on('init', (event) => {
  console.log(event.detail.hello) // 'world'
})

// dispatch `CustomEvent`
eventEmitter.emit('init', {
  hello: 'world'
})

eventEmitter.on('change', (event) => {
  console.log(event.type) // 'change'
})

eventEmitter.dispatchEvent(new Event('change'))
```

## References
- [EventTarget on MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)
- [EventTarget in Node.js](https://nodejs.org/docs/latest-v16.x/api/events.html#eventtarget-and-event-api)