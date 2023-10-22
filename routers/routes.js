const express = require('express');
app.use(express.static('views'));
const router = express.Router();
const path = require('path');
const app = express();

app.get('/', (req,res)=>{
  res.sendFile(__dirname + "index.html");
})
app.get('/about', (req,res)=>{
  res.sendFile(path.join(__dirname, '/views/about.html'));
})
app.get('/why-bugamed', (req,res)=>{
  res.sendFile(__dirname + 'why-bugamed.html')
})
app.get('contactus', (req,res)=>{
  res.sendFile(__dirname + 'contactus.html')
})
app.get('parts-catalog', (req, res)=>{
  res.sendFile(__dirname + 'parts-catalog.html')
})

module.exports = router;