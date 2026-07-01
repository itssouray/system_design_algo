const dotenv = require("dotenv");

dotenv.config();


const connect = require("./src/config/db");
const app = require("./src/app");
const { connectRedis } = require('./src/config/redis');



connect();
connectRedis();
PORT = process.env.PORT

app.listen(PORT,()=>{
     console.log(`Server is listining to port ${PORT}`);
})