/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

var mongoose = require("mongoose");

var axios = require("axios");

mongoose.connect( process.env.DATA_BASE, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify : false } );
let Schema =  mongoose.Schema;
let stockSchema = new Schema({
  stock: String,
  price: Number,
  likes: Number
})

let StockData = mongoose.model('StockData', stockSchema)

  function getStock(stock) {
    return axios.get(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`);
  }

  async function stockJson (stock, like){
   let result =  await getStock(stock);
      
      if (typeof result.data === "object") {
        
        let doc = await StockData.findOne({stock: stock.toUpperCase()});
        
        if (doc) {
          
          doc.likes = (like)? doc.likes+1: doc.likes;
          await doc.save();
          return { stock: doc.stock,price: doc.price,likes: doc.likes }
          
        } 
        else {
          
          let news = new StockData({
           stock: stock.toUpperCase(),
           price: result.data.latestPrice,
           likes: (like)? 1: 0,
          })
          await news.save();
          return {stock: news.stock, price: news.price,likes: news.likes} 
          
        }
      }
      else{
        return {"error":"Not Found","likes":(like)? 1: 0 };
      }
}


module.exports = function (app) {
  
  app.route('/api/stock-prices')
    .get(async function (req, res){
    let stock = req.query.stock;
    let like = req.query.like;
    
    if (typeof stock !=="object") {
       
      res.json({stockData:  await stockJson( stock, like)});
    }
    else {

      res.json({stockData: [await stockJson(stock[0], like), await stockJson(stock[1], like)]});
    }
     
    });
    
};
