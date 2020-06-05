
const robots = {
    priceChrome: require('./robots/price-chrome.js'),
    worker: require('./robots/worker.js'),
    //price: require('./workers/price.js')
}

async function start(){
    
    await robots.priceChrome.robot() // WEBSOCKETSSSSS => LISTEN PRA COMPRAR E VENDER
    await robots.worker()

}

start()