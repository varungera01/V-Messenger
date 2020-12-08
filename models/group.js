const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const groupSchema = new Schema({
   
    g_name : {
        type : String ,
        required : true
    },

    groupMates : {
        type : Array
    }
});

module.exports = mongoose.model('Group' , groupSchema);

    
