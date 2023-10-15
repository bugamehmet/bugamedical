const express = require('express');
const app = express();

app.get('/', (req,res)=>{
  res.sendFile(__dirname + "index.html");
})
app.get('/about', (req,res)=>{
  res.sendFile(__dirname + "about.html")
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
