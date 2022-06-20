class EventEmitter extends EventTarget {}

Object.assign(EventEmitter.prototype, {
  on: EventTarget.prototype.addEventListener,

  off: EventTarget.prototype.removeEventListener,

  emit(eventType, detail, options = {}) {
    return this.dispatchEvent(new CustomEvent(eventType, {
      detail,
      ...options
    }))
  }
})

export default EventEmitter