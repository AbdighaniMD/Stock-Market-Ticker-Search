const express = require('express');
const exphbs =  require('express-handlebars');
const app = express();

const requests = require('request');
require('dotenv').config();


const API = process.env.API_KEY;
function API_CALL (callBack,stock_ticker){
  requests('https://cloud.iexapis.com/v1/stock/' + stock_ticker + '/quote?token='+ API, 
  {json:true}, (err, res, body) => 
  {
    if(err){
      return console.log(err);
    } 
    if(res.statusCode === 200){
      callBack(body);
    }
    else if(res.statusCode === 404){
      console.log("Not Found!");
    }
  });
}

//middleware
//app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
app.use(express.json());


//Templating Engine: Set handlebar middleware
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Setting handlebar GET routes 
app.get('/', function (req, res) {
  res.render('home');
});

// Setting handlebar POST routes 
app.post('/', function (req, res) {
  API_CALL((CallFunction_doneAPI) =>{
      //postedStock = req.body.searchBar;
      res.render('stockTicker', {
      stock: CallFunction_doneAPI,
      //postedStock: postedStock
    });
  }, req.body.searchBar);
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});