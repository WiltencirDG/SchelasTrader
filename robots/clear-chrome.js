const puppeteer = require('puppeteer')
const credentials = require('../credentials/clear.json')
const kue = require('kue')
const queue = kue.createQueue()

async function robot(emitters, tickers){
    
    const chrome = await openChrome()
    const page = await openNewPage(chrome)
    await loginToClear(page)
    await navigateToAssets(page)
    
    emitters.forEach((emitter) => {
        emitter.on('operate', async(operate) => {
            let job = queue.create('operation', {operate, emitter})
            job.save()
        })
    })

    tickers.forEach((ticker) => {
        await findAsset(page,ticker.buy)
    })

    queue.process('operation', (job, done) => {
        let operation = job.data.operate.split(':')
        let message
        let ticker = operation[1]

        await clickAsset(page,ticker)

        if(operation[0] == 'buy'){
            await buyAsset(page)
            message = "Compra"
        }else if(operation[0] == 'sell'){
            await sellAsset(page)
            message = "Venda"
        }  

        await prepareAsset(page)
        let price = await finishOperation(page)
        
        message += ` de ${operation[1]} por ${price}`
        job.data.emitter.emit('notification',message)

        done()
    })

    async function openChrome(){
        console.log('> Opening Google Chrome...')
        const chrome = await puppeteer.launch({'args' : [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
          ],
            headless: false,
            defaultViewport: null
        })
        
        return chrome
    }   

    async function openNewPage(chrome){
        const page = await chrome.newPage({timeout: 60000})
        await page.setCookie(...cookie)
        return page
    }

    async function loginToClear(page){
        await page.goto('https://www.clear.com.br/pit/signin?controller=SignIn&referrer=http%3a%2f%2fwww.clear.com.br%2fpit%2fSelector%2fToNew', {waitUntil: 'networkidle2'});
        await page.setRequestInterception(true);

        const cookies = (await page.cookies()).map((cookie) => { return `${cookie.name}=${cookie.value}`; }).join('; ');

        page.on('request', interceptedRequest => {
            const headers = interceptedRequest.headers();
            headers.cookie = cookies;
            interceptedRequest.continue();
        });
        
        console.log('> Logging in to Clear...')
        
        await page.type('#identificationNumber', credentials.cpf);
        await page.type('#password', credentials.password);
        await page.focus('#dob');
        await page.type('#dob', credentials.dateofbirth);
        
        await page.waitFor(500)
        
        await page.click('input[type="submit"]');
        
        await page.waitFor(2000)
        
        console.log('> You\'re logged in.')
        
        await page.click('div.left > a > span')
        
    }
    
    async function navigateToAssets(page){
        await page.goto('https://novopit.clear.com.br/Operacoes/RendaVariavel/Basico', {waitUntil: 'networkidle0'})
        
    }

    async function findAsset(page,ticker){
        
        await page.waitForSelector('iframe')
        
        await page.waitFor(5000)
        
        
        const frame = await page.frames().find(frame => frame.name() === 'content-page')
        
        await page.waitFor(5000)

        let assets = await frame.$$eval('input.ui-autocomplete-input', (inputs) => {
            return inputs.map(input => input.value)
        });
        
        let asset = assets.filter((asset) => {return asset == ticker})
            
        if(asset.length == 0){
            await frame.click('#add-asset')
            await page.waitFor(500)
            await frame.focus('div.new_asset_st > div > label > form > input')
            await frame.type('div.new_asset_st > div > label > form > input', ticker)
            await page.keyboard.press(String.fromCharCode(13))
        }
        
        await page.waitFor(500)

    }

    async function clickAsset(page){
        const frame = await page.frames().find(frame => frame.name() === 'content-page')
        
        await frame.click(`div > label > form > input[value="${ticker}"]`)
        
        await page.waitFor(1000)
    }

    async function buyAsset(page){
        await page.click('li.bt_buy')
    }
    
    async function sellAsset(page){
        await page.click('li.bt_sell')
    }
    
    async function prepareAsset(page){
        await page.type('input#input-quantity',"1")
        await page.type('input.input-digital-sign-field', credentials.digitalSign)
    }

    async function finishOperation(page){

        let price = await page.$('input#input-price',).value;
        console.log(price)

        await page.click('label.buy-sell-label')

        return price
    }
}


module.exports = robot
var cookie = []