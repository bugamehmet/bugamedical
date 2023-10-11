// Gerekli Kütüphaneleri kurduk
// express-mysql-ejs-nodemon-dotenv-twilio-winston
//server kurulumu

const express = require('express');

const app = express();

app.use('/assets', express.static('assets')); 

app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res)=>{
  res.sendFile(__dirname + "/index.html");
})

app.listen(3001, ()=>{
  console.log('Server http://localhost:5001 adresinde başladı');
})