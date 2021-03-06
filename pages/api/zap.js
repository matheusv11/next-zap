const puppeteer = require("puppeteer");
const axios     = require('axios');
const fs        = require('fs');
const path      = require('path');
const cron      = require('node-cron');

async function zap (req,res) {
    //salvar cookie no localStorage ou em bd pra diferentes users
    //Pasta user_data no server não rola, pois todos terão a mesma
    //qrcode deve ser retornado ao cliente ao inves de ser salvo local

    const sendMessage = async(bom) => {
        try {

            //PUPPETEER CONFIG
            const browser = await puppeteer.launch({ headless: true}); 
            const page = await browser.newPage();
            await page.setUserAgent(
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
            );
            
            //GO TO ZAP
            await page.goto("https://web.whatsapp.com/");

            const canvas = await page.waitForSelector("canvas");
            const qr = await page.$('._25pwu');
                
            await page.screenshot({path: './public/assets/img/qrcode.png'});
            
            await page.waitForSelector("._1XkO3");    //WHITE THEME

            //SEARCH CONVERSATION IN ZAP
            const contact = "PATO LÓGICO 🇧🇷 🇮🇱 🇺🇸 🇦🇴 🇰🇵 🇨🇳";
            await page.click(`span[title='${contact}']`);
            await page.waitForSelector("._1fqrG");

            //FOCUS ON MESSAGE BAR
            await page.focus("div[data-tab='6']"); 
            
            await page.evaluate(() => {
                const message = "@Paulo Isaac";
                document.execCommand("insertText", false, message);
            }); 

            await page.waitForTimeout(1000);
            await page.click(".matched-text");
            await page.waitForTimeout(500);

            //OPEN CLIPBOARD
            await page.click('span[data-icon="clip"]');
            await page.waitForTimeout(1000);    

            //INPUT FILE
            const inputFile = await page.$('input[accept="image/*,video/mp4,video/3gpp,video/quicktime"]');
            await inputFile.uploadFile( path.resolve('./public/assets/img', `${bom}.jpg`) );
            
            await browser.close();
            //SEND FILE
            await page.waitForTimeout(2000);
            await page.click('span[data-testid="send"]');
            await page.waitForTimeout(3000);


        } catch (e) {
            console.error("ERROR=>", e);
        }

    }

    sendMessage('dia');
    // cron.schedule('0 6 * * *', ()=> sendMessage('dia')   );
    // cron.schedule('0 0 * * *', ()=> sendMessage('noite') );

    return res.send('Iniciado');
}

export default zap;