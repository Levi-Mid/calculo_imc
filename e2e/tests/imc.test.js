const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

const SCREENSHOTS_DIR =
    path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

let driver;

async function tiraFoto(nome) {
    const imagem = await driver.takeScreenshot();


    fs.writeFileSync(
        path.join(SCREENSHOTS_DIR, `${nome}.png`),
        imagem,
        'base64'
    );


}

async function abrirPagina() {
    await driver.get(BASE_URL);
}

async function clicarCalcular() {
    await driver
        .findElement(By.id('calcular'))
        .click();


    await new Promise(r => setTimeout(r, 1000));


}

async function obterResultado() {
    return await driver
        .findElement(By.id('resultado'))
        .getText();
}

async function testePesoVazio() {

    await abrirPagina();

    await driver
        .findElement(By.id('altura'))
        .sendKeys('1.67');

    await clicarCalcular();

    const texto = await obterResultado();

    await tiraFoto('peso_vazio');

    if (!texto) {
        throw new Error('Nenhuma mensagem exibida para peso vazio');
    }

    console.log('Teste peso vazio OK');


}

async function testeAlturaVazia() {


    await abrirPagina();

    await driver
        .findElement(By.id('peso'))
        .sendKeys('55');

    await clicarCalcular();

    const texto = await obterResultado();

    await tiraFoto('altura_vazia');

    if (!texto) {
        throw new Error('Nenhuma mensagem exibida para altura vazia');
    }

    console.log('Teste altura vazia OK');

}

async function testeCamposVazios() {


    await abrirPagina();

    await clicarCalcular();

    const texto = await obterResultado();

    await tiraFoto('campos_vazios');

    if (!texto) {
        throw new Error('Nenhuma mensagem exibida para campos vazios');
    }

    console.log('Teste campos vazios OK');


}

async function testeCalculoCorreto() {


    await abrirPagina();

    await driver
        .findElement(By.id('peso'))
        .sendKeys('55');

    await driver
        .findElement(By.id('altura'))
        .sendKeys('1.67');

    await clicarCalcular();

    const texto = await obterResultado();

    await tiraFoto('resultado_correto');

    if (!texto) {
        throw new Error('Resultado não encontrado');
    }

    console.log('Resultado:', texto);
    console.log('Teste cálculo OK');


}

async function main() {


    try {

        const opts = new chrome.Options();

        opts.addArguments(
            '--headless=new',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=1280,720'
        );

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(opts)
            .build();

        await testePesoVazio();
        await testeAlturaVazia();
        await testeCamposVazios();
        await testeCalculoCorreto();

        console.log('Todos os testes passaram!');

    } finally {

        if (driver) {
            await driver.quit();
        }

    }


}

main().catch(err => {
    console.error(err);
    process.exit(1);
})
