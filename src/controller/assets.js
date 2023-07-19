const cloudinary = require('cloudinary').v2
const File = require('../models/assets')
const User = require("../models/user")
const Comment =  require('../models/comment')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadPDF = async(req, res)=>{
    // Check if a file was provided in the request
    try {
        if (!req.file) {
            return res.status(400).json({error: 'No file provided'});
        }
        const pdfFile = await File.create({
            url: req.file.path, // Cloudinary URL
            fileName: req.file.originalname,
            owner: req.user._id,
            viewAccess: [],
            commentAccess: [],
            links: []
        })

        await User.findByIdAndUpdate(req.user._id, { $push: { pdfFiles: pdfFile._id } });

        res.status(200).json({success: 'File uploaded successfully', fileData: req.file});
    }catch (err) {
        console.log("error", err.stack)
        res.status(500).json({errorMsg:"Something went wrong", error: err})
    }
}

const fetchAllPDFs = async(req, res)=>{
    try {

        const pdfFiles = await File.find({ owner: req.user._id });

        if (!pdfFiles) {
            return res.status(404).json({ error: 'No files found for the user' });
        }
        res.status(200).json({pdfFiles});

    } catch (error) {
        console.error('Error fetching files', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
}

const viewPDF = async(req, res)=>{
    try {
        const {fileId} = req.params
        const userId = req.user._id
        // Find the file by ID and populate the 'owner' and 'viewAccess' fields
        const file = await File.findById(fileId)
            .populate('owner')
            .populate('viewAccess')
            .populate('commentAccess')

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Check if the user is the owner or has view access
        if (file.owner._id.toString() === userId.toString() || file.viewAccess.some(user => user._id.toString() === userId.toString())) {
            return res.status(200).json({ file });
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

const provideAccess = async(req,res)=>{
    try{
        const {fileId} = req.params
        const userId = req.user._id
        const {provideViewAccess, provideCommentAccess} = req.body
        // Find the file by ID and populate the 'owner' and 'viewAccess' fields
        const file = await File.findById(fileId)

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Check if the user is the owner or has view access
        if (file.owner.toString() === userId) {
            if (provideViewAccess) {
                file.viewAccess.push(userId);
            }

            // Provide comment access if requested
            if (provideCommentAccess) {
                file.commentAccess.push(userId);
            }

            // Save the updated file
            await file.save();

            return res.status(200).json({ message: 'Access granted' });
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    }catch (err) {

    }
}

const addComment = async(req, res)=>{
    try {

        const {fileId} = req.params
        const userId = req.user._id
        const {commentBody} = req.body
        console.log()
        // Find the file by ID and populate the 'owner' and 'viewAccess' fields
        const file = await File.findById(fileId)
            .populate('owner', '_id')
            .populate('commentAccess', '_id');

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Check if the user is the owner or has view access
        if (file.owner._id.toString() === userId.toString() || file.commentAccess.some(user => user._id.toString() === userId.toString())) {
            const comment = new Comment()
            comment.body = commentBody
            comment.author = userId
            file.comments.push(comment)
            await comment.save()
            await file.save()
            return res.status(200).json({message: "Comment added"})
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        console.error(error, error.stack);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

const viewAllComment = async(req,res)=>{
    try {
        const {fileId} = req.params

        const file = await File.findById(fileId).populate('comments');

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        const comments = file.comments;

        const commentResults = [];

        for (const comment of comments) {
            const populatedComment = await comment.populate('author')
            const authorEmail = populatedComment.author.email
            const authorName = populatedComment.author.name
            const commentBody = populatedComment.body
            const commentId = populatedComment._id
            commentResults.push({ authorEmail, authorName, commentBody })
        }

        res.status(200).json({commentResults});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports= {
    uploadPDF, fetchAllPDFs, viewPDF, provideAccess, addComment, viewAllComment
}