const {Worker, parentPort, workerData} = require('worker_threads')
const priceRobot = require('../robots/price-chrome.js').getMovingAverage

const ticker = workerData.ticker

let stopTrade

let mediaCompra
let mediaVenda

let comprado = false
let vendido = false

let lucro = 0
let numBuys = 0
let noBuys = 0

let movingAverages

async function price(){
    while(!stopTrade){
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        movingAverages = await priceRobot(workerData.globalPage)
        await check(movingAverages)
    }
}

function check(movingAverages){
    console.log('checking')
    
    mediaCompra = movingAverages.mediaCompra
    mediaVenda = movingAverages.mediaVenda
    
    if(mediaCompra > mediaVenda && !comprado){
        parentPort.postMessage(`buy:${ticker}`)
        comprado = true
        numBuys++
        noBuys = 0
    }

    if(mediaVenda > mediaCompra && comprado){ 
        parentPort.postMessage(`sell:${ticker}`)
        comprado = false
        noBuys = 0
    }
    
    if(noBuys > 5){
        stopTrade = true
    }

    if(!comprado){
        noBuys++
    }
}

price()