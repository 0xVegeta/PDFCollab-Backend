const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    url: String,
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
    links: [String]
},
{ timestamps: true });

const File = mongoose.model('File', fileSchema);

module.exports = File

