// src/components/Sidebar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import CategoryIcon from '@mui/icons-material/Category';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import ImageIcon from '@mui/icons-material/Image';
import LogoutIcon from '@mui/icons-material/Logout'; // Import the Logout icon
import InfoIcon from '@mui/icons-material/Info'; // Import the InfoIcon


const Sidebar = () => {

    const navigate = useNavigate();
    const logout = () => {
        // Remove token from local storage
        localStorage.removeItem('token');
        // Remove user details from local storage (replace 'user' with your actual key)
        localStorage.removeItem('persist:root');
        localStorage.removeItem('user');
        
        // Optionally update state if you're using a state management solution
        // setIsLoggedin(false);
    
        // Navigate to login page
        navigate('/login');
    };

    return (
        <div style={{ width: '250px', background: '#f4f4f4', height: '100vh', position: 'fixed' }}>
            <List>
                <ListItem button component={Link} to="/">
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Gösterge Paneli" />
                </ListItem>
                <ListItem button component={Link} to="/sales">
                    <ListItemIcon>
                        <AttachMoneyIcon />
                    </ListItemIcon>
                    <ListItemText primary="Satış" />
                </ListItem>
                <ListItem button component={Link} to="/orders">
                    <ListItemIcon>
                        <ShoppingCartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Emirler" />
                </ListItem>
                <ListItem button component={Link} to="/products">
                    <ListItemIcon>
                        <StoreIcon />
                    </ListItemIcon>
                    <ListItemText primary="Ürünler" />
                </ListItem>
                <ListItem button component={Link} to="/categories">
                    <ListItemIcon>
                        <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Kategoriler" />
                </ListItem>
                <ListItem button component={Link} to="/sliderImages">
                <ListItemIcon>
                    <SlideshowIcon />
                </ListItemIcon>
                <ListItemText primary="Kaydırıcı" />
            </ListItem>
            <ListItem button component={Link} to="/logoImage">
                <ListItemIcon>
                    <ImageIcon />
                </ListItemIcon>
                <ListItemText primary="Logo" />
            </ListItem>
            <ListItem button component={Link} to="/info">
            <ListItemIcon>
                <InfoIcon /> {/* Use InfoIcon instead of ImageIcon */}
            </ListItemIcon>
            <ListItemText primary="Bilgi" />
            </ListItem>
                <ListItem button component={Link} to="/">
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText onClick={logout} primary="Çıkış" />
                </ListItem>
            </List>
        </div>
    );
};

export default Sidebar;
