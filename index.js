const puppeteer = require('puppeteer')

const url = `http://you.163.com/`

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})


;(async () => {
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
  // 进入网页等待网页闲置（加载完毕）
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })

  await sleep(3000)
  // 等待加载完成more元素
  await page.waitForSelector('.more')

  for (let i = 0; i < 1; i++) {
    await sleep(3000)
    // 点击more元素
    await page.click('.more')
  }

  const result = await page.evaluate(() => {
    // var $ = window.$
    // var items = $('.list-wp a')
    // var links = []

    // if(items.length >= 1) {
    //   items.each((index, item) => {
    //     let it = $(item)
    //     let doubanId = it.find('div').data('id')
    //     let title = it.find('.title').text()
    //     let rate = Number(it.find('.rate').text())
    //     let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')

    //     links.push({
    //       doubanId,
    //       title,
    //       rate,
    //       poster
    //     })
    //   })
    // }
    // return links
  })

  browser.close()
})()