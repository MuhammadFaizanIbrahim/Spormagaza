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
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/slider-images`);
                console.log(response.data); // Check if _id is included
                setSliderImages(response.data.slice(0, 3)); // Limit to 3 images
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
        <Container style={{ marginLeft: '260px', padding: '20px' }}>
            <Typography variant="h4">Kaydırıcı Görselleri</Typography>
            {message && <Alert severity={severity} style={{ margin: '20px 0' }}>{message}</Alert>}

            <Grid container spacing={3}>
                {Array.isArray(sliderImages) && sliderImages.map((image, index) => (
                    <Grid item xs={12} key={index}> {/* Full width for each image */}
                        <Typography variant="subtitle1"><b>Kaydırıcı {Math.floor(index / 3) + 1} Resim {index % 3 + 1}:</b></Typography>
                        <img
                            src={image.imageUrl}  // Use image.url to display the image
                            alt={`Slider ${Math.floor(index / 3) + 1} Image ${index % 3 + 1}`}
                            style={{ width: '100%', height: '450px', objectFit: 'cover', marginBottom: '10px' }}  // Set fixed height and width
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
