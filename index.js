class EventEmitter extends EventTarget {}

Object.assign(EventEmitter.prototype, {
  on: EventTarget.prototype.addEventListener,

  off: EventTarget.prototype.removeEventListener,

  emit(eventType, detail) {
    this.dispatchEvent(new CustomEvent(eventType, {
      detail
    }))
  }
})

export default EventEmitter