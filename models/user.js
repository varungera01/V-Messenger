const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({

    
    name : {
        type : String ,
        required : true
    },

    gender : {
        type : String ,
        required : true
   },

   image : {
       type : String ,
       required : true
   },

   status : {
       type : String,
       required : true
   },

        phoneNo : {
         type : Number ,
         required : true
    },
        password : {
            type : String,
            required : true
        },

      contacts : {

             friends : [
                 {
                userId:  {
                  type :  Schema.Types.ObjectId,
                  ref : 'User',
                  required : true
                  },

                  phoneNum : {
                     type : Number,
                      required : true
                 },
                 friendName : {
                     type : String,
                     
                 },
                 avatar : {
                    type : String,
                 }
               }
         ]
    },

    groups : 
              [
               {
                     gname : {
                         type : String ,
                            },
                     members :  
                     {
                       type : Array
                      } ,

                    groupId : {
                    type :  Schema.Types.ObjectId,
                         }
                  
             }

             ]
    
     
        });


userSchema.methods.setImage = function(image) {
    this.image = image;
    return this.save();
}


userSchema.methods.updateBio =  function(bio) {
    this.status = bio;
    return this.save();
}

userSchema.methods.createGroup = function(group, id ){
     const updatedGroups = [...this.groups];
     console.log(id);
     
     updatedGroups.push({
        gname :  group.group_name,
        members :  group.group,
        groupId : id
     });
    this.groups = updatedGroups;
    return this.save();
}

userSchema.methods.addFriend = function(user){

    const updatedContactsList = [...this.contacts.friends];
     updatedContactsList.push({
        userId : user._id,
        phoneNum : user.phoneNo,
        friendName : user.name,
        avatar : user.image
    });

    const updatedContacts = {
        friends : updatedContactsList
    };

    this.contacts = updatedContacts;
    return this.save();
};



/*userSchema.methods.changePhone = function(user)
  {
      const updatePhone = user.phoneNo;
        this.phoneNo = updatePhone;

        return this.save();
  }*/


module.exports = mongoose.model('User' , userSchema);


