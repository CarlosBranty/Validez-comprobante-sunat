const express = require("express");
const puppeteer = require("puppeteer");
const port = process.env.PORT || 3000;


const app = express();
app.set("port", port);
app.use(express.json())

const browserP = puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],headless: true
  });
  
  app.post("/sunat", (req, res) => {
    let page;
    let body_filtros = req.body;
    console.log(body_filtros);
    (async () => {
      page = await (await browserP).newPage();
        await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
          await page.goto('https://ww1.sunat.gob.pe/ol-ti-itconsultaunificadalibre/consultaUnificadaLibre/consulta');
          await page.waitForSelector("#btnConsultar");  
          await page.type("#numRuc",body_filtros.documento);
          await page.type("#codComp",body_filtros.codigocomp);
          await page.type("#numeroSerie",body_filtros.serie);
          await page.type("#numero",body_filtros.numeroserie);
          await page.type("#codDocRecep",body_filtros.tipodoc);
          await page.type("#numDocRecep",body_filtros.documentocliente);
          await page.type("#fechaEmision",body_filtros.fechaemision);
          await page.type("#monto",body_filtros.importe);
          await page.click("#btnConsultar");
          await page.waitForTimeout(6000);
          let salida = await page.evaluate(() => {
            var elemento = document.querySelectorAll('.list-group-item-text'); 
            return {
                resEstado: elemento[0].innerHTML,
              //actividades:  elemento[10].innerHTML,
            };
          });
           res.send(salida);
          })()
          .catch(err => res.sendStatus(500))
          .finally(async () => await page.close())
        ;
  });

app.post("/", (req,res) => {
    res.send("Estado del Documento: "+req.body.documento);
});

 app.listen(app.get("port"), () => console.log("app running on port", port));