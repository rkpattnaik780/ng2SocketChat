var mongoose = require("mongoose");
var Schema = mongoose.Schema ;

var chatSchema = new Schema({
  name : { type : String ,
           required : true},
  msg : { type : String ,
          required : true},
  versionKey: false
});

module.exports = mongoose.model("chat" , chatSchema);