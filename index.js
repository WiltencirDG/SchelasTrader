const eventEmitter = require('./event/emitter.js')
const robots = {
    priceChrome: require('./robots/price-chrome.js'),
    worker: require('./robots/worker.js')
}

const emitter = new eventEmitter();
emitter.setMaxListeners(2)

async function start(){
    
    await robots.priceChrome(emitter)
    await robots.worker(emitter)

}

start()