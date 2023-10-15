// Gerekli Kütüphaneleri kurduk
// express-mysql-ejs-nodemon-dotenv-twilio-winston
//server kurulumu

const express = require('express');

const app = express();

app.use('/assets', express.static('assets')); 

app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res)=>{
  res.sendFile(__dirname + "/viewsindex.html");
})
app.get('/about', (req,res)=>{
  res.sendFile(__dirname + "/about.html")
})
app.get('/wht-bugamed', (req,res)=>{
  res.sendFile(__dirname + 'why-bugamed.html')
})
app.get('contactus', (req,res)=>{
  res.sendFile(__dirname + 'contactus.html')
})
app.get('parts-catalog', (req, res)=>{
  res.sendFile(__dirname + 'parts-catalog.html')
})

app.listen(5001, ()=>{
  console.log('Server http://localhost:5001 adresinde başladı');
})