const EventEmitter = require("events").EventEmitter;

class MyEventEmitter extends EventEmitter {
    emitObject(event, obj) {
        this.emit(event, obj);
    }
}

module.exports = MyEventEmitter