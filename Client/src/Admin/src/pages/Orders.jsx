import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Paper,
    MenuItem,
    Select,
    FormControl,
    ButtonGroup,
    Button,
    Box,
    Tabs,
    Tab,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchDataFromApi, editData, deleteData, postData } from '../utils/api'; // Ensure this import path is correct
import { Visibility, Delete } from '@mui/icons-material'; // Import icons

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tabValue, setTabValue] = useState('Pending');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
    const [isProcessingSale, setIsProcessingSale] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const getOrders = async () => {
            try {
                const data = await fetchDataFromApi('/api/orders');
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    console.error('Expected an array but received:', data);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };
        getOrders();
    }, []);


const handleStatusChange = _.debounce(async (id, newStatus) => {
    try {
        // Update the order status
        await editData(`/api/orders/${id}`, { status: newStatus });
    
        // Update the orders state
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order._id === id ? { ...order, status: newStatus } : order
            )
        );
    
        // Only create a sale if the new status is "Completed" and no sale has been processed
        if (newStatus === 'Completed') {
            const updatedOrder = orders.find(order => order._id === id);
            console.log('Updated Order:', updatedOrder); // Log updatedOrder to check its structure
            
            if (updatedOrder && !updatedOrder.isSaleCreated) {
                setIsProcessingSale(true); // Set the flag to true to prevent multiple calls
                await createSale(updatedOrder);
                // Update the order to indicate that the sale has been created
                await editData(`/api/orders/${id}`, { isSaleCreated: true });
                setIsProcessingSale(false); // Reset the flag after the sale is processed
            } else if (updatedOrder) {
                console.log('Sale already created for order:', id);
            } else {
                console.error('Order not found:', id);
            }
        }
    } catch (error) {
        console.error('Failed to update order status:', error);
        setIsProcessingSale(false); // Reset the flag in case of an error
    }
}, 300); // 300ms debounce delay


