import test from 'node:test'
import assert from 'node:assert/strict'
import { setTimeout as delay } from 'node:timers/promises'
import EventEmitter from './index.js'

// simple `CustomEvent` polyfill for Node.js
const globalSpace = global || window || {}
globalSpace.CustomEvent = globalSpace.CustomEvent || class CustomEvent extends Event {
  constructor(message, data) {
    super(message, data)
    this.detail = data.detail
  }
}

test('version of Node.js should be greater than 18.3', () => {
  const [major, minor] = process.versions.node
    .split('.')
    .map(number => parseInt(number))

  assert.ok(major >= 18)
  assert.ok(minor >= 3)
})

test('event emitter should have certain methods', () => {
  const eventEmitter = new EventEmitter()
  assert.ok(typeof eventEmitter.addEventListener === 'function')
  assert.ok(typeof eventEmitter.removeEventListener === 'function')
  assert.ok(typeof eventEmitter.dispatchEvent === 'function')
  assert.ok(typeof eventEmitter.on === 'function')
  assert.ok(typeof eventEmitter.off === 'function')
  assert.ok(typeof eventEmitter.emit === 'function')
})

test('should invoke function after add event listener', () => {
  const eventEmitter = new EventEmitter()
  const tracker = new assert.CallTracker()

  function eventHandler() {}
  const callHandler = tracker.calls(eventHandler, 1)

  eventEmitter.on('event.test', callHandler)
  eventEmitter.emit('event.test')

  tracker.verify()
})

test('should invoke function only once with parameter `once: true`', () => {
  const eventEmitter = new EventEmitter()
  const tracker = new assert.CallTracker()
  const eventName = 'event.test'

  function eventHandler() {}
  const callHandler = tracker.calls(eventHandler, 1)

  eventEmitter.on(eventName, callHandler, { once: true })
  eventEmitter.emit(eventName)
  eventEmitter.emit(eventName)

  tracker.verify()
})

test('should invoke function many times', async () => {
  const eventEmitter = new EventEmitter()
  const tracker = new assert.CallTracker()
  const eventName = 'event.test'

  function eventHandler() {}
  const callHandler = tracker.calls(eventHandler, 3)
  eventEmitter.on(eventName, callHandler)

  function emit() {
    eventEmitter.emit(eventName)
  }

  emit()
  await Promise.resolve().then(emit)
  await delay().then(emit)

  tracker.verify()
})

test('should pass data in custom event', (t, done) => {
  const eventEmitter = new EventEmitter()
  const eventName = 'event.test'

  const data = Object.freeze({
    'hello': 'world'
  })

  function eventHandler(event) {
    assert.ok(typeof event.detail === 'object')
    assert.ok(typeof event?.detail?.hello !== 'undefined')
    assert.ok(event.detail.hello === data.hello)
    done()
  }

  eventEmitter.on(eventName, eventHandler)
  eventEmitter.emit(eventName, data)
})

test('should handle standard events', (t, done) => {
  const eventEmitter = new EventEmitter()
  const eventName = 'change'

  function handler(event) {
    console.log('event: ', event)
    assert.ok(typeof event === 'object')
    assert.ok(event.type === eventName)
    done()
  }

  eventEmitter.on(eventName, handler)
  eventEmitter.dispatchEvent(new Event(eventName))
})