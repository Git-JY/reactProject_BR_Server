const express = require('express');
const cors = require('cors'); //npm i cors //cors 에러 막기위해 설치
const fs = require('fs'); //이미 express에 있던 거라 다운 안해도 됨
const bodyParser = require('body-parser');

const { MongoClient } = require('mongodb'); //portfolio1 내용
const app = express(); //웬만하면 모듈(cors, fs, bodyParser)받고 쓰기(모듈 받기 전에 쓴다고 오류생기는 건 또 아님)

const axios = require('axios');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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















//카카오로 구현한 로그인
app.get('/kakaoLoginObjs', function (req, res) {
    const jsonData = JSON.parse(fs.readFileSync('./db/kakaoLoginObj.json')); //fs.readFileSync => 동기함수(gpt가 그렇게 알려줌)
    console.log('req.query', req.query);
    const {id, nickname} = req.query; 
    let firstLogin = true;

    jsonData.map((obj) => {
        if(obj.id == id){firstLogin = false}
    });

    if(!firstLogin){//로그인 한 적이 있는 경우
        const obj = jsonData.filter(obj => obj.id == id)[0];
        console.log("ddd1",obj);
        res.send( obj );

    }else{//처음 로그인 하는 경우
        let obj = {
            "id": id,
            "nickname": nickname.slice(0, 8),
            "bookList": []
        }
        console.log("ddd2",obj);
        let data = [...jsonData, obj];
        fs.writeFileSync('./db/kakaoLoginObj.json', JSON.stringify(data)   );

        res.send( obj );
    }
})





//로그인 객체 저장
app.post('/kakaoLoginObjs',  function (req, res) {
    console.log("바디",req.body);
    const jsonData = JSON.parse( fs.readFileSync('./db/kakaoLoginObj.json') );
    console.log("jsonData",jsonData);
    let firstLogin = true;

    jsonData.map((obj)=>{
        if(obj.id == req.body.id) {firstLogin = false};
    })
    
    if(!firstLogin){//로그인 한 적이 있는 경우
        let data = jsonData.map((obj)=>{
            if(obj.id == req.body.id){
                obj.nickname = req.body.nickname;
                obj.bookList = req.body.bookList;
            }
            return obj;
        })
        fs.writeFileSync('./db/kakaoLoginObj.json', JSON.stringify(data)   );
        
    }else{//처음 로그인 하는 경우
        let data = [...jsonData, req.body]
        fs.writeFileSync('./db/kakaoLoginObj.json', JSON.stringify(data)   );
    }
    
    res.send('성공');
})
// app.listen(3000); //3000
//========== ========== ========== ========== ========== ↓ (포트폴리오(우주컨셉-react) cloudtype이 용량 한계라서 함께 씀)

// app.use(express.static('build')); 

const mongoDB_url = "mongodb+srv://tlatlago824:ljJlxOITgoeMzeX3@cluster0.qkekbll.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(mongoDB_url);

let collection;

const dbConnect = async () => {
    await client.connect();
    const db = client.db('employmentDB');
    collection = db.collection('contactMsg');

    console.log('접속성공!');
}//dbConnect() 함수정의

app.post('/portfolio1', async function (req, res) {
    console.log(req.body)
    const {title, msg, date} = req.body;

    await collection.insertOne({'key': Number(new Date()), title, msg, 'time': date}); // 값 넣기 

    res.send('성공!');
});

app.listen(3000, dbConnect); 