const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
      
    phoneNo : {
        type : String,
        required : true
    },

        UserId : {
         type : Schema.Types.ObjectId,
         ref : 'User',
         required : true
    }
    

});

module.exports = mongoose.model('Account' , accountSchema);