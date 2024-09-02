import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchDataFromApi } from '../utils/api'; // Ensure this import path is correct

const OrderDetails = () => {
    const { id } = useParams(); // Get the order ID from URL
    const [order, setOrder] = useState(null);

    useEffect(() => {
        // Fetch the order details from API
        const getOrder = async () => {
            const data = await fetchDataFromApi(`/api/orders/${id}`);
            setOrder(data);
        };
        getOrder();
    }, [id]);

    if (!order) return <div>Loading...</div>;

    // Determine the status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'red';
            case 'Processing':
                return 'orange';
            case 'Delivered':
                return 'blue';
            case 'Completed':
                return 'green';
            case 'Cancelled':
                return 'gray';
            default:
                return 'black';
        }
    };

    // Translate status to Turkish
    const getStatusTranslation = (status) => {
        switch (status) {
            case 'Pending':
                return 'Askıda olması';
            case 'Processing':
                return 'İşleme';
            case 'Delivered':
                return 'Teslim edilmiş';
            case 'Completed':
                return 'Tamamlanmış';
            case 'Cancelled':
                return 'İptal edildi';
            default:
                return status;
        }
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
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>Sipariş Detayları</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            padding: '20px',
                            border: '1px solid #ddd',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            height: '100%',
                        }}
                    >
                        <Typography variant="h6">Sipariş Numarası: <b>{order.orderNumber}</b></Typography>
                        <Typography variant="h4" sx={{ marginTop: '20px' }}>Kullanıcı Detayları:</Typography>
                        <Typography variant="h6"><b>İsim: </b>{order.shippingAddress.fullName}</Typography>
                        <Typography variant="h6"><b>E-Posta: </b>{order.shippingAddress.email}</Typography>
                        <Typography variant="h6"><b>Telefon Numarası:</b> +{order.shippingAddress.phone}</Typography>
                        <Typography variant="h6"><b>T.C. Kimlik No:</b> {order.shippingAddress.tckCode}</Typography>
                        <Typography variant="h4" sx={{ marginTop: '20px' }}>Nakliye Ayrıntıları:</Typography>
                        <Typography variant="h6"><b>Adres: </b> {order.shippingAddress.address}</Typography>
                        <Typography variant="h6"><b>Şehir: </b>{order.shippingAddress.province}</Typography>
                        <Typography variant="h6"><b>İlçe: </b>{order.shippingAddress.city}</Typography>
                        <Typography variant="h6"><b>Posta Kodu: </b>{order.shippingAddress.postalCode}</Typography>
                        <Typography variant="h6"><b>Ülke: </b>{order.shippingAddress.country}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            padding: '20px',
                            border: '1px solid #ddd',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            height: '100%',
                        }}
                    >
                        <Typography variant="h4">Ürün Detayları:</Typography>
                        {order.orderItems.map(item => (
                            <Box key={item._id} sx={{ marginBottom: '10px' }}>
                                <Typography variant="h6">
                                    {item.quantity} x {item.size} x <b>{item.product.name}</b> - ₺{item.product.price.toFixed(2)}
                                </Typography>
                            </Box>
                        ))}
                        <Typography variant="h4" sx={{ marginTop: '20px' }}>Toplam Fiyat: ₺{order.totalPrice.toFixed(2)}</Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                marginTop: '30px',
                                color: getStatusColor(order.status), // Apply status color
                            }}
                        >
                            <b>Durum: </b>{getStatusTranslation(order.status)}
                        </Typography>
                        <Typography variant="h6"><b>Sipariş Tarihi ve Saati: </b> {new Date(order.dateOrdered).toLocaleString()}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default OrderDetails;
