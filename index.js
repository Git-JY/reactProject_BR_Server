const express = require('express');
const cors = require('cors'); //npm i cors //cors 에러 막기위해 설치
const fs = require('fs'); //이미 express에 있던 거라 다운 안해도 됨
const bodyParser = require('body-parser');
const app = express(); //웬만하면 모듈(cors, fs, bodyParser)받고 쓰기(모듈 받기 전에 쓴다고 오류생기는 건 또 아님)

const axios = require('axios');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // form에서 action속성으로 넘어온 body(post의 그 body)내용을 얻기 위함(false는 원래 써줘야 함)
app.use(bodyParser.json()); // body에 있는 json객체를 넘어오기 위함

const searchDb = axios.create({
    baseURL:'https://openapi.naver.com/v1/search', /* https://openapi.naver.com/v1/search */
    headers: {
        'X-Naver-Client-Id': 'vqGzligp1x3dDwrWaOEQ', // 클라이언트 아이디
        'X-Naver-Client-Secret': 'oweJmF7ryP' // 클라이언트 시크릿
    }
})//searchDb //axios.create

//title
app.get('/book', async function(req, res){
     let {query, display, start} = req.query;
     let db = await searchDb.get('/book.json',{
        params:{query,display,start}
     })
     
    res.send(db.data);
})

//all
app.get('/book_adv', async function(req, res){
    let {d_titl, display, start} = req.query;
    let db = await searchDb.get('/book_adv.json', {
        params: {d_titl, display, start}
    })

    res.send(db.data);
})

//detail
app.get('/book_detail', async function(req, res){
    console.log(req.query);
    let {d_isbn} = req.query;

    let db = await searchDb.get('/book_adv.json', {params: {d_isbn}});

    res.send(db.data); 
})

app.get('/blog', async function(req, res){
    let {query} = req.query;
    let db = await searchDb.get('/blog.json', {params: {'query': `${query} 책 리뷰`, 'display': 7}});
    
    res.send( db.data );
})

app.listen(3000);