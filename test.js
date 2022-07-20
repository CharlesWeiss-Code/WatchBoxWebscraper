const puppeteer = require("puppeteer");

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });
  testPage = await browser.newPage();
  await testPage.goto(
    "https://davidsw.com/?filter_complications=date&s=116610LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
  ).then((thing) => console.log(thing))
}

run()
