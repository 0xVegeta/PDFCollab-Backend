const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
        body :{ type: String, required: true},
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    },
    { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment

