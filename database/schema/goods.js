const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const ObjectId = Schema.Types.ObjectId
// 创建模型
const goodsSchema = new Schema({
  title: String,
  price: Number,
  desc: String,
  totalCat: String,
  segmentCat: String,

  poster: String,
  originUrl: String,

  posterKey: String,



  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// 在修改之前操作

goodsSchema.pre('save', function(next){
  if (this.isNew) {
    this.meta.createAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next() // 接下去操作
})

// 发布模型，让模型可增删改查
mongoose.model('Goods', goodsSchema)