const {Worker, parentPort, workerData} = require('worker_threads')

const ticker = workerData.ticker

async function worker(){

    parentPort.on('message',(result)=>{
        console.log(`OPERATION WITH ${ticker}`)
    })
}

module.exports = worker