const { createApp, h }                      = require("vue");
const { createMemoryHistory, createRouter } = require("vue-router");
const { renderToString }                    = require("@vue/server-renderer");
const puppeteer                             = require("puppeteer");
const fs                                    = require('fs');

const routes = [{ path: "/", component: { template: "<div id='app'></div>" } }];
const router = createRouter({ history: createMemoryHistory(), routes });


const componentCode = fs.readFileSync('./src/App.vue', 'utf8');

const component = {
    template: componentCode
};

console.log(component)


counter = 1

function fuzz(buf)
{
  const app = createApp({
    template: component,
    data() {
      return { name: buf };
    },
  });

  router.isReady().then(() => {
    const el = document.getElementById("app");
    const mountedApp = app.mount(el);
  }).catch((error) => {
    console.error(error);
});;

  (async () => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    try {

    await page.setContent("<html><body><div id='app'></div></body></html>");

    const appHtml = await renderToString(app);
    await page.evaluate((html) => {
      const el = document.getElementById("app");
      el.innerHTML = html;
    }, appHtml);

    await page.waitForSelector("#app");

  } catch(e) {
    //console.log(e);
  } finally {

    counter  = counter + 1

    const screenshot = await page.screenshot({ type: "png", path:"view\test" + counter.toString() + ".png" });

    await page.close();
    await browser.close();
  }
    //const screenshot = await page.screenshot({ type: "png", path:"test.png" });

  })();

  }

  module.exports = {
    fuzz
};