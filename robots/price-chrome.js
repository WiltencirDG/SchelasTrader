const puppeteer = require('puppeteer')
const credentials = require('../credentials/investing.json')

async function robot(emitter,ticker){
        
    const chrome = await openChrome()
    const page = await openNewPage(chrome)
    await navigateToInvesting(page)
    await loginToInvesting(page)
    await navigateToTrackPage(page)
    await setTickerAsActive(page)
    
    emitter.on("getMovingAverage", async (movingAverages)=>{
        await getMovingAverage(page, movingAverages)
        emitter.emit('readPrice',movingAverages)
    })

    async function openChrome(){
        console.log('> Opening Google Chrome...')
        const chrome = await puppeteer.launch({'args' : [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
          ],timeout: 60000
          , headless: false, defaultViewport: null
        })
        return chrome
    }   

    async function openNewPage(chrome){
        const page = await chrome.newPage({timeout: 60000})
        return page
    }

    async function navigateToInvesting(page){
        await page.goto('https://br.investing.com/charts/stocks-charts', {waitUntil: 'networkidle2'});
    }

    async function loginToInvesting(page){
        console.log('> Logging in to Investing...')

        try{
            await page.click('i.popupCloseIcon');
        }catch(error){
            
        }

        await page.click('a.login');
        
        await page.type('#loginFormUser_email', credentials.login);
        await page.type('#loginForm_password', credentials.password);
        

        //console.time('Took')
        await page.evaluate(()=>{
            loginFunctions.submitLogin();
        })
    
        try{
            await page.waitForNavigation({timeout: 25000});

        }catch(error){
            //console.timeEnd('Took')
            throw new Error('unavailable')
        }

        //console.timeEnd('Took')
        console.log('> You\'re logged in.')
    }
    
    async function navigateToTrackPage(page){
        await page.goto('https://tvc-invdn-com.akamaized.net/web/1.12.27/index57-prod.html?carrier=1467e6e3f5a0c48dc3f27bef0be02def&time=1591321571&domain_ID=30&lang_ID=12&timezone_ID=12&version=1.12.27&locale=en&timezone=America/Argentina/Buenos_Aires&pair_ID=18750&interval=D&session=session&prefix=br&suffix=&client=1&user=213216266&family_prefix=tvc4&init_page=live-charts&sock_srv=https://stream61.forexpros.com:443&m_pids=&watchlist=18750,18814,18812,18604,18606,18669,18689,18708,18628,18687,18738,18744,18748,18749,18814,6408,941155,44334&geoc=BR', {timeout: 60000})
    }
   
    async function setTickerAsActive(page){
        
        await page.waitForSelector('iframe');
        
        const elementHandle = await page.$('iframe',);
        const frame = await elementHandle.contentFrame();

        await page.waitFor(2000)

        await frame.click('span.load')
        await page.waitFor(3000)
        //await frame.click('div[text="LayoutBOT"]')

        const linkHandlers = await frame.$x("//div[contains(text(), 'LayoutBOT')]");
        await linkHandlers[0].click();

        await page.waitFor(1000)

        await frame.click("input.symbol-edit")
        await frame.type("input.symbol-edit",ticker.price)
        await page.keyboard.type(String.fromCharCode(13));
    }

    async function getMovingAverage(page, movingAverages){
        //console.log('> Getting Strategy...')
        //console.time('Price')
        const elementHandle = await page.$('iframe',);
        const frame = await elementHandle.contentFrame();
        let mediaCompra = 0
        let mediaVenda = 0

        await page.waitFor(750)

        const movingAveragesS = await frame.$$eval('div.pane-legend > div > div > span > span.pane-legend-item-value', (averages) => {
            const result = averages.map(average => average.innerText)        
            return result
        });

        mediaCompra = movingAveragesS[4]
        mediaVenda = movingAveragesS[5]

        //console.timeEnd('Price')
        movingAverages.mediaCompra = mediaCompra
        movingAverages.mediaVenda = mediaVenda

        //return movingAverages
        //return {mediaCompra, mediaVenda}
    }
}
module.exports = robot