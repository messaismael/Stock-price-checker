/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          assert.equal(res.body.stockData.stock, 'GOOG')
          assert.equal(res.body.stockData.price, 1402.275)
          assert.equal(typeof res.body.stockData.likes, 'number') 
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
          .get("/api/stock-prices")
          .query({
            stock: 'goog',
            like: true
          })
          .end(function(err, res){
            assert.equal(res.body.stockData.stock, 'GOOG')
            assert.equal(res.body.stockData.price, 1402.275)
            assert.isAbove(res.body.stockData.likes, 0)
            done()
          })
          
        
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
          .get("/api/stock-prices")
          .query({
            stock: 'goog',
            like: true
          })
          .end(function(err, res){
            assert.equal(res.body.stockData.stock, 'GOOG')
            assert.equal(res.body.stockData.price, 1402.275)
            assert.isAbove(res.body.stockData.likes, 1)
            done()
          })
  
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
          .get("/api/stock-prices")
          .query({
            stock: ['goog','amd'],
          })
          .end(function(err, res){
            assert.equal(res.body.stockData[0].stock,  'GOOG')
            assert.equal(res.body.stockData[1].stock,  'AMD')
            assert.equal(res.body.stockData[0].price,  1402.275)
            assert.equal(res.body.stockData[1].price,  55.67 )
            done()
          })

      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
          .get("/api/stock-prices")
          .query({
            stock: ['goog','amd'],
            like: true
          })
          .end(function(err, res){
            assert.equal(res.body.stockData[0].stock,  'GOOG')
            assert.equal(res.body.stockData[1].stock,  'AMD')
            assert.equal(res.body.stockData[0].price,  1402.275)
            assert.equal(res.body.stockData[1].price,  55.67 )
            assert.isAbove(res.body.stockData[0].likes, 0)
            assert.isAbove(res.body.stockData[1].likes, 0)
            done()
          })

        
      });
      
    });

});
