const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const SliderImage = require('../models/SliderImages');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
});

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// @route   GET /api/slider-images
// @desc    Get all slider images
// @access  Public
router.get('/', async (req, res) => {
  try {
    const images = await SliderImage.find(); // This should include _id by default
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/slider-images/create
// @desc    Add new images to the slider
// @access  Private
router.post('/create', upload.array('sliderImages', 10), async (req, res) => {
    try {
        const files = req.files || [];

        if (files.length === 0) {
            return res.status(400).send("No images provided!");
        }

        const { default: pLimit } = await import('p-limit');
        const limit = pLimit(2);

        const imagesToUpload = files.map((file) => {
            return limit(async () => {
                const result = await cloudinary.uploader.upload(file.path);
                return {
                    imageUrl: result.secure_url,
                    filename: file.filename
                };
            });
        });

        const uploadedImages = await Promise.all(imagesToUpload);

        // Save sliderImages information to your database
        const newImages = await SliderImage.insertMany(uploadedImages);

        res.status(201).json({ message: 'Slider images uploaded successfully', sliderImages: newImages });
    } catch (error) {
        console.error('Error uploading slider images:', error);
        res.status(500).json({ message: 'Failed to upload slider images' });
    }
});

// @route   DELETE /api/slider-images/:id
// @desc    Delete an image from the slider
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const image = await SliderImage.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Delete the image from Cloudinary
        const publicId = path.basename(image.imageUrl).split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        // Delete the file from the server
        fs.unlink(path.join(__dirname, '..', image.imageUrl), async (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ message: 'Failed to delete image file' });
            }

            // Remove the image record from the database
            await image.remove();
            res.json({ message: 'Image removed' });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// @route   POST /api/slider-images/update/:id
// @desc    Update an existing image in the slider
// @access  Private
// @route   POST /api/slider-images/update/:id
// @desc    Update an existing image in the slider
// @access  Private
router.post('/update/:id', upload.single('sliderImage'), async (req, res) => {
  try {
    const image = await SliderImage.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    if (req.file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      
      // Update image URL in database
      image.imageUrl = result.secure_url;
      
      // Save changes to database
      await image.save();
      
      // Optionally delete the local file
      fs.unlinkSync(req.file.path);
      
      res.json({ message: 'Image updated successfully', image: image });
    } else {
      res.status(400).json({ message: 'No file uploaded' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





module.exports = router;
