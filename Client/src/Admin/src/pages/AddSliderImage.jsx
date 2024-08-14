import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Button, Alert } from '@mui/material';
import { postData } from '../utils/api';
import axios from 'axios';

const SliderImages = () => {
    const [sliderImages, setSliderImages] = useState([]);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    useEffect(() => {
        // Fetch existing slider images
        const fetchSliderImages = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/slider-images');
                console.log(response.data); // Check if _id is included
                setSliderImages(response.data);
            } catch (err) {
                setSeverity('error');
                setMessage('Failed to fetch slider images');
            }
        };

        fetchSliderImages();
    }, []);

    const handleFileChange = (e, index) => {
        const selectedFile = e.target.files[0];

        // Update the file for the specific image slot
        const updatedSliderImages = [...sliderImages];
        updatedSliderImages[index] = {
            ...updatedSliderImages[index],
            file: selectedFile,
        };

        setSliderImages(updatedSliderImages);
    };

    const handleUpdateSliderImage = async (index) => {
        const image = sliderImages[index];
        console.log('Image Data:', image); // Check if _id is present
    
        if (!image._id) {
            setSeverity('error');
            setMessage(`No ID found for slider image ${index + 1}`);
            return;
        }
    
        if (!image.file) {
            setSeverity('error');
            setMessage(`No file selected for slider image ${index + 1}`);
            return;
        }
    
        const formData = new FormData();
        formData.append('sliderImage', image.file);
    
        try {
            await postData(`/api/slider-images/update/${image._id}`, formData);
            setSeverity('success');
            setMessage(`Slider image ${index + 1} successfully updated`);
        } catch (err) {
            setSeverity('error');
            console.error(err);
            setMessage(`Failed to update slider image ${index + 1}`);
        }
    };

    return (
        <Container
            sx={{
                marginLeft: '260px',
                marginTop: '0px', // Set top margin to 0
                padding: '20px',
                minHeight: 'calc(100vh - 20px)', // Ensure it expands downwards
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box', // Includes padding in height calculations
                overflow: 'hidden' // Ensure no overflow issues
            }}
        >
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>Kaydırıcı Görselleri</Typography>
            {message && <Alert severity={severity} sx={{ margin: '20px 0' }}>{message}</Alert>}

            <Grid container spacing={3}>
                {Array.isArray(sliderImages) && sliderImages.map((image, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Typography variant="subtitle1"><b>Kaydırıcı {Math.floor(index / 3) + 1} Resim {index % 3 + 1}:</b></Typography>
                        <img
                            src={image.imageUrl}
                            alt={`Slider ${Math.floor(index / 3) + 1} Image ${index % 3 + 1}`}
                            style={{ width: '100%', height: '450px', objectFit: 'cover', marginBottom: '10px' }}
                        />
                        <input
                            type="file"
                            onChange={(e) => handleFileChange(e, index)}
                            style={{ marginBottom: '10px' }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleUpdateSliderImage(index)}
                        >
                            Resmi Güncelle
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default SliderImages;
