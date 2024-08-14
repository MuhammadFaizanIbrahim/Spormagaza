const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const LogoImage = require('../models/LogoImage');
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

// @route   GET /api/logo-images
// @desc    Get all logo images
// @access  Public
router.get('/', async (req, res) => {
  try {
    const logos = await LogoImage.find();
    res.json(logos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/logo-images/create
// @desc    Add new logo
// @access  Private
router.post('/create', upload.single('logoImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No logo image provided!");
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        const newLogo = new LogoImage({
            imageUrl: result.secure_url,
        });

        await newLogo.save();
        
        // Optionally delete the local file
        fs.unlinkSync(req.file.path);

        res.status(201).json({ message: 'Logo uploaded successfully', logoImage: newLogo });
    } catch (error) {
        console.error('Error uploading logo image:', error);
        res.status(500).json({ message: 'Failed to upload logo image' });
    }
});

// @route   POST /api/logo-images/update/:id
// @desc    Update an existing logo
// @access  Private
router.post('/update/:id', upload.single('logoImage'), async (req, res) => {
  try {
    const logo = await LogoImage.findById(req.params.id);
    if (!logo) return res.status(404).json({ message: 'Logo not found' });

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);

      logo.imageUrl = result.secure_url;

      await logo.save();

      fs.unlinkSync(req.file.path);

      res.json({ message: 'Logo updated successfully', logoImage: logo });
    } else {
      res.status(400).json({ message: 'No file uploaded' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/logo-images/:id
// @desc    Delete a logo image
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const logo = await LogoImage.findById(req.params.id);

    if (!logo) {
      return res.status(404).json({ message: 'Logo not found' });
    }

    const publicId = path.basename(logo.imageUrl).split('.')[0];
    await cloudinary.uploader.destroy(publicId);

    await logo.remove();
    res.json({ message: 'Logo removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
