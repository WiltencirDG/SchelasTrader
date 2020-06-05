
const robots = {
    chrome: require('./robots/chrome.js'),
    worker: require('./robots/worker.js'),
    //price: require('./workers/price.js')
}

async function start(){
    
    //await robots.chrome() // WEBSOCKETSSSSS => LISTEN PRA COMPRAR E VENDER
    await robots.worker()
    
    // WORKER -> THREAD DO PREÇO. MANDA COMPRAR E VENDER

    

}

start()