const express = require('express');
const router = express.Router();
const upLoadController = require('../controllers/upload');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const config = require('../config/config');

const storage = new GridFsStorage({
    url: config.connection,
    file: (req, file) => {
        if (file.mimetype === 'image/jpeg') {
            return {
                bucketName: 'photos',
                filename: file.originalname
            };
        }
        else {
            return null;
        }
    }
});

const upload = multer({ storage });



/* upload route. */
router.post('/', upload.single('file'), upLoadController.upload);


module.exports = router;
