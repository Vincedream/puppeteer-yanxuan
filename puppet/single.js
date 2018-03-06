const puppeteer = require("puppeteer");
const { connect, initSchemas } = require("../database/init");
const mongoose = require("mongoose");
const url = `http://you.163.com`;

// 睡眠时间
const sleep = time =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

async function getSingleGoods() {
  console.log("start visit the yanxuan page");
  await connect();
  initSchemas();
  const Goods = mongoose.model("Goods");
  let allGoods = await Goods.find({});

  // console.log(aa.originUrl)
  // 启动chrome
  const browser = await puppeteer.launch({
    args: ["--no-sanbox"],
    dumpio: false,
    headless: false
  });

  // 创建新页面
  const page = await browser.newPage();
  page.setViewport({
    width: 1920,
    height: 1080
  });
  let numb
  // allGoods.map(async (item) => {
  for (var j = 0; j < allGoods.length; j++) {
    await page.goto(url + allGoods[j].originUrl, {
      waitUntil: "networkidle2"
    });
    await sleep(1000);
    const result = await page.evaluate(() => {
      var goodsInfo = {}
      var $ = window.$;
      var items = $(".m-crumb");
      let topSpanOne = items.find('span').find('.crumb-name')
      let topSpanTwo = items.find('span').find('.crumb-url ')
      let title = $(topSpanOne[1]).text()
      let totalCat = $(topSpanTwo[0]).text()
      let segmentCat = $(topSpanTwo[1]).text()
      let desc = $(".desc").text()
      let price = $(".num").text()

      let specProp = $(".specProp")
      let chooseArr = []
      for(var i = 0; i < specProp.length; i++){
        let singleChooseTitle = $(specProp[i]).find('.type').text()
        let singleChooseInfo = $(specProp[i]).find('li')
        let allChooseCom = {
          title: singleChooseTitle,
          oneChooseCom: []
        }
          for(var j = 0; j < singleChooseInfo.length; j++){
            let temp = {}
            if ($(singleChooseInfo[j]).find('.txt')) {
              temp.text = $(singleChooseInfo[j]).find('.txt').text()
            } 
            if ($(singleChooseInfo[j]).find('img')) {
              temp.text = $(singleChooseInfo[j]).find('.title').text()
              temp.urlImg = $(singleChooseInfo[j]).find('img').attr('src')
            }
            allChooseCom.oneChooseCom.push(temp)
          }
        chooseArr.push(allChooseCom)
      }

      let introPicArr = []
      let zActive = $(".list").find("li")
      for (var h = 0; h < zActive.length; h++) {
        let temp = $(zActive[h]).find("img").attr('src')
        introPicArr.push(temp)
      }

      let picArr = []
      let imgLazy = $(".short")
      for(var l = 0; l < imgLazy.length; l++) {
        let temp = $(imgLazy[l]).attr('data-original')
        picArr.push(temp)
      }

      let cateList = []
      let jItem = $(".j-item")
      for (var k = 0; k < jItem.length; k++) {
        let temp = {}
        temp.title = $(jItem[k]).find('.name').text()
        temp.desc = $(jItem[k]).find('.value').text()
        cateList.push(temp)
      }
      goodsInfo = {
        title,
        totalCat,
        segmentCat,
        desc,
        chooseArr,
        cateList,
        picArr,
        introPicArr
      }
      return goodsInfo
    });
  console.log(result)
  }
}

module.exports = {
  getSingleGoods
};
