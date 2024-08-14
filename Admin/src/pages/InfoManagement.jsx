import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Button, Alert, TextField } from '@mui/material';
import axios from 'axios';
import { editData, postData } from '../utils/api';

const InfoPage = () => {
    const [info, setInfo] = useState({
        ibanNumber: '',
        phoneNumber1: '',
        phoneNumber2: '',
        address: '',
        email: ''
    });
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [isEditing, setIsEditing] = useState(false);
    const [infoId, setInfoId] = useState(null);

    useEffect(() => {
        // Fetch existing information if available
        const fetchInfo = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/info');
                if (response.data) {
                    setInfo(response.data);
                    setInfoId(response.data._id);
                    setIsEditing(true);
                }
            } catch (err) {
                setSeverity('error');
                setMessage('Failed to fetch information');
            }
        };

        fetchInfo();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInfo({ ...info, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            if (isEditing && infoId) {
                // Update existing information
                await editData(`/api/info/update/${infoId}`, info);
                setSeverity('success');
                setMessage('Information successfully updated');
            } else {
                // Add new information
                await postData('/api/info/add', info);
                setSeverity('success');
                setMessage('Information successfully added');
            }
        } catch (err) {
            setSeverity('error');
            setMessage(`Failed to ${isEditing ? 'update' : 'add'} information`);
        }
    };

    return (
        <Container style={{ marginLeft: '260px', padding: '20px' }}>
            <Typography variant="h4">IBAN & Contact Information</Typography>
            {message && <Alert severity={severity} style={{ margin: '20px 0' }}>{message}</Alert>}

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="IBAN Number"
                        name="ibanNumber"
                        value={info.ibanNumber}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Phone Number 1"
                        name="phoneNumber1"
                        value={info.phoneNumber1}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Phone Number 2"
                        name="phoneNumber2"
                        value={info.phoneNumber2}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Email"
                        name="email"
                        value={info.email}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Address"
                        name="address"
                        value={info.address}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={4}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        {isEditing ? 'Update Information' : 'Add Information'}
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default InfoPage;
