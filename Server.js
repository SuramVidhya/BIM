const express=require('express')
const app=express()
const bodyParser =require('body-parser')
const MongoClient=require('mongodb').MongoClient
var db;
var s;
MongoClient.connect('mongodb://localhost:27017/books',{ useUnifiedTopology: true }, (err,database)=>{
    if(err) return console.log(err)
    db=database.db('books')
    app.listen(5000,()=>{
        console.log('Listening to port number 5000')
    })
})
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))
app.get('/',(req,res)=>{
    var mysort={bid:1}
    db.collection("book").find().sort(mysort).toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('homepage.ejs',{data:result})
    })
})
app.get('/create',(req,res)=>{
    res.render('add.ejs')
})

app.get('/updatestock',(req,res)=>{
    res.render('update.ejs')
})

app.get('/deleteproduct',(req,res)=>{
    res.render('delete.ejs')
})
app.post('/AddData',(req,res)=>{
    const newItem={
        "bid": req.body.bid,
       "bname":req.body.bname,
       "author":req.body.author,
       "stock":req.body.stock,
       "sp":req.body.sp,
       "cp":req.body.cp
    }
    db.collection("book").insertOne(newItem
    ,(err,result)=>{
        if(err) return res.send(err)
        console.log(req.body.bid+" stock added")
        res.redirect('/')
    })
})
app.post('/update',(req,res)=>{
    db.collection("book").find().toArray((err,result)=>{
        if(err) return console.log(err)
        for(var i=0;i<result.length;i++){
            if(result[i].bid==req.body.bid){
                s=result[i].stock
                break
            }
        }
        db.collection("book").findOneAndUpdate({bid:req.body.bid},{
            $set:{stock:parseInt(s)+parseInt(req.body.stock)}},
            (err,result)=>{
                if(err) return res.send(err)
                console.log(req.body.bid+ ' stock updated')
                res.redirect('/')
            })
    })
})

app.post('/delete',(req,res)=>{
    db.collection("book").findOneAndDelete({bid:req.body.bid},(err,result)=>{
        if(err) return console.log(err)
        console.log(req.body.bid+" stock deleted")
        res.redirect('/')
    })
})