import mongoose from 'mongoose';


const notesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tags: {
        type: String,
        default: "General"
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('notes', notesSchema);