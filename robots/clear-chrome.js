const puppeteer = require('puppeteer')
const credentials = require('../credentials/clear.json')

async function robot(){
        
    const chrome = await openChrome()
    const page = await openNewPage(chrome)
    await navigateToClear(page)
    await loginToClear(page)
    await navigateToAssets(page)

    async function openChrome(){
        console.log('> Opening Google Chrome...')
        const chrome = await puppeteer.launch({'args' : [
            '--no-sandbox',
            '--disable-setuid-sandbox'
          ],timeout: 60000
          , headless: false, defaultViewport: null
        })
        return chrome
    }   

    async function openNewPage(chrome){
        const page = await chrome.newPage({timeout: 60000})
        return page
    }

    async function navigateToClear(page){        
        await page.goto('https://www.clear.com.br/pit/signin?controller=SignIn', {waitUntil: 'networkidle2'});
    }

    async function loginToClear(page){
        console.log('> Logging in to Clear...')

        await page.type('#identificationNumber', credentials.cpf);
        page.waitFor(500)
        await page.type('#password', credentials.password);
        page.waitFor(500)
        await page.type('#dob', credentials.dateofbirth);

        page.waitFor(3000)

        await page.click('input[type="submit"]');
    
        try{
            await page.waitForNavigation({timeout: 25000});
        }catch(error){
            throw new Error('unavailable')
        }
        
        console.log('> You\'re logged in.')
        page.waitFor(1000)
        await page.click('div.left > a')
        page.waitFor(2000)
    }
    
    async function navigateToAssets(page){
        await page.goto('https://novopit.clear.com.br/Operacoes/RendaVariavel/Basico', {timeout: 60000})

    }
    
}

module.exports = robot