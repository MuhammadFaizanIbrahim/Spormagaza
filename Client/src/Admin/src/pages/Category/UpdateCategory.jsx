import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { fetchDataFromApi, editData } from '../../utils/api';

const UpdateCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categoryName, setCategoryName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [color, setColor] = useState('');
    const [images, setImages] = useState([]);
    const [file, setFile] = useState(null);

    useEffect(() => {
        // Fetch category by id logic
        fetchDataFromApi(`/api/category/${id}`).then((res) => {
            setCategoryName(res.name);
            setImageUrl(res.images[0]);
            setColor(res.color);
            setImages(res.images);
        }).catch(err => {
            console.error('Error fetching category:', err);
        });
    }, [id]);

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', categoryName);
        formData.append('color', color);
        if (file) {
            formData.append('images', file);
        } else {
            images.forEach(img => formData.append('images', img));
        }

        try {
            await editData(`/api/category/${id}`, formData, 'PUT');
            console.log('Category updated');
            navigate('/dashboard/categories'); // Redirect to categories page after update
        } catch (err) {
            console.error('Error updating category:', err);
        }
    };

    return (
        <Container
            sx={{
                padding: '20px',
                marginLeft: '260px',
                marginTop: '0px',
                position: 'relative',
                minHeight: 'calc(100vh - 20px)',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}
        >
            <Typography variant="h4">Kategoriyi Güncelle</Typography>
            <form style={{ marginTop: '20px' }} onSubmit={handleUpdateCategory}>
                <TextField
                    label="Kategori Adı"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    fullWidth
                    style={{ marginBottom: '20px' }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}
                >
                    <TextField
                        label="Resim URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        fullWidth
                        style={{ marginRight: '20px' }}
                    />
                    {imageUrl && (
                        <Box
                            component="img"
                            src={imageUrl}
                            alt="Category"
                            sx={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #ddd'
                            }}
                        />
                    )}
                </Box>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <Button variant="contained" color="primary" type="submit">
                    Kategoriyi Güncelle
                </Button>
            </form>
        </Container>
    );
};

export default UpdateCategory;
