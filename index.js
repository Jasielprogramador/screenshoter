const express = require('express')
const puppeteer = require('puppeteer');

const app = express()
const port = 3000
const fs = require('fs');
const url = require('url');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static('public'))


app.get('/', (req, res) => {
//  res.send('Hello World!');
    (async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

    let web = req.query.page;
    let pass = req.query.pass;

   let domain = url.parse( web ).hostname;
   let protocol = url.parse( web ).protocol;

if (!fs.existsSync('public/' + domain)){
       fs.mkdirSync('public/' + domain);
}

  await page.goto(web);

        try {
            await page.type('#inputEmail', 'admin');
    await page.type('#inputPassword', pass);

    await page.click('button');

    await page.waitForNavigation();

    console.log('New Page URL:', page.url());
        }catch(error){
            console.log("input not found ");

        }

    let data = Math.round(new Date().getTime() / 1000);

    await page.screenshot({path: `public/${domain}/${data}.png`});

  await browser.close();

        res.render('index', { image : `${domain}/${data}.png`, data: data, sdata: new Date() } ) 


})();

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
