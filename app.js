const express = require('express');
const app = express();

app.use('/assets', express.static('assets')); 

app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));


app.listen(5001, ()=>{
  console.log('Server http://localhost:5001 adresinde başladı');
})