const express = require('express');
const app = express();
const connection = require('./db');
const { error } = require('winston');
app.use('/assets', express.static('assets')); 

app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));


/*
const parts_query = 'SELECT products.product_name, parts.part_name FROM products INNER JOIN parts ON products.product_id = parts.product_id'

connection.query(parts_query, (err, parts)=>{
  if(err){throw err}
  console.log(parts)
})
*/






app.listen(5001, ()=>{
  console.log('Server http://localhost:5001 adresinde başladı');
})