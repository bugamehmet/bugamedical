// db.js mongoose
const mongoose = require("mongoose");

async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("MONGODB_URI tanımlı değil!");
      process.exit(1);
    }

    await mongoose.connect(uri);

    console.log("✅ MongoDB bağlantısı başarılı");
  } catch (err) {
    console.error("❌ MongoDB bağlantı hatası:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
