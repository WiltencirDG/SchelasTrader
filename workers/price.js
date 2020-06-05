const {Worker, parentPort, workerData} = require('worker_threads')

const ticker = workerData

let stopTrade
let price, oldPrice = 0 
let comprado = false
let vendido = false
let lucro = 0
let numBuys = 0
let noBuys = 0

async function that(){
    while(!stopTrade){
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        await check()
    }
}

function check(){
    console.log('checking')
    price = Math.ceil(Math.random() * 100)* Math.ceil(Math.random())
    
    if(oldPrice < price && !comprado){
        parentPort.postMessage(`buy:${price}`)
        comprado = true
        //lucro += (price - oldPrice)
        oldPrice = price
        numBuys++
        noBuys = 0
    }

    if(oldPrice < price && comprado){ 
        parentPort.postMessage(`sell:${price}`)
        comprado = false

        lucro += (price - oldPrice)
        //parentPort.postMessage(`lucro:${lucro}`)
        noBuys = 0
    }
    
    
    //parentPort.postMessage(`no:trade`)

    if(lucro < -1 || noBuys > 40){
        stopTrade = true
    }

    if(!comprado){
        noBuys++
    }
}

that()
console.log(lucro)