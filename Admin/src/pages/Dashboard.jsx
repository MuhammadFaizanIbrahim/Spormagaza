import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, MenuItem, Select, Box } from '@mui/material';
import { fetchDataFromApi } from '../utils/api';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Link } from 'react-router-dom';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [totalOrders, setTotalOrders] = useState(0);
    const [sales, setSales] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalCategories, setTotalCategories] = useState(0);
    const [timePeriod, setTimePeriod] = useState('week');
    const [salesData, setSalesData] = useState([]);
    const [ordersData, setOrdersData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsData = await fetchDataFromApi('/api/products/count');
                setTotalProducts(productsData.count);

                const ordersData = await fetchDataFromApi('/api/orders/count');
                setTotalOrders(ordersData.count);

                const salesData = await fetchDataFromApi('/api/sales');
                if (Array.isArray(salesData)) {
                    setSales(salesData);
                } else {
                    console.error('Error fetching total Sales:', salesData);
                }

                const categoriesData = await fetchDataFromApi('/api/category/count');
                setTotalCategories(categoriesData.count);

                const usersData = await fetchDataFromApi('/api/users/count');
                setTotalUsers(usersData.count);

            } catch (error) {
                console.error('Failed to fetch data:', error);
                alert('An error occurred while fetching data. Please check the console for details.');
            }
        };

        fetchData();
    }, []);

    const totalSalesAmount = sales.reduce((total, sale) => total + sale.totalAmount, 0);

    return (
        <Container
            sx={{
                padding: '20px',
                marginLeft: '260px', // Align with the sidebar
                marginTop: '0px', // No margin from top
                minHeight: 'calc(100vh - 20px)', // Ensure it expands downwards
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box', // Includes padding in height calculations
            }}
        >
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>Gösterge Paneli</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4} lg={4} component={Link} to="/orders" sx={{textDecoration: 'none'}}>
                    <Paper sx={{ padding: '30px', textAlign: 'center', backgroundColor: 'rgb(1, 145, 30)', color: 'white', border: '1px solid #ccc', height: '150px' }}>
                        <Typography variant="h5">Toplam Siparişler</Typography>
                        <Typography variant="h3">{totalOrders}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} component={Link} to="/sales"  sx={{textDecoration: 'none'}}>
                    <Paper sx={{ padding: '30px', textAlign: 'center', backgroundColor: 'blue', color: 'white', border: '1px solid #ccc', height: '150px' }}>
                        <Typography variant="h5">Toplam Satış</Typography>
                        <Typography variant="h3">₺{totalSalesAmount.toFixed(2)}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}  sx={{textDecoration: 'none'}}>
                    <Paper sx={{ padding: '30px', textAlign: 'center', backgroundColor: 'red', color: 'white', border: '1px solid #ccc', height: '150px' }}>
                        <Typography variant="h5">Toplam Kullanıcı Sayısı</Typography>
                        <Typography variant="h3">{totalUsers}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} component={Link} to="/products"  sx={{textDecoration: 'none'}}>
                    <Paper sx={{ padding: '30px', textAlign: 'center', backgroundColor: 'orange', color: 'white', border: '1px solid #ccc', height: '150px' }}>
                        <Typography variant="h5">Toplam Ürünler</Typography>
                        <Typography variant="h3">{totalProducts}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} component={Link} to="/categories"  sx={{textDecoration: 'none'}}>
                    <Paper sx={{ padding: '30px', textAlign: 'center', backgroundColor: 'purple', color: 'white', border: '1px solid #ccc', height: '150px' }}>
                        <Typography variant="h5">Toplam Kategoriler</Typography>
                        <Typography variant="h3">{totalCategories}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
