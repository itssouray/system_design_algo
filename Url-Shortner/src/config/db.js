const mongoose = require("mongoose");

const connect = async ()=>{
     try{
          await mongoose.connect(process.env.MONGO_URL);
          console.log('MongoDB connected');
     }catch(err){
          console.log(err.message);
          return err;
     }
};

module.exports = connect;