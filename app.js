const express = require('express');
const app = express();
const connection = require('./db');
const { error } = require('winston');
app.use('/assets', express.static('assets')); 

app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));


connection.query('SELECT model_name FROM models', (err, data)=>{
  if(err){throw err}
  console.log(data)
})





app.listen(5001, ()=>{
  console.log('Server http://localhost:5001 adresinde başladı');
})