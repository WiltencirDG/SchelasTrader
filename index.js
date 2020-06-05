const eventEmitter = require('./event/emitter.js')
const robots = {
    priceChrome: require('./robots/price-chrome.js'),
    worker: require('./robots/worker.js'),
    whatsNotification: require('./robots/whats-notification.js')
}



const tickers = [{
    price: "BIDI4",
    buy: "BIDI4F"
},
{
    price: "PETR4",
    buy: "PETR4F"
},
{
    price: "VALE3",
    buy: "VALE3F"
}]

async function start(){
    
    tickers.forEach(async (ticker) => {
        
        let emitter = new eventEmitter();
        await robots.whatsNotification(emitter)
        await robots.priceChrome(emitter,ticker)
        await robots.worker(emitter, ticker)
    });

}

start()