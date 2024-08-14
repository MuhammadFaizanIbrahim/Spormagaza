import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Button, Alert } from '@mui/material';
import { postData } from '../utils/api';
import axios from 'axios';

const LogoImages = () => {
    const [logoImages, setLogoImages] = useState([]);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    useEffect(() => {
        // Fetch existing logo images
        const fetchLogoImages = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/logo-images`);
                setLogoImages(response.data);
            } catch (err) {
                setSeverity('error');
                setMessage('Failed to fetch logo images');
            }
        };

        fetchLogoImages();
    }, []);

    const handleFileChange = (e, index) => {
        const selectedFile = e.target.files[0];

        // Update the file for the specific logo image
        const updatedLogoImages = [...logoImages];
        updatedLogoImages[index] = {
            ...updatedLogoImages[index],
            file: selectedFile,
        };

        setLogoImages(updatedLogoImages);
    };

    const handleUpdateLogoImage = async (index) => {
        const image = logoImages[index];

        if (!image._id) {
            setSeverity('error');
            setMessage(`No ID found for logo image ${index + 1}`);
            return;
        }

        if (!image.file) {
            setSeverity('error');
            setMessage(`No file selected for logo image ${index + 1}`);
            return;
        }

        const formData = new FormData();
        formData.append('logoImage', image.file);

        try {
            await postData(`/api/logo-images/update/${image._id}`, formData);
            setSeverity('success');
            setMessage(`Logo image ${index + 1} successfully updated`);
        } catch (err) {
            setSeverity('error');
            console.error(err);
            setMessage(`Failed to update logo image ${index + 1}`);
        }
    };

    return (
        <Container style={{ marginLeft: '260px', padding: '20px' }}>
            <Typography variant="h4">Logo Görselleri</Typography>
            {message && <Alert severity={severity} style={{ margin: '20px 0' }}>{message}</Alert>}

            <Grid container spacing={3}>
                {Array.isArray(logoImages) && logoImages.map((image, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Typography variant="subtitle1"><b>Logo {index + 1}:</b></Typography>
                        <img
                            src={image.imageUrl}
                            alt={`Logo ${index + 1}`}
                            style={{ width: '100%', height: 'auto', objectFit: 'cover', marginBottom: '10px' }}
                        />
                        <input
                            type="file"
                            onChange={(e) => handleFileChange(e, index)}
                            style={{ marginBottom: '10px' }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleUpdateLogoImage(index)}
                        >
                            Logoyu Güncelle
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default LogoImages;
