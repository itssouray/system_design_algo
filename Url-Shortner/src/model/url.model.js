const mongoose = require("mongoose");


const urlSchema = new mongoose.Schema({
     shortCode:{
          type:String,
          require:true,
          unique:true
     },
     longUrl:{
          type:String,
          require:true,
     },
     createdAt:{
          type:Date,
          default:Date.now
     }
});

module.exports = mongoose.model('Url',urlSchema);