const mongoose = require('mongoose');
const Schema = mongoose.Schema

const activitySchema = new Schema ({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 30
    },
    description: {
        type: String,
        required: true,
        maxlength: 150
    },
    date: {
        required: true,
        type:String
    },
    location: {
        type: String,
        required: true
    },

    creator: {
        type:  mongoose.Types.ObjectId, ref:'User', 
        required: true
    },

})
module.exports= mongoose.model('Activity', activitySchema)