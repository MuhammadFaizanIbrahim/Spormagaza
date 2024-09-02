import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchDataFromApi, editData } from '../../utils/api';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        images: [],
        brand: '',
        price: '',
        category: '',
        countInStock: '',
        rating: '',
        numReviews: '',
        isFeatured: false,
        showProductNotice: true,
        notice: ''
    });
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
    const [fileInputs, setFileInputs] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        fetchDataFromApi(`/api/products/${id}`).then((res) => {
            setProduct(res);
            setPreviewImages(res.images); // Set initial image previews
        });

        fetchDataFromApi('/api/category').then((res) => {
            setCategories(res);
        });
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e, index) => {
        const newImages = [...product.images];
        newImages[index] = e.target.files[0];
        setProduct(prevState => ({
            ...prevState,
            images: newImages
        }));

        // Preview image
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImages(prevImages => {
                const updatedImages = [...prevImages];
                updatedImages[index] = reader.result;
                return updatedImages;
            });
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteImage = (index) => {
        const newImages = product.images.filter((_, i) => i !== index);
        setProduct(prevState => ({
            ...prevState,
            images: newImages
        }));
        setPreviewImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleAddImage = () => {
        setFileInputs(prevInputs => [
            ...prevInputs,
            { id: Date.now(), files: [] }
        ]);
        setPreviewImages(prevImages => [...prevImages, '']); // Add empty preview for new image
    };

    const handleDescriptionChange = (value) => {
        setProduct(prevState => ({
            ...prevState,
            description: value
        }));
    };

    const handleNoticeChange = (value) => {
        setProduct(prevState => ({
            ...prevState,
            notice: value
        }));
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        product.images.forEach((file) => {
            if (file instanceof File) formData.append('images', file);
        });
        formData.append('brand', product.brand);
        formData.append('price', product.price);
        formData.append('category', product.category);
        formData.append('countInStockForSmall', product.countInStockForSmall);
        formData.append('countInStockForMedium', product.countInStockForMedium);
        formData.append('countInStockForLarge', product.countInStockForLarge);
        formData.append('countInStockForExtraLarge', product.countInStockForExtraLarge);
        formData.append('rating', product.rating);
        formData.append('numReviews', product.numReviews);
        formData.append('isFeatured', product.isFeatured);
        formData.append('showProductNotice', product.showProductNotice);
        formData.append('notice', product.notice);

        try {
            await editData(`/api/products/${id}`, formData);
            setMessage('Product successfully updated');
            navigate('/products');
        } catch (err) {
            setMessage('Product not updated');
            console.error('Error updating product:', err);
        }
    };

    const handleClearImages = () => {
        setProduct(prevState => ({
            ...prevState,
            images: []
        }));
        setPreviewImages([]);
        setFileInputs([]);
    };

    return (
        <Container style={{ marginLeft: '260px', padding: '20px' }}>
            <Typography variant="h4">Ürünü Güncelle</Typography>
            {message && <Typography variant="subtitle1">{message}</Typography>}
            <form style={{ marginTop: '20px' }} onSubmit={handleUpdateProduct}>
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
                    theme="snow"
                    style={{ marginBottom: '20px' }}
                />
                <Typography variant="h6">Ürün Görselleri</Typography>
                {product.images.length > 0 && (
                    <div>
                        {previewImages.map((image, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <img
                                    src={image}
                                    alt={`Preview ${index + 1}`}
                                    style={{ width: '100px', height: 'auto', border: '1px solid #ddd', borderRadius: '4px', marginRight: '10px' }}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <Typography variant="h6">Resim Ekle veya Değiştir</Typography>
                {fileInputs.map((fileInput, index) => (
                    <div key={fileInput.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <input
                            type="file"
                            onChange={(e) => handleImageChange(e, index)}
                            style={{ marginRight: '10px' }}
                        />
                        {previewImages[index] && (
                            <img
                                src={previewImages[index]}
                                alt={`Preview ${index + 1}`}
                                style={{ width: '100px', height: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        )}
                    </div>
                ))}
                <Button variant="outlined" onClick={handleAddImage}>
                Başka Bir Resim Ekle
                </Button>
                <Button variant="outlined" onClick={handleClearImages} style={{ marginLeft: '20px' }}>
                Tüm Resimleri Sil
                </Button>
                <TextField
                    label="Marka"
                    name="brand"
                    value={product.brand}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginTop: '20px', marginBottom: '20px' }}
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
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={product.showProductNotice}
                            onChange={handleChange}
                            name="showProductNotice"
                        />
                    }
                    label="Tarih Bildirim Satırını Göster"
                    style={{ marginBottom: '20px' }}
                />
                <Typography variant="h6">Fark etme</Typography>
                <ReactQuill
                    value={product.notice}
                    onChange={handleNoticeChange}
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
                    style={{ height: '200px' }}
                />
                <Button variant="contained" color="primary" type="submit">
                Güncelleme
                </Button>
            </form>
        </Container>
    );
};

export default UpdateProduct;
