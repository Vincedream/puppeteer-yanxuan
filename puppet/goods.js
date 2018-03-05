const puppeteer = require('puppeteer')
const { connect, initSchemas } = require('../database/init')
const  mongoose = require('mongoose')
const config = require('../config/url')
const url = `http://you.163.com/item/list?categoryId=`
const allTypeUrl = config.allTypeUrl

// 睡眠时间
const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

async function getAllGoods () {
  console.log('start visit the yanxuan page')
  // 启动chrome
  const browser = await puppeteer.launch({
    args: ['--no-sanbox'],
    dumpio: false,
    headless: false
  })

  // 创建新页面
  const page = await browser.newPage()
  page.setViewport({
    width: 1920,
    height: 1080,
  });
  var allGoods = []
    for (let i = 0; i < allTypeUrl.length; i++) {
      await page.goto(url + allTypeUrl[i], {
        waitUntil: 'networkidle2'
      })
      await sleep(3000)
      const result = await page.evaluate(() => {
        var $ = window.$
        var items = $('.m-Level2Category')
        items = items.slice(0, 2)
        var allGoodsUrlArr = []
        // return items.length
        items.each( (index, item) => {
          let it = $(item)
          let segTypeGoodsArr = it.find('ul').find('li')
          segTypeGoodsArr = segTypeGoodsArr.slice(0, 7)
          let segTypeGoodsUrlArr = []
          segTypeGoodsArr.each(async (index, item) => {
            let singleGoods = $(item)
            let itemUrl = singleGoods.find('a').attr('href')
            segTypeGoodsUrlArr.push(itemUrl)
          })
          allGoodsUrlArr = [...allGoodsUrlArr,...segTypeGoodsUrlArr]
          })
        return allGoodsUrlArr
      })
      allGoods = [...allGoods, ...result]
    }
    console.log(allGoods)
    await connect()
  // 引入所有模型
  initSchemas()
  const Goods = mongoose.model('Goods')
  for(let g = 0; g < allGoods.length; g++){
    var originUrl =  allGoods[g]
    console.log(originUrl)
    const goods = new Goods({
      originUrl
    });
    await goods.save()
    // await sleep(30)
  }
  browser.close()
}

module.exports = {
  getAllGoods
}