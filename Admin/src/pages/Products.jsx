import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Button,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip
} from '@mui/material';
import { fetchDataFromApi, deleteData } from '../utils/api';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';


// Function to determine the color based on stock count
const getStockColor = (count) => {
    if (count < 5) return 'red';
    if (count >= 5 && count <= 15) return 'orange';
    return 'rgb(3, 175, 37)';
};

// const colorForSmall = getStockColor(item.countInStockForSmall);
// const colorForMedium = getStockColor(item.countInStockForMedium);
// const colorForLarge = getStockColor(item.countInStockForLarge);
// const colorForExtraLarge = getStockColor(item.countInStockForExtraLarge);

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchDataFromApi('/api/products')
            .then((res) => {
                if (Array.isArray(res)) {
                    setProducts(res);
                } else {
                    console.error('Unexpected response format:', res);
                    setProducts([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setProducts([]);
            });
    }, []);

    const handleDeleteClick = (id) => {
        setSelectedProductId(id);
        setOpenDialog(true);
    };

    const handleConfirmDelete = () => {
        deleteData(`/api/products/${selectedProductId}`)
            .then(() => {
                setProducts(products.filter(item => item.id !== selectedProductId && item._id !== selectedProductId));
                setOpenDialog(false);
            })
            .catch((err) => {
                console.error('Error deleting product:', err);
            });
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedProductId(null);
    };

    const handleImageClick = (images) => {
        setSelectedImages(images);
        setOpenImageDialog(true);
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>Ürünler</Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: '20px', width: '13rem', height: '3rem'}}
                onClick={() => navigate('/products/add')}
            >
                Yeni Ürün Ekle
            </Button>
            <Table sx={{ marginTop: '20px' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>No.</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Ürün Resmi</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Ürün Adı</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Fiyat</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Öne Çıkanlar</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Stoklamak</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Aksiyon</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.isArray(currentItems) && currentItems.length !== 0 && currentItems.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                            <TableCell>
                                <Box position="relative" display="inline-block">
                                    <Box
                                        component="img"
                                        src={item.images?.[0]}
                                        alt="Product"
                                        sx={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            border: '1px solid #ddd'
                                        }}
                                        onClick={() => handleImageClick(item.images)}
                                    />
                                    {item.images && item.images.length > 1 && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: '0',
                                                right: '0',
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                color: 'white',
                                                padding: '2px 5px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => handleImageClick(item.images)}
                                        >
                                            {item.images.length > 9 ? '9+' : `${item.images.length}`}
                                        </Box>
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>₺{item.price}</TableCell>
                            <TableCell>
                                <Tooltip title={item.isFeatured ? 'Öne Çıkanlar' : 'Öne Çıkmayan'}>
                                    {item.isFeatured ? (
                                        <StarIcon sx={{ color: 'gold' }} />
                                    ) : (
                                        <StarBorderIcon sx={{ color: 'grey' }} />
                                    )}
                                </Tooltip>
                            </TableCell>
                            <TableCell sx={{ fontWeight: '200', fontSize: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span >S:{item.countInStockForSmall}</span> |
                                <span > M:{item.countInStockForMedium}</span> |
                                <span > L:{item.countInStockForLarge}</span> |
                                <span > XL:{item.countInStockForExtraLarge}</span>
                            </div>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => navigate(`/products/update/${item.id ?? item._id}`)}
                                >
                                    Güncelleme
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ marginLeft: '10px' }}
                                    onClick={() => handleDeleteClick(item.id ?? item._id)}
                                >
                                    Silmek
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                        key={index + 1}
                        variant={currentPage === index + 1 ? 'contained' : 'outlined'}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Button>
                ))}
                {totalPages > 1 && (
                    <Button
                        variant="contained"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        {'>'}
                    </Button>
                )}
            </Box>
            <Dialog
                open={openDialog}
                onClose={handleCancelDelete}
            >
                <DialogTitle>Ürünü Sil</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Bu ürünü silmek istediğinizden emin misiniz?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                    Hayir
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                    Evet
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openImageDialog}
                onClose={() => setOpenImageDialog(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Ürün Görselleri</DialogTitle>
                <DialogContent>
                    <Box
                        display="flex"
                        flexDirection="row"
                        flexWrap="wrap"
                        gap="10px"
                    >
                        {selectedImages.map((image, index) => (
                            <Box
                                key={index}
                                component="img"
                                src={image}
                                alt={`Product ${index}`}
                                sx={{
                                    width: '150px',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    border: '1px solid #ddd'
                                }}
                                onClick={() => window.open(image, '_blank')}
                            />
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenImageDialog(false)} color="primary">
                    Kapalı
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Products;
