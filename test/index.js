const puppeteer = require('puppeteer');
const mocha = require('mocha');
const assert = require('assert');
const { promisify } = require('util');
const timeout = promisify(setTimeout);
const path = require('path');

describe('单元测试', () => {
  /** @type {puppeteer.Browser} */
  let browser;
  /** @type {puppeteer.Page} */
  let page;
  const fileUrl = 'file://' + path.resolve(__dirname, '..', 'index.html');

  before (async () => {
    browser = await puppeteer.launch();
  });

  beforeEach(async function() {
    this.timeout(60000);
    page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 1000,
    });
    await page.goto(fileUrl);
  });

  describe('drag测试', async function() {
    /** @type {number[]} */
    let clientCells;
    this.timeout(60000);

    beforeEach (async () => {
      clientCells = await page.evaluate(x => {
        return [...document.querySelectorAll('thead th')].map(x => x.cellIndex);
      });
    });

    it('拖动左侧应该无变化', async () => {
      const left = clientCells[0];
      const thOldWidth = await page.evaluate(x => {
        return document.querySelector(`thead th:nth-child(${x + 1})`).clientWidth;
      }, left);
      const thPosition = await page.evaluate(x => {
        return document.querySelector(`thead th:nth-child(${x + 1})`).getBoundingClientRect().right;
      }, left);
      await page.mouse.move(thPosition - 5, 20);
      await page.mouse.down();
      await page.mouse.move(thPosition - 5 + 30, 20);
      await page.mouse.up();
      let clientWidth = await page.evaluate(x => {
        return document.querySelector(`thead th:nth-child(${x + 1})`).clientWidth;
      }, left);
      assert.equal(clientWidth, thOldWidth + 30);
    });

    it('拖动中间应该正确', async () => {
      const center = Math.trunc(clientCells.length / 2) - 1;
      const thsOldWidth = await page.evaluate(x => {
        return [...document.querySelectorAll('thead th')].map(x => x.clientWidth);
      });
      const thPosition = await page.evaluate(x => {
        return document.querySelector(`thead th:nth-child(${x + 1})`).getBoundingClientRect().right;
      }, center);
      await page.mouse.move(thPosition - 5, 20);
      await page.mouse.down();
      await page.mouse.move(thPosition - 5 + 30, 20);
      await page.mouse.up();
      let clientsWidth = await page.evaluate(x => {
        return [...document.querySelectorAll('thead th')].map(x => x.clientWidth);
      }, center);
      for (const cellIndex of clientCells) {
        if (cellIndex === center) {
          assert.equal(clientsWidth[cellIndex], thsOldWidth[cellIndex] + 30);
        } else if (cellIndex === center + 1) {
          assert.equal(clientsWidth[cellIndex], thsOldWidth[cellIndex] - 30);
        } else {
          assert.equal(clientsWidth[cellIndex], thsOldWidth[cellIndex]);
        }
      }
    });

    it('拖动右侧应该成功', async () => {
      const right = clientCells[clientCells.length - 1];
      const thOldWidth = await page.evaluate(x => {
        return document.querySelector(`thead th:nth-child(${x + 1})`).clientWidth;
      }, right);
      const thPosition = await page.evaluate(x => {
        return document.querySelector(`thead th:nth-child(${x + 1})`).getBoundingClientRect().right;
      }, right);
      await page.mouse.move(thPosition - 5, 20);
      await page.mouse.down();
      await page.mouse.move(thPosition - 5 + 30, 20);
      await page.mouse.up();
      let clientWidth = await page.evaluate(x => {
        return document.querySelector(`thead th:nth-child(${x + 1})`).clientWidth;
      }, right);
      assert.equal(clientWidth, thOldWidth);
    });
  });

  describe('sort测试',async () =>{
    it('点击一次排序应该正确', async function() {
      this.timeout(10000);
      await timeout(1000);
      const clickTargets = await page.evaluate(x => {
        return [...document.querySelectorAll('th[sort-field]')].map(x => {
          x.querySelector('a').id = x.getAttribute('sort-field');
          return {
            id : x.querySelector('a').id,
            cellIndex : x.cellIndex,
          }
        });
      });
      for (const clickTarget of clickTargets) {
        let oldDataOne = await page.evaluate(x => {
          return {
            data: [...document.querySelectorAll(`tbody td:nth-child(${x[0] + 1})`)].map(x => x.innerText),
            sortMark: /fa-sort-(.*)/.exec(document.querySelector(`#${x[1]} i`).className) ? 'asc' : 'desc',
          }
        }, [clickTarget.cellIndex, clickTarget.id]);
        await page.click('#' + clickTarget.id);
        await timeout(500);
        let resultOne = await page.evaluate(x => {
          return {
            data: [...document.querySelectorAll(`tbody td:nth-child(${x[0] + 1})`)].map(x => x.innerText),
            sortMark: document.querySelector(`#${x[1]} i`).className,
          }
        }, [clickTarget.cellIndex, clickTarget.id]);
        if (isNaN(oldDataOne.data[1])) {
          assert.deepEqual(oldDataOne.data.sort((a, b) => b.localeCompare(a)), resultOne.data);
        } else {
          assert.deepEqual(oldDataOne.data.sort((a, b) => b - a), resultOne.data);
        }
        assert.equal('fa fa-sort-' + oldDataOne.sortMark, resultOne.sortMark);
      }
    });

    it('点击两次排序应该正确', async function() {
      this.timeout(20000);
      await page.click('.fa');
      await timeout(500);
      const oldDataTwo = await page.evaluate(x => {
        return {
          data: [...document.querySelectorAll('tbody td:first-child')].map(x => +x.innerText),
          sortMark: document.querySelector('th[sort-field="id"] i').className,
        }
      });
      await page.click('.fa');
      await timeout(500);
      const resultTwo = await page.evaluate(x => {
        return {
          clickData: [...document.querySelectorAll('tbody td:first-child')].map(x => +x.innerText),
          sortMark: document.querySelector('th[sort-field="id"] i').className,
        }
      });
      assert.deepEqual(oldDataTwo.data.sort((a, b) => a - b), resultTwo.clickData);
      assert.equal(oldDataTwo.sortMark.replace(/desc/, 'asc'), resultTwo.sortMark);
    });
  });

  afterEach(async () => {
    await page.close();
  });

  after(async () => {
    await browser.close();
  });
});
