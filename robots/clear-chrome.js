const puppeteer = require('puppeteer')
const credentials = require('../credentials/clear.json')

async function robot(){
        
    const chrome = await openChrome()
    const page = await openNewPage(chrome)
    await navigateToClear(page)
    await loginToClear(page)
    await navigateToAssets(page)
    //await closeChrome(chrome)

    async function openChrome(){
        console.log('> Opening Google Chrome...')
        const chrome = await puppeteer.launch({'args' : [
            '--no-sandbox',
            '--disable-setuid-sandbox'
          ],timeout: 60000
          //, headless: false, defaultViewport: null
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
        await page.type('#password', credentials.password);
        await page.type('#dob', credentials.dateofbirth);

        
        console.time('Took')
        await page.click('input[type="submit"]');
    
        try{
            await page.waitForNavigation({timeout: 25000});

        }catch(error){
            console.timeEnd('Took')
            console.log('> Sadly, Clear is unavailable right now. Please, try again soon!')
            throw new Error('unavailable')
        }

        console.timeEnd('Took')
        console.log('> You\'re logged in.')
    }
    
    async function navigateToAssets(page){
        await page.goto('https://novopit.clear.com.br/Operacoes/RendaVariavel/Basico', {timeout: 60000})
    }
    
    async function closeChrome(chrome){
        console.log('> Closing Google Chrome...')
        await chrome.close()
    }
}

module.exports = robot