const express = require('express');
const router = express.Router();
const Info = require('../models/Info'); // Adjust the path as necessary

// Route to add new information
router.post('/add', async (req, res) => {
  try {
    const { ibanNumber, phoneNumber1, phoneNumber2, address, email, delivery } = req.body;

    // Check if an entry with the same IBAN or email already exists
    const existingInfo = await Info.findOne({ $or: [{ ibanNumber }, { email }] });
    if (existingInfo) {
      return res.status(400).json({ message: 'IBAN number or email already exists' });
    }

    const newInfo = new Info({ ibanNumber, phoneNumber1, phoneNumber2, address, email, delivery });
    await newInfo.save();
    res.status(201).json(newInfo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Route to update information
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ibanNumber, phoneNumber1, phoneNumber2, address, email, delivery } = req.body;

    const updatedInfo = await Info.findByIdAndUpdate(
      id,
      { ibanNumber, phoneNumber1, phoneNumber2, address, email, delivery },
      { new: true, runValidators: true }
    );

    if (!updatedInfo) {
      return res.status(404).json({ message: 'Information not found' });
    }

    res.status(200).json(updatedInfo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/', async (req, res) => {
    try {
      // Fetch the first document (since there should only be one set of information)
      const info = await Info.findOne();
  
      if (!info) {
        return res.status(404).json({ message: 'Information not found' });
      }
  
      res.status(200).json(info);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });

module.exports = router;
