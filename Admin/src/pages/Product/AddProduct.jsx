import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, MenuItem, FormControl, InputLabel, Select, Alert } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { postData, fetchDataFromApi } from '../../utils/api';

const AddProduct = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        brand: '',
        price: '',
        category: '',
        countInStock: '',
        isFeatured: false
    });
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [fileInputs, setFileInputs] = useState([{ id: Date.now(), files: [] }]);
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        fetchDataFromApi('/api/category').then((res) => {
            setCategories(res);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e, inputId) => {
        const selectedFiles = Array.from(e.target.files);
        setFileInputs(prevFileInputs => 
            prevFileInputs.map(input => 
                input.id === inputId
                    ? { ...input, files: selectedFiles }
                    : input
            )
        );

        const previews = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(prevImages => [...prevImages, ...previews]);
    };

    const addFileInput = () => {
        setFileInputs(prevFileInputs => [
            ...prevFileInputs,
            { id: Date.now(), files: [] }
        ]);
    };

    const clearFileInputs = () => {
        setFileInputs([{ id: Date.now(), files: [] }]);
        setPreviewImages([]);
    };

    const handleDescriptionChange = (value) => {
        setProduct(prevState => ({
            ...prevState,
            description: value
        }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        fileInputs.forEach(input => {
            input.files.forEach(file => formData.append('images', file));
        });
        formData.append('brand', product.brand);
        formData.append('price', product.price);
        formData.append('category', product.category);
        formData.append('countInStockForSmall', product.countInStockForSmall);
        formData.append('countInStockForMedium', product.countInStockForMedium);
        formData.append('countInStockForLarge', product.countInStockForLarge);
        formData.append('countInStockForExtraLarge', product.countInStockForExtraLarge);
        formData.append('isFeatured', product.isFeatured);

        try {
            await postData('/api/products/create', formData);
            setSeverity('success');
            setMessage('Product successfully added');
            navigate('/products');
        } catch (err) {
            setSeverity('error');
            setMessage('Product not saved');
            console.error('Error adding product:', err);
        }
    };

    return (
        <Container style={{ marginLeft: '260px', padding: '20px' }}>
            <Typography variant="h4">ürün ekle</Typography>
            {message && <Alert severity={severity} style={{ margin: '20px 0' }}>{message}</Alert>}
            <form style={{ marginTop: '20px' }} onSubmit={handleAddProduct}>
                {/* Form fields */}
                <TextField
                    label="Ürün Adı"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginBottom: '20px' }}
                />
                <Typography variant="h6">Ürün Açıklaması</Typography>
                <ReactQuill
                    value={product.description}
                    onChange={handleDescriptionChange}
                    modules={{
                        toolbar: [
                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            ['link', 'image', 'video'],
                            ['clean'],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'align': [] }]
                        ]
                    }}
                    formats={[
                        'header', 'font', 'list', 'bullet',
                        'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'link', 'image', 'video', 'color', 'background', 'align'
                    ]}
                    style={{ height: '300px' }}
                />
                {fileInputs.map(fileInput => (
                    <div key={fileInput.id}>
                        <input
                            type="file"
                            multiple
                            onChange={(e) => handleFileChange(e, fileInput.id)}
                            style={{ marginBottom: '20px', marginTop: '60px' }}
                        />
                    </div>
                ))}
                {previewImages.length > 0 && (
                    <div>
                        <Typography variant="h6">Image Previews:</Typography>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {previewImages.map((preview, index) => (
                                <img
                                    key={index}
                                    src={preview}
                                    alt={`preview-${index}`}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                            ))}
                        </div>
                    </div>
                )}
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={addFileInput}
                    style={{ marginBottom: '20px' }}
                >
                    Daha Fazla Resim Ekle
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={clearFileInputs}
                    style={{ marginBottom: '20px', marginLeft: '10px' }}
                >
                    Tüm Resimleri Sil
                </Button>
                <TextField
                    label="Marka"
                    name="brand"
                    value={product.brand}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginBottom: '20px' }}
                />
                <TextField
                    label="Fiyat"
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginBottom: '20px' }}
                />
                <FormControl fullWidth style={{ marginBottom: '20px' }}>
                    <InputLabel>Kategori</InputLabel>
                    <Select
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                    >
                        <MenuItem value="" disabled>Bir kategori seç</MenuItem>
                        {categories.map(cat => (
                            <MenuItem key={cat._id} value={cat._id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Küçük Ürünler için Stok Sayısı"
                    name="countInStockForSmall"
                    type="number"
                    value={product.countInStockForSmall}
                    onChange={handleChange}
                    // fullWidth
                    style={{ marginBottom: '20px' }}
                />
                <TextField
                    label="Orta Boy Stok Sayısı"
                    name="countInStockForMedium"
                    type="number"
                    value={product.countInStockForMedium}
                    onChange={handleChange}
                    // fullWidth
                    style={{ marginBottom: '20px' }}
                />
                <TextField
                    label="Büyük Stok Sayısı"
                    name="countInStockForLarge"
                    type="number"
                    value={product.countInStockForLarge}
                    onChange={handleChange}
                    // fullWidth
                    style={{ marginBottom: '20px'}}
                />
                <TextField
                    label="Ekstra Büyük Ürün için Stok Sayısı"
                    name="countInStockForExtraLarge"
                    type="number"
                    value={product.countInStockForExtraLarge}
                    onChange={handleChange}
                    // fullWidth
                    style={{ marginBottom: '20px', width: '250px'  }}
                />
                <FormControl fullWidth style={{ marginBottom: '20px' }}>
                    <InputLabel>Öne Çıkanlar</InputLabel>
                    <Select
                        name="isFeatured"
                        value={product.isFeatured.toString()}
                        onChange={handleChange}
                    >
                        <MenuItem value="false">Hayir</MenuItem>
                        <MenuItem value="true">Evet</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" type="submit">Eklemek</Button>
            </form>
        </Container>
    );
};

export default AddProduct;
