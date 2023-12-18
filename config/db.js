const monngoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    await monngoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected to Database ${monngoose.connection.host}`.bgCyan.white
    );
  } catch (error) {
    console.log(`Error in DB ${error}`.bgRed.white);
  }
};

module.exports = connectDB;
