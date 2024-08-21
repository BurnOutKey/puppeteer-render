const puppeteer = require("puppeteer");
require("dotenv").config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const scrapeLogic = async (res, amount = 5) => {
  const browser = await puppeteer.launch({
    args: [
      '--disable-blink-features=AutomationControlled',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-infobars',
          '--window-position=0,0',
          '--ignore-certificate-errors',
          '--ignore-certificate-errors-spki-list',
        ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    console.log("Browser launched.");
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
      });

      await page.goto(Math.random() > .5 ? "https://moomoo.io" : "https://sandbox.moomoo.io");
  
      await delay(Math.random() * 1000);
  await page.mouse.move(50 + Math.random() * 500, 50 + Math.random() * 500);
  await page.mouse.down();
  await page.mouse.up();

    console.log("Puppeteer's ready!");
    
    async getToken() {
      const Token = await page.evaluate(async () => {
        return await new Promise((resolve) => {
          window.grecaptcha
            .execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
              action: "homepage",
            })
            .then((token) => {
              resolve(encodeURIComponent(token));
            });
        });
      });
  
      if(Token.length < 300) Token = "Fail";
  
      return Token;
    }

    let arr = [];
    for(let i = 0; i < amount; i += 1) {
      arr.push(await getToken())
    }
    res.send(JSON.stringify(arr))
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
