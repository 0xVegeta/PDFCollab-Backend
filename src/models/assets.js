const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    url: { type: String, required: true, unique: true},
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fileName:{ type: String, required: true, unique: false },
    viewAccess: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    commentAccess: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    links: [String]
},
{ timestamps: true });

const File = mongoose.model('File', fileSchema);

module.exports = File

