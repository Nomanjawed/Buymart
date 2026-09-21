// const dotenv = require('dotenv');
// const mongoose = require("mongoose")
// dotenv.config()


// const connectDB = async () => {
//   try {
// // mongodb+srv://noman6501_db_user:UXbcaTRf3dFSZvrF@cluster0.q1xpli7.mongodb.net/
//     // console.log(process.env.MONGO_URI);
    
//     const connectionInstance = await mongoose.connect(
//       process.env.MONGO_URI
//     );
//     console.log(
//       `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
//     );
//   } catch (error) {
//     console.log("MONGODB connection FAILED ", error);
//     process.exit(1);
//   }
// };

// module.exports = { connectDB };




const dotenv = require("dotenv");
const mongoose = require("mongoose");
const dns = require("node:dns");



dotenv.config();
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED", error);
    process.exit(1);
  }
};

module.exports = { connectDB };