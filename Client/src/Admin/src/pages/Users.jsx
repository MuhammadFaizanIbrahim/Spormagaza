import React, { useState } from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Typography, Box, Button, ButtonGroup, Paper } from '@mui/material';

const Users = () => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Example data for pagination
    const usersData = [
        { username: 'user1', email: 'user1@example.com', role: 'Admin' },
        { username: 'user2', email: 'user2@example.com', role: 'User' },
        { username: 'user1', email: 'user1@example.com', role: 'Admin' },
        { username: 'user2', email: 'user2@example.com', role: 'User' },
        { username: 'user1', email: 'user1@example.com', role: 'Admin' },
        { username: 'user2', email: 'user2@example.com', role: 'User' },
        { username: 'user1', email: 'user1@example.com', role: 'Admin' },
        { username: 'user2', email: 'user2@example.com', role: 'User' },
        { username: 'user1', email: 'user1@example.com', role: 'Admin' },
        { username: 'user2', email: 'user2@example.com', role: 'User' },
        { username: 'user1', email: 'user1@example.com', role: 'Admin' },
        { username: 'user2', email: 'user2@example.com', role: 'User' },
        // Add more example data here
    ];

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = usersData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(usersData.length / itemsPerPage);

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
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>Users</Typography>
            <Table sx={{ marginTop: '20px' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentItems.length !== 0 && currentItems.map((user, index) => (
                        <TableRow key={index}>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
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
        </Container>
    );
};

export default Users;
