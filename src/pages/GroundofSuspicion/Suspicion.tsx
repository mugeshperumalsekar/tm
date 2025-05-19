// import { Box, Button, Typography } from '@mui/material';
// import React from 'react';
// import Header from '../../layouts/header/header';
// import TextArea from 'antd/es/input/TextArea';

// const Suspicion = () => {
//     return (
//         <Box sx={{ display: 'flex' }}>
//             <Header />
//             <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
//                 <Typography variant="h6" gutterBottom>
//                     GROUNDS OF SUSPICION
//                 </Typography>

//                 {/* Container for TextArea and Button */}
//                 <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
//                     {/* TextArea for entering suspicion grounds */}
//                     <TextArea
//                         placeholder='Enter grounds of suspicion'
//                         rows={6}
//                         style={{ width: '100%', marginBottom: '16px' }} // Adjust margin here
//                         className='commonStyle'
//                     />

//                     {/* Submit Button */}
//                     <Button variant="contained" color="primary" sx={{ alignSelf: 'flex-end' }}>
//                         Submit
//                     </Button>
//                 </Box>
//             </Box>
//         </Box>
//     );
// }

// export default Suspicion;

// import React from 'react';
// import { Box, Button, Typography, Grid } from '@mui/material';
// import Header from '../../layouts/header/header';
// import TextArea from 'antd/es/input/TextArea';
// import GroundApiService from '../../data/services/customerDetails/groundOfSuspicion/ground_api_service';
// import { useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const Suspicion = () => {

//     const groundOfSuspicion = new GroundApiService();
//     const { customerId, accountId } = useParams();
//     console.log('Suspicion customerId:', customerId);
//     console.log('Suspicion of accountId:', accountId);
//     const userDetails = useSelector((state: any) => state.loginReducer);
//     const loginDetails = userDetails.loginDetails.id;
//     console.log('Suspicion of loginDetails:', loginDetails);

//     const handleSubmit = async () => {
//         try {

//         }
//     }
//     return (
//         <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//             {/* <Header /> */}
//             <Box component="main" sx={{ flexGrow: 1 }}>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} md={10}>
//                         <TextArea
//                             placeholder="Enter grounds of suspicion"
//                             rows={6}
//                             style={{ width: '100%', marginBottom: '16px' }}
//                             className="commonStyle"
//                         />
//                     </Grid>
//                     <Grid item xs={12} md={2} sx={{ alignSelf: 'center' }}>
//                         <Button variant="contained" color="primary">
//                             Submit
//                         </Button>
//                     </Grid>
//                 </Grid>
//             </Box>
//         </Box>
//     );
// };

// export default Suspicion;

import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import TextArea from 'antd/es/input/TextArea';
import GroundApiService from '../../data/services/customerDetails/groundOfSuspicion/ground_api_service';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Suspicion = () => {

    const [groundsOfSuspicion, setGroundsOfSuspicion] = useState('');
    const groundOfSuspicion = new GroundApiService();
    const { customerId, accountId, hitId } = useParams();
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails.id;
    const [error, setError] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setGroundsOfSuspicion(event.target.value);
        if (event.target.value.trim() !== '') {
            setError(false);
        }
    };

    const handleSubmit = async () => {
        if (groundsOfSuspicion.trim() === '') {
            setError(true);
            return;
        }
        try {
            const payload = {
                id: 0,
                groundsOfSuspicion,
                customerId: parseInt(customerId || '0', 10),
                accountId: parseInt(accountId || '0', 10),
                hitId: parseInt(hitId || '0', 10),
                uid: loginDetails,
                euid: 0,
            };
            const response = await groundOfSuspicion.createGroundOfSuspicion(payload);
            setGroundsOfSuspicion('');
        } catch (error) {
            console.error('Error while creating ground of suspicion:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={10}>
                        <TextArea
                            placeholder="Enter grounds of suspicion"
                            rows={6}
                            style={{ width: '100%', marginBottom: '16px' }}
                            value={groundsOfSuspicion}
                            onChange={handleInputChange}
                            className="commonStyle"
                        />
                        {error && (
                            <Typography
                                variant="body2"
                                color="error"
                                sx={{ marginTop: '4px' }}
                            >
                                This field is required.
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} md={2} sx={{ alignSelf: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Suspicion;