const createSale = async (order) => {
    if (!order || !order._id || !order.orderItems || !order.user) {
        console.error('Invalid order object:', order);
        return; // Exit the function if order is invalid
    }
    
    try {
        if (isProcessingSale) return; // Prevent multiple calls
        setIsProcessingSale(true); // Set processing flag
        
        const saleData = {
            orderId: order._id,
            orderItems: order.orderItems.map(item => ({
                product: item.product._id,
                size: item.size,
                quantity: item.quantity
            })),
            totalAmount: order.totalPrice,
            user: "609b8c8b5f9f0a27a8b3e4b8" // Replace with actual user ID
        };
        console.log('Sale Data:', saleData); // Log saleData to verify its structure
        await postData('/api/sales/create', saleData);
        
        // Update the order to indicate that the sale has been created
        await editData(`/api/orders/${order._id}`, { isSaleCreated: true });
    } catch (error) {
        console.error('Failed to create sale:', error);
    } finally {
        setIsProcessingSale(false); // Reset processing flag
    }
};

    
    
    const handleRowClick = (id) => {
        navigate(`/dashboard/orders/${id}`);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSelectChange = (e, id) => {
        e.stopPropagation();
        const newStatus = e.target.value;
        setNewStatus(newStatus);
        setCurrentOrderId(id);
        setShowConfirmDialog(true);
    };

    const handleUpdateClick = (id, status) => {
        setNewStatus(status);
        setCurrentOrderId(id);
        setShowConfirmDialog(true);
    };
    
    const handleConfirmUpdate = () => {
        if (currentOrderId && newStatus) {
            handleStatusChange(currentOrderId, newStatus);
            setShowConfirmDialog(false);
            setCurrentOrderId(null);
            setNewStatus('');
        }
    };

    const handleCancelUpdate = () => {
        setShowConfirmDialog(false);
        setCurrentOrderId(null);
        setNewStatus('');
    };

    const handleDeleteClick = (id) => {
        setCurrentOrderId(id);
        setShowDeleteConfirmDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (currentOrderId) {
            try {
                await deleteData(`/api/orders/${currentOrderId}`);
                setOrders(prevOrders => prevOrders.filter(order => order._id !== currentOrderId));
                setShowDeleteConfirmDialog(false);
                setCurrentOrderId(null);
            } catch (error) {
                console.error('Failed to delete order:', error);
            }
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmDialog(false);
        setCurrentOrderId(null);
    };

    const filteredOrders = orders.filter(order => order.status === tabValue);
    const sortedOrders = filteredOrders.sort((a, b) => new Date(b.dateOrdered) - new Date(a.dateOrdered));
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

    const totalPending = orders.filter(order => order.status === 'Pending').length;
    const totalDelivered = orders.filter(order => order.status === 'Delivered').length;
    const totalCompleted = orders.filter(order => order.status === 'Completed').length;
    const totalProcessing = orders.filter(order => order.status === 'Processing').length;
    const totalCancelled = orders.filter(order => order.status === 'Cancelled').length;


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>Emirler</Typography>

            <Paper
                sx={{
                    padding: '20px',
                    marginBottom: '20px',
                    border: '1px solid #ddd',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Box>
                    <Typography variant="h4">Toplam Siparişler: {orders.length}</Typography>
                </Box>
                <Box>
                    <Typography variant="body1">Askıda olması: {totalPending}</Typography>
                    <Typography variant="body1">İşleme: {totalProcessing}</Typography>
                    <Typography variant="body1">Teslim edilmiş: {totalDelivered}</Typography>
                    <Typography variant="body1">Tamamlanmış: {totalCompleted}</Typography>
                    <Typography variant="body1">İptal edildi: {totalCancelled}</Typography>
                </Box>
            </Paper>

            <Tabs value={tabValue} onChange={handleTabChange} aria-label="order status tabs">
                <Tab label={`Askıda olması (${totalPending})`} value="Pending" sx={{ color: 'red' }} />
                <Tab label={`İşleme (${totalProcessing})`} value="Processing" sx={{ color: 'orange' }} />
                <Tab label={`Teslim Edilmiş (${totalDelivered})`} value="Delivered" sx={{ color: 'blue' }} />
                <Tab label={`Tamamlanmış (${totalCompleted})`} value="Completed" sx={{ color: 'green' }} />
                <Tab label={`İptal Edildi (${totalCancelled})`} value="Cancelled" sx={{ color: 'gray' }} />
            </Tabs>

            <Table sx={{ marginBottom: '20px', width: '1200px' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Sr. No.</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Emir. No.</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Ürün Detayları</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Kullanıcı Adı</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Toplam Fiyat</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Sipariş Tarihi</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Aksiyon</TableCell> {/* New column for buttons */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentItems.map((order, index) => (
                        <TableRow
                            key={order._id}
                            onClick={() => handleRowClick(order._id)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <TableCell>
                                {filteredOrders.length - (currentPage - 1) * itemsPerPage - index}
                            </TableCell>
                            <TableCell>{order.orderNumber}</TableCell>
                            <TableCell>
                            {order.orderItems.map(item => (
                                    <div key={item._id}>
                                        {item.quantity} x {item.size} x {item.product ? item.product.name : 'Product name not available'}
                                    </div>
                                ))}
                            </TableCell>
                            <TableCell>{order.shippingAddress.fullName}</TableCell>
                            <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                            <TableCell>{new Date(order.dateOrdered).toLocaleString()}</TableCell>
                            <TableCell>
                                <FormControl fullWidth>
                                    <Select
                                        value={order.status}
                                        onChange={(e) => handleSelectChange(e, order._id)}
                                        onClick={(e) => e.stopPropagation()} // Prevent row click event
                                        style={{fontSize:'13px'}}

                                    >
                                        <MenuItem value="Pending">Askıda olması</MenuItem>
                                        <MenuItem value="Processing">İşleme</MenuItem>
                                        <MenuItem value="Delivered">Teslim edilmiş</MenuItem>
                                        <MenuItem value="Completed">Tamamlanmış</MenuItem>
                                        <MenuItem value="Cancelled">İptal Edildi</MenuItem>
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Visibility />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRowClick(order._id);
                                    }}
                                    style={{fontSize:'8px'}}
                                >
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<Delete />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(order._id);
                                    }}
                                    sx={{ ml: 1 }}
                                >
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Box display="flex" justifyContent="center" mt={2}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        variant={index + 1 === currentPage ? 'contained' : 'outlined'}
                    >
                        {index + 1}
                    </Button>
                ))}
            </Box>

            <Dialog open={showConfirmDialog} onClose={handleCancelUpdate}>
                <DialogTitle>Durum Güncellemesini Onayla</DialogTitle>
                <DialogContent>
                    <Typography>Durumu şu şekilde güncellemek istediğinizden emin misiniz: {newStatus}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelUpdate}>İptal etmek</Button>
                    <Button onClick={handleConfirmUpdate}>Onaylamak</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showDeleteConfirmDialog} onClose={handleCancelDelete}>
                <DialogTitle>Silmeyi Onayla</DialogTitle>
                <DialogContent>
                    <Typography>Bu siparişi silmek istediğinizden emin misiniz?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>İptal etmek</Button>
                    <Button onClick={handleConfirmDelete} color="error">Silmek</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Orders;
