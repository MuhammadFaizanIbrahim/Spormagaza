import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Button, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { postData, deleteData } from '../utils/api'; // Assuming deleteData is similar to your Categories component
import axios from 'axios';

const SliderImages = () => {
    const [sliderImages, setSliderImages] = useState([]);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState(null);

    useEffect(() => {
        // Fetch existing slider images
        const fetchSliderImages = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/slider-images`);
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
        const updatedSliderImages = [...sliderImages];
        updatedSliderImages[index] = {
            ...updatedSliderImages[index],
            file: selectedFile,
        };
        setSliderImages(updatedSliderImages);
    };

    const handleUpdateSliderImage = async (index) => {
        const image = sliderImages[index];
        if (!image._id || !image.file) {
            setSeverity('error');
            setMessage(`No file selected or ID found for slider image ${index + 1}`);
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
            setMessage(`Failed to update slider image ${index + 1}`);
        }
    };

    const handleAddSliderImage = () => {
        const newImage = { file: null }; // Placeholder for new image
        setSliderImages([...sliderImages, newImage]);
    };

    const handleDeleteClick = (id) => {
        setSelectedImageId(id);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteData(`/api/slider-images/${selectedImageId}`);
            setSliderImages(sliderImages.filter(item => item._id !== selectedImageId));
            setSeverity('success');
            setMessage('Slider image successfully deleted');
            setOpenDialog(false);
        } catch (err) {
            setSeverity('error');
            setMessage('Failed to delete slider image');
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedImageId(null);
    };

    const handleSaveNewImage = async (index) => {
        const image = sliderImages[index];
        if (!image.file) {
            setSeverity('error');
            setMessage('No file selected');
            return;
        }
    
        const formData = new FormData();
        formData.append('sliderImages', image.file);
    
        try {
            const response = await postData(`/api/slider-images/create`, formData);
    
            // Log the response to verify its structure
            console.log('API Response:', response);
    
            // Check for expected properties in the response
            if (!response || !Array.isArray(response.sliderImages)) {
                throw new Error('Unexpected response format');
            }
    
            const newImage = response.sliderImages[0]; // Ensure this is the correct format
            const updatedSliderImages = [...sliderImages];
            updatedSliderImages[index] = newImage;
            setSliderImages(updatedSliderImages);
            setSeverity('success');
            setMessage('Slider image successfully added');
        } catch (err) {
            console.error('Error details:', err.message); // Log the error message
            setSeverity('error');
            setMessage('Slider image successfully added');
        }
    };
    
    
    
    

    return (
        <Container style={{ marginLeft: '260px', padding: '20px' }}>
            <Typography variant="h4">Kaydırıcı Görselleri</Typography>
            {message && <Alert severity={severity} style={{ margin: '20px 0' }}>{message}</Alert>}

            <Grid container spacing={3}>
                {Array.isArray(sliderImages) && sliderImages.map((image, index) => (
                    <Grid item xs={12} key={index}>
                        <Typography variant="subtitle1"><b>Kaydırıcı Resmi: {index + 1}</b></Typography>
                        {image.imageUrl && (
                            <img
                                src={image.imageUrl}
                                alt={`Slider ${Math.floor(index / 3) + 1} Image ${index % 3 + 1}`}
                                style={{ width: '100%', height: '450px', objectFit: 'cover', marginBottom: '10px' }}
                            />
                        )}
                        <input
                            type="file"
                            onChange={(e) => handleFileChange(e, index)}
                            style={{ marginBottom: '10px' }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={image._id ? () => handleUpdateSliderImage(index) : () => handleSaveNewImage(index)}
                            style={{ marginRight: '10px' }}
                        >
                            {image._id ? 'Resmi Güncelle' : 'Resmi Kaydet'}
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteClick(image._id)}
                        >
                            Silmek
                        </Button>
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddSliderImage}
                    >
                        Yeni Resim Ekle
                    </Button>
                </Grid>
            </Grid>

            <Dialog
                open={openDialog}
                onClose={handleCancelDelete}
            >
                <DialogTitle>Slider Resmini Sil</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bu slider resmini silmek istediğinizden emin misiniz?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Hayır
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Evet
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SliderImages;
