const {Worker, parentPort, workerData} = require('worker_threads')
const priceWorkerPath = './workers/price.js' 
const tradeWorkerPath = './workers/trade.js' 
const ticker = "BIDI4F"

async function robot(){
    
    const priceWorker = new Worker(priceWorkerPath, {workerData: { ticker,globalPage:global.globalPage} });
    const tradeWorker = new Worker(tradeWorkerPath, {workerData: ticker });
    
    priceWorker.on('message', (result) => {
        tradeWorker.postMessage(result)
    })
    
}

module.exports = robot