const {Worker, parentPort, workerData} = require('worker_threads')
const priceWorkerPath = './workers/price.js' 
const tradeWorkerPath = './workers/trade.js' 

async function robot(emitter){
    const ticker = ''
    const priceWorker = new Worker(priceWorkerPath, {workerData: ticker });
    const tradeWorker = new Worker(tradeWorkerPath, {workerData: ticker });
    
    priceWorker.on('message', (result) => {
        
        emitter.emitObject("getMovingAverage", result)
        
    })

    emitter.on('readPrice',(movingAverage)=>{
        priceWorker.postMessage(movingAverage)
        tradeWorker.postMessage('message')
    })

    tradeWorker.on('message', async (result) => {
        
    })

    
}

module.exports = robot