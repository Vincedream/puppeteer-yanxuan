const db = 'mongodb://localhost/yanxuan'
const mongoose = require('mongoose')
const glob = require('glob')
const { resolve } = require('path')


mongoose.Promise = global.Promise

// 同步加载模型
exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
  console.log('ddd')
}

exports.connect = () => {
  let maxConnectTimes = 0
  return new Promise((resolve, reject) => {
    if(process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
  
    mongoose.connect(db)
  
    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++

      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('数据库挂了')
      }
    })
    mongoose.connection.on('error', err => {
      maxConnectTimes++

      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('数据库挂了吧，快去修吧少年')
      }
    })
    mongoose.connection.once('open',() => {
      resolve()

      console.log('mongo connect success')
    })
  })
}