<<<<<<< HEAD
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

module.exports = connection;
=======
const mysql = require('mysql');

// NODE_ENV değişkenini kontrol ederek ortamı belirle
if (process.env.NODE_ENV === 'production') {
    // Üretim ortamında (Render gibi) gerçek veritabanı bağlantısını kur
    connection = mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME,
        port     : process.env.DB_PORT || 3306
    });

    connection.connect((err) => {
        if (err) {
            console.error('VERİTABANI HATASI: Üretim ortamında veritabanına bağlanılamadı!', err.stack);
            // Uygulamanın burada çökmemesi için daha nazik bir çıkış veya hata işleme yapılabilir.
            // Örneğin: process.exit(1); ancak bu uygulamanın tamamen kapanmasına neden olur.
            // Genellikle veritabanı bağlantısı kritikse, uygulama burada durabilir.
            // Ya da hata yakalanıp kullanıcıya dostça bir mesaj gösterilebilir.
        } else {
            console.log('Veritabanına başarıyla bağlandı (Üretim Ortamı): ' + connection.threadId);
        }
    });}
module.exports = connection;
>>>>>>> 3ddfa4be1b2ad4c47f2fbfd01cb56522478643ea
