const eventEmitter = require('./event/emitter.js')
const robots = {
    priceChrome: require('./robots/price-chrome.js'),
    worker: require('./robots/worker.js'),
    whatsNotification: require('./robots/whats-notification.js'),
    clearChrome: require('./robots/clear-chrome.js')
}

const tickers = [{
        price: "MGLU3",
        buy: "MGLU3F"
    }
    ,
    {
        price: "PETR4",
        buy: "PETR4F"
    },
    {
        price: "VALE3",
        buy: "VALE3F"
    }
]

async function start(){
    
    let emitters = []
    
    tickers.forEach(async (ticker) => {
        
        let emitter = new eventEmitter();
        await robots.priceChrome(emitter,ticker)
        await robots.worker(emitter, ticker)
        emitters.push(emitter)
        
    });
    
    await robots.whatsNotification(emitters)
    await robots.clearChrome(emitters)


}

start()