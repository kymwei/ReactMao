var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/demoDB');
// create instance of Schema
var mongoSchema =   mongoose.Schema;
// create schema
var userSchema  = {
    "food" : String,
    "stars" : String,
    "userPassword":String,
    "addedDate": [Date]
};
// create model if not exists.
module.exports = mongoose.model('userLogin',userSchema);
