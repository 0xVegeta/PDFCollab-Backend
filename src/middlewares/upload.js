const Multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

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

module.exports={
    upload
}