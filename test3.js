const puppeteer = require("puppeteer");

const f = async (url) =>
  new Promise(async function (resolve, reject) {
    x = 5;
    const browser = await puppeteer.launch({
      headless: true,
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });
    page = await browser.newPage();
    try {
      await page.goto(url);
      resolve("Completed");
    } catch (error) {
      reject(x);
    }
    await browser.close();
  });

async function recurse(url) {
  await f(url)
    .catch(async (err) => {
      // console.log(err);
      await recurse("https://www.thewatchbox.com/");
    })
    .then((res) => {
      // console.log(res);
      resolve(res);
    });
}


recurse("alskjdhfanwuienfuiawenf")
