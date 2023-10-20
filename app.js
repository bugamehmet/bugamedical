const express = require('express');
const connection = require('./db');
const app = express();
const port = 5001
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





app.listen(port, (error)=>{
  if(error){throw error};
  console.log(`Server http://localhost:${port} adresinde başladı`);
})