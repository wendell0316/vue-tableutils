const puppeteer = require('puppeteer');
const mocha = require('mocha');
const assert = require('assert');
const { promisify } = require('util');
const timeout = promisify(setTimeout);

describe('sort测试', () => {
  /** @type {puppeteer.Browser} */
  let browser;
  /** @type {puppeteer.Page} */
  let page;

  before(async () => {
    browser = await puppeteer.launch();
  });
  beforeEach(async function() {
    this.timeout(60000);
    page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 1000,
    });
    await page.goto('file:///Users/wendell/vue-tableutils/index.html');
  });
  describe('drag测试', () => {
    it('拖动应该正确', async function() {
      const clientOldWidth = await page.evaluate(x => {
        return [...document.querySelectorAll('thead th')].map(x => x.clientWidth);
      });
      clientOldWidth.forEach(async (thWidth, index) => {
        if (index !== clientOldWidth.length - 1) {
          await page.mouse.move(thWidth * (index + 1), 20);
          await page.mouse.down();
          await page.mouse.move(thWidth * (index + 1) + 30, 20);
          await page.mouse.up();
          await timeout(1000);
          const clientWidth = await page.evaluate(x => {
            return [...document.querySelectorAll('thead th')][x].clientWidth;
          }, index);
          assert.equal(clientWidth * (index + 1) + 30, thWidth * (index + 1) + 30);
        }
      });
    });
  });
  it('点击一次排序应该正确', async function() {
    const clickTargets = await page.evaluate(x => {
      return [...document.querySelectorAll('.fa')].map(x => {
        x.parentElement.id = x.parentElement.parentElement.getAttribute('sort-field');
        return x.parentElement.parentElement.getAttribute('sort-field');
      });
    });
    clickTargets.forEach(async (clickTarget, index) => {
      const oldDataOne = await page.evaluate(x => {
        return {
          data: [...document.querySelectorAll(`tbody td:nth-child(${x})`)].map(x => +x.innerText),
        }
      }, index);
      await page.click('#' + clickTarget);
      await timeout(1000);
      const resultOne = await page.evaluate(x => {
        return {
          data: [...document.querySelectorAll(`tbody td:nth-child(${x})`)].map(x => +x.innerText),
        }
      }, index);
      assert.deepEqual(oldDataOne.data.sort((a, b) => {return b - a}), resultOne.data);
    });
  });
  it('点击两次排序应该正确', async function() {
    this.timeout(60000);
    await page.click('.fa');
    await timeout(500);
    const oldDataTwo = await page.evaluate(x => {
      return {
        data: [...document.querySelectorAll('tbody td:first-child')].map(x => +x.innerText),
        sortMark: document.querySelector("th[sort-field='id'] i").className,
      }
    });
    await page.click('.fa');
    await timeout(500);
    const resultTwo = await page.evaluate(x => {
      return {
        clickData: [...document.querySelectorAll('tbody td:first-child')].map(x => +x.innerText),
        sortMark: document.querySelector("th[sort-field='id'] i").className,
      }
    });
    assert.deepEqual(oldDataTwo.data.sort((a, b) => {return a - b}), resultTwo.clickData);
  });

});



