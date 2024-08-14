import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TablePagination
} from '@mui/material';
import { fetchDataFromApi, deleteData } from '../utils/api';
import { Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
    const [currentSaleId, setCurrentSaleId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        const getSales = async () => {
            try {
                const data = await fetchDataFromApi('/api/sales');
                if (Array.isArray(data)) {
                    // Filter out sales with empty orderItems and delete them
                    const validSales = data.filter(sale => sale.orderItems.length > 0);
                    const invalidSales = data.filter(sale => sale.orderItems.length === 0);

                    // Delete invalid sales
                    for (const sale of invalidSales) {
                        await deleteData(`/api/sales/${sale._id}`);
                    }

                    const sortedSales = validSales.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));


                    setSales(sortedSales);
                } else {
                    console.error('Expected an array but received:', data);
                }
            } catch (error) {
                console.error('Failed to fetch sales:', error);
                alert('An error occurred while fetching sales data. Please check the console for details.');
            }
        };

        const getOrders = async () => {
            try {
                const orderData = await fetchDataFromApi('/api/orders');
                if (Array.isArray(orderData)) {
                    setOrders(orderData);
                } else {
                    console.error('Expected an array but received:', orderData);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };

        getOrders();
        getSales();
    }, []);

    const handleDeleteClick = (id, event) => {
        event.stopPropagation();
        setCurrentSaleId(id);
        setShowDeleteConfirmDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (currentSaleId) {
            try {
                await deleteData(`/api/sales/${currentSaleId}`);
                setSales(prevSales => prevSales.filter(sale => sale._id !== currentSaleId));
                setShowDeleteConfirmDialog(false);
                setCurrentSaleId(null);
            } catch (error) {
                console.error('Failed to delete sale:', error);
            }
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmDialog(false);
        setCurrentSaleId(null);
    };

    const getOrderNumber = (orderId) => {
        const order = orders.find(order => order._id === orderId);
        return order ? order.orderNumber : 'N/A';
    };

    const totalSalesAmount = sales.reduce((total, sale) => total + sale.totalAmount, 0);
    const totalOrders = sales.length;

    const handleRowClick = (id) => {
        navigate(`/dashboard/orders/${id}`);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Container
            sx={{
                padding: '20px',
                marginLeft: '260px',
                marginTop: '0px',
                minHeight: 'calc(100vh - 20px)',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}
        >
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>Satış</Typography>

            <Paper
                sx={{
                    padding: '20px',
                    marginBottom: '20px',
                    border: '1px solid #ddd',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Typography variant="h6">Toplam Satış Tutarı: <b>${totalSalesAmount.toFixed(2)}</b></Typography>
                <Typography variant="h6">Toplam Tamamlanan Siparişler: <b>{totalOrders}</b></Typography>
            </Paper>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Sr. No.</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Emir No.</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Ürün Detayları</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Toplam Tutar</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Tarih</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Aksiyon</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sales.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((sale, index) => (
                        <TableRow key={sale._id}
                        onClick={() => handleRowClick(sale.orderId)}
                        sx={{ cursor: 'pointer' }}>
                            <TableCell>{totalOrders - (page * rowsPerPage + index)}</TableCell>
                            <TableCell>{getOrderNumber(sale.orderId)}</TableCell>
                            <TableCell>
                                {sale.orderItems.map(item => (
                                    <div key={item?.product?._id}>
                                        {item.quantity} x {item.size} x {item?.product?.name || 'Product name not available'}
                                    </div>
                                ))}
                            </TableCell>
                            <TableCell>₺{sale.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<Delete />}
                                    onClick={(event) => handleDeleteClick(sale._id, event)}
                                >
                                    Silmek
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={sales.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Dialog open={showDeleteConfirmDialog} onClose={handleCancelDelete}>
                <DialogTitle>Silmeyi Onayla</DialogTitle>
                <DialogContent>
                    <Typography>Bu satışı silmek istediğinizden emin misiniz?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>İptal etmek</Button>
                    <Button onClick={handleConfirmDelete} color="error">Silmek</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Sales;
