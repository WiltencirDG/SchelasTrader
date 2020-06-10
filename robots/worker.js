const {Worker, parentPort, workerData} = require('worker_threads')
const priceWorkerPath = './workers/price.js' 
const tradeWorkerPath = './workers/trade.js' 

async function robot(emitter,ticker){
    
    const priceWorker = new Worker(priceWorkerPath, {workerData: ticker.buy });
    const tradeWorker = new Worker(tradeWorkerPath, {workerData: ticker.buy });
    
    priceWorker.on('message', (result) => {
        try{
            if(result.indexOf(':') > -1){
                emitter.emit('operate',result)
                // emitter.emit('notification',result[1])
            }            
        }catch(error){
            emitter.emitObject("getMovingAverage", result)

        }        
    })

    emitter.on('readPrice',(movingAverage)=>{
        priceWorker.postMessage(movingAverage)
        tradeWorker.postMessage('message')
    })

    tradeWorker.on('message', async (result) => {
        
    })

    
}

module.exports = robot