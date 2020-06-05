const {Worker, parentPort, workerData} = require('worker_threads')
const priceWorker = './workers/price.js'
const ticker = "BIDI4F"

async function robot(){
    
    const worker = new Worker(priceWorker, {workerData: ticker });
    
    worker.on('message', (result) => {
        if(result.split(':')[0] == "buy"){
            console.log(`COMPRE ${ticker}`);
            
        }else if(result.split(':')[0] == "sell"){
            console.log(`VENDA ${ticker}`);
        }
        //console.log(result)
        //SEND MESSAGE THROUGH SOCKET
    })
    
}

module.exports = robot