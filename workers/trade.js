const {Worker, parentPort, workerData} = require('worker_threads')

const ticker = workerData

async function worker(){
    console.log(`OPERATION WITH ${ticker}`)
}

module.exports = worker