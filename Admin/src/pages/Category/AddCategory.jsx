import React, { useState } from 'react';
import { Container, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Use axios for handling file uploads

const AddCategory = () => {
    const navigate = useNavigate();
    const [formFields, setFormFields] = useState({
        name: '',
        color: ''
    });
    const [images, setImages] = useState([]);

    const changeInput = (e) => {
        setFormFields(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]); // Set selected files
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', formFields.name);
        formData.append('color', formFields.color);
        images.forEach((image, index) => {
            formData.append('images', image);
        });

        try {
            const response = await axios.post('http://localhost:4000/api/category/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            navigate('/categories'); // Redirect to categories page after adding category
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    return (
        <Container
            sx={{
                padding: '20px',
                marginLeft: '260px',
                marginTop: '0px', // No margin from top
                position: 'relative', // Ensure it's positioned relative to its parent
                minHeight: 'calc(100vh - 20px)', // Ensure it expands downwards
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box', // Includes padding in height calculations
                overflow: 'hidden' // Ensure no overflow issues
            }}
        >
            <Typography variant="h4">Kategori Ekle</Typography>
            <form style={{ marginTop: '20px' }} onSubmit={handleAddCategory}>
                <div style={{ marginBottom: '20px' }}>
                    <label>Kategori Adı:</label>
                    <input
                        type="text"
                        name="name"
                        onChange={changeInput}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>Resim URL:</label>
                    <input
                        type="file"
                        name="images"
                        multiple
                        onChange={handleImageChange}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                    />
                </div>
                <Button variant="contained" color="primary" type="submit">
                    Kategori Ekle
                </Button>
            </form>
        </Container>
    );
};

export default AddCategory;
