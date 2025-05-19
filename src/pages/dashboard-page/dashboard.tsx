import React from 'react'
import Container from 'react-bootstrap/Container';
import Header from '../../layouts/header/header';
import { Box } from '@mui/material';

const Dashboard = () => {

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box m={2}>
                        <Container style={{ maxWidth: 'none', backgroundColor: 'white', margin: "10px", marginTop: '6%' }}>
                            <Box m={4}>
                                <h3>DASHBOARD</h3>
                                <div className="d-flex justify-content-center">
                                    <div className="card" style={{ boxShadow: '1px 1px 1px grey', width: '100%' }}>
                                        <div className="card-body">
                                            Welcome Dashboard page !
                                        </div>
                                    </div>
                                </div>
                            </Box>
                        </Container>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Dashboard;