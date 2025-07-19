/*
const config = {
	db: {
		host: 'localhost',
		user: 'root',
		password: '12345678',
		database: 'bugaMed',
	},
};
*/
const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : process.env.DB_HOST,     // Render'dan gelecek
    user     : process.env.DB_USER,     // Render'dan gelecek
    password : process.env.DB_PASSWORD, // Render'dan gelecek
    database : process.env.DB_NAME,     // Render'dan gelecek
    port     : process.env.DB_PORT      // Render'dan gelecek
});
module.exports = connection;

connection.connect((err) => {
    if (err) {
        console.error('Veritabanına bağlanırken hata oluştu: ' + err.stack);
        return;
    }
    console.log('Veritabanına başarıyla bağlandı id: ' + connection.threadId);
});