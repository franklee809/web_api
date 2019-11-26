const express = require('express');
const router = express.Router();
const stockList = require('../../models/Home').StockList; 
const PriceList = require('../../models/Home').PriceList;
const search = require('../../models/Home').search;
const axios = require('axios');
const getSymbol = require('./function').getSymbol;

// @route       GET api/home/getAllSymbolList
// @desc        Get all stock data
// @access      Public  

router.get('/getAllSymbolList',async (req,res) => {
    try{
        // get 
        const link = `https://financialmodelingprep.com/api/v3/company/stock/list`;

        var a = await stockList.find({});
        if( a.length == 0){
            axios.get(link).then(response=>{
                // res.send(response.data) 
                response.data.symbolsList.forEach(async(item)=>{
                    var list = new stockList({
                        symbol : item.symbol,
                        name : item.name,
                        price : 0
                    })
                    await list.save()
                    // res.send(item)
                })
            }) 
        }
        else{
            var num = req.query.limit % 10 != 0 ? console.error('Wrong number') : '';
            res.send(await stockList.find({}).limit(parseInt(req.query.limit,10)));
            // Uncomment to count total record in table
            // res.json(await stockList.count());
        }
    }
    catch(err){
        // console.error(err.message);
        res.status(500).json(err.message);
    }
});


// @route       POST api/home/getRealTimePrice/:symbol_list
// @desc        Get price by company symbol
// @access      Public 

router.post('/getRealTimePrice', async(req,res) =>{
    try{
        var list = req.body.list
        const link = `https://financialmodelingprep.com/api/v3/stock/real-time-price/${list}`;
        axios.get(link).then(response =>{
            res.send(response.data)
        }).catch(err =>{
            res.send(err.message)
        })
        
    }catch(err){
        res.send(err);
    }
})

// @route       DELETE api/home/deleteAll
// @desc        Delete All record in stock_list table
// @access      Private 
router.delete('/deleteAll', async(req,res) =>{
    try{
        var a = await stockList.remove({}); 
        res.json(a)
        
    }catch(err){
        res.send(err);
    }
})

// @route       GET api/home/searchStock?search="title"
// @desc        Search all record within the database
// @access      Public 
router.get('/searchStock', async (req, res) =>{ 

    try{
        var title = await stockList.find({name: {$regex:`.*${req.query.search}.*`}}).limit(10)

        if(title.length == false){
            res.status(500).send('Title not found');
        }
        // res.send(typeof req.query.user);
        if(req.query.user !== 'null' ){
            var model = new search({'user_id': req.query.user,'search': req.query.search, 'created': new Date().toISOString().slice(0, 19).replace('T', ' '),'note':''});
            model.save();
        }
        
        arr = {};
        for(let i = 0; i < title.length; i++){arr[title[i].symbol] = title[i]}

        var link = `https://financialmodelingprep.com/api/v3/stock/real-time-price/${getSymbol(title)}`;
        axios.get(link).then(response =>{
            var arr2 = response.data.companiesPriceList;
            for(let i = 0; i < arr2.length; i++){arr2[i].name =  arr[arr2[i].symbol].name}
            res.send(arr2);
        }).catch(err =>{
            res.send(err.message)
        })

    }catch(err){
        res.send(err.message)
    }
})

router.post('/companyProfile', async(req, res) =>{
    var link = `https://financialmodelingprep.com/api/v3/company/profile/${req.query.symbol}`;
    try{
        axios.get(link).then(response=>{ 
            res.send(response.data.profile)
        })
    }catch(err){
        res.status(500).send(err);
    }

})

// @route       DELETE api/home/deleteSearchHistory
// @desc        Delete all documents within search table 
// @access      Private 
router.delete('/deleteSearchHistory',async (req,res)=>{
    res.send(await search.find({}).remove())
})

router.post('/getSearchHistory',async (req,res)=>{
    res.send(await search.find({'user_id':req.query.id}));
})

router.delete('/deleteOne',async (req,res)=>{
    res.send(await search.findByIdAndDelete(req.query.id));
})
module.exports = router; 