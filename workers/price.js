const {Worker, parentPort, workerData} = require('worker_threads')

let stopTrade

let mediaCompra
let mediaVenda

let comprado = false
let precoComprado = 0

let lucro = 0
let numBuys = 0
let noBuys = 0

let ticker = workerData

const movingAverages = {
    mediaCompra: 0 ,
    mediaVenda: 0
}

async function price(){

    parentPort.on('message', async (result) =>{
        await check(result)
    })

    while(!stopTrade){
        await new Promise(resolve => setTimeout(resolve, 30000));
        parentPort.postMessage(movingAverages)
    }

}

function check(movingAverages){
    
    mediaCompra = movingAverages.mediaCompra
    mediaVenda = movingAverages.mediaVenda
    
    if(mediaCompra > mediaVenda && !comprado){
        console.log(`> Buy: ${mediaCompra}`)
        comprado = true
        precoComprado = mediaCompra
        numBuys++
        noBuys = 0
        parentPort.postMessage(`buy:Compra de 5 ${ticker} por R$${mediaCompra}`)
    }
    
    if(mediaVenda > mediaCompra && comprado){
        console.log(`> Sell: ${mediaVenda}`)
        comprado = false
        noBuys = 0
        lucro = mediaVenda - precoComprado
        parentPort.postMessage(`sell:Venda de 5 ${ticker} por ${mediaVenda}. Lucro atualizado: ${lucro}`)
    }
    
    if(noBuys > 100){
        stopTrade = true
    }

    if(!comprado){
        noBuys++
    }

    if(lucro < 0){
        stopTrade = true
    }
}

price()