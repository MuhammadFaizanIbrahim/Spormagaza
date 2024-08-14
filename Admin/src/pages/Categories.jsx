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
    DialogTitle
} from '@mui/material';
import { fetchDataFromApi, deleteData } from '../utils/api';

const Categories = () => {
    const navigate = useNavigate();
    const [catData, setCatData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchDataFromApi('/api/category').then((res) => {
            setCatData(res);
        });
    }, []);

    const handleDeleteClick = (id) => {
        setSelectedCategoryId(id);
        setOpenDialog(true);
    };

    const handleConfirmDelete = () => {
        deleteData(`/api/category/${selectedCategoryId}`).then(() => {
            setCatData(catData.filter(item => item.id !== selectedCategoryId && item._id !== selectedCategoryId));
            setOpenDialog(false);
        }).catch(err => {
            console.error('Error deleting category:', err);
        });
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedCategoryId(null);
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = catData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(catData.length / itemsPerPage);

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
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>Kategoriler</Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: '20px', width: '13rem', height: '3rem'}}
                onClick={() => navigate('/categories/add')}
            >
                Yeni Kategori Ekle
            </Button>
            <Table sx={{ marginTop: '20px' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>No.</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Kategori Resmi</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Kategori Adı</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Aksiyon</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentItems.length !== 0 && currentItems.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                            <TableCell>
                                <Box
                                    component="img"
                                    src={item.images?.[0]}
                                    alt="Category"
                                    sx={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd'
                                    }}
                                />
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => navigate(`/categories/update/${item.id ?? item._id}`)}
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
                <DialogTitle>Silmek Kategori</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Bu kategoriyi silmek istediğinizden emin misiniz?
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
        </Container>
    );
};

export default Categories;
