const puppeteer = require('puppeteer')
const { connect, initSchemas } = require('../database/init')
const  mongoose = require('mongoose')
const url = `http://you.163.com`

// 睡眠时间
const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})


async function getSingleGoods() {
  console.log('start visit the yanxuan page')
  await connect()
  initSchemas()
  const Goods = mongoose.model('Goods')
  let allGoods = await Goods.find({})

  
  // console.log(aa.originUrl)
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
  // allGoods.map(async (item) => {
    for (var j = 0; j < allGoods.length; j++) {
      console.log(allGoods[j])
    await page.goto(url + allGoods[j].originUrl, {
      waitUntil: 'networkidle2'
    })
    await sleep(1000)
    }
    
    // const result = await page.evaluate(() => {
      // var $ = window.$
      // var items = $('.m-Level2Category')
      // items = items.slice(0, 2)
      // var allGoodsUrlArr = []
      // // return items.length
      // items.each( (index, item) => {
      //   let it = $(item)
      //   let segTypeGoodsArr = it.find('ul').find('li')
      //   segTypeGoodsArr = segTypeGoodsArr.slice(0, 7)
      //   let segTypeGoodsUrlArr = []
      //   segTypeGoodsArr.each(async (index, item) => {
      //     let singleGoods = $(item)
      //     let itemUrl = singleGoods.find('a').attr('href')
      //     segTypeGoodsUrlArr.push(itemUrl)
      //   })
      //   allGoodsUrlArr = [...allGoodsUrlArr,...segTypeGoodsUrlArr]
      //   })
      // return allGoodsUrlArr
    // })
  // })
}

module.exports = {
  getSingleGoods
}