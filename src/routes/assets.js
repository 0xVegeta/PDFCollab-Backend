const express = require('express');
const assetsRouter = express.Router();
const assetsControllers = require('../controller/assets');
const {protect} = require('../middlewares/authentication')

const Multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'pdf_uploads',
        allowed_formats: ['pdf'],
        transformation: [{ format: 'pdf' }] // Add this line to remove transformations
    }
});

const upload = Multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 // 50KB file size limit
    }
});
assetsRouter.post('/pdf/upload/' ,protect , upload.single('pdf') ,assetsControllers.uploadPDF)
assetsRouter.get('/pdf/fetchAll',protect, assetsControllers.fetchAllPDFs)
assetsRouter.post('/pdf/:fileId/view', protect, assetsControllers.viewPDF)
assetsRouter.post('/pdf/:fileId/access', protect,assetsControllers.provideAccess)
assetsRouter.post('/pdf/:fileId/comment/', protect, assetsControllers.addComment)
assetsRouter.get('/pdf/:fileId/comment/', protect,assetsControllers.viewAllComment)


module.exports = assetsRouter;