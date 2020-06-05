const {Worker, parentPort, workerData} = require('worker_threads')

const ticker = workerData

async function worker(){

    parentPort.on('message',(result)=>{
        console.log(`OPERATION WITH ${ticker}`)
    })
}

module.exports = worker