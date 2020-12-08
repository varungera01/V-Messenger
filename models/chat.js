const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema({

    user : {
      type :  Schema.Types.ObjectId
    },
    messages :[
        {
              receiver : {
                  type : String,
                         },
              inbox :  [
               {
                me  : {
                    type : String
                },
                receiver : {
                    type : String
                },
                createdAt : {
                    type : String
                }
               } 
            ]
         }
     ]
});

/*chatSchema.methods.addMessage = function(sms){

   this.messages.push(sms);
     return this.save();
};*/

chatSchema.methods.addReceiver = function(receiver) {
     
     const updatedMessages = [...this.messages];
     updatedMessages.push({
         receiver : receiver
     });

     this.messages = updatedMessages;
     return this.save();
}

chatSchema.methods.addMessage = function(msg , type , receiver , time){
   // console.log(user);
     console.log('xyz');
     
    
          const updateMessages  = [...this.messages];
         // const updateInbox = [...this.messages.inbox];
          const  box =  updateMessages.find((message)=>{
              return message.receiver === receiver;
          });
           const updateInbox  = [...box.inbox];
           //console.log(box);
           
           if(type=='me'){
           updateInbox.push({
               me : msg,
               createdAt : time
           });
        }
        if(type=='receiver'){
            updateInbox.push({
                receiver : msg,
                createdAt : time
            });
         }
           
           box.inbox = updateInbox;
        //   console.log(box);
           updateMessages.find((message)=>{
            if(message.receiver === receiver)
                 {
                    message.inbox = box.inbox;
                 }
             });
            this.messages  = updateMessages;
            return this.save();
        
}

    

module.exports = mongoose.model('Chat' ,chatSchema);




