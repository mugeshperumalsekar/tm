import React, { useEffect, useState } from 'react';
import { Box, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import RelationsApiService from '../../data/services/customerDetails/relations/relations_api_services';
import { RelationsPayload } from '../../data/services/customerDetails/relations/relations_payload';
import Loader from '../loader/loader';

const Relations = () => {

    const relations = new RelationsApiService();
    const { customerId } = useParams();
    const [relation, setRelation] = useState<RelationsPayload[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (customerId) {
            fetchRelationsDetails(Number(customerId));
        }
    }, [customerId]);

    const fetchRelationsDetails = async (customerId: number) => {
        try {
            setIsLoading(true);
            const response = await relations.getRelations(customerId);
            console.log('fetchRelationsDetails:', response);
            setRelation(response);
        } catch (error) {
            console.log(`Error fetching the fetchRelationsDetails:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Box component="main" sx={{ flexGrow: 1 }}>
                {isLoading && <Loader />}
                <Typography variant="h6" gutterBottom>Customer Linked Profile</Typography>
                <TableContainer component={Paper} sx={{ mt: 2, mb: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>First Name</strong></TableCell>
                                <TableCell><strong>Last Name</strong></TableCell>
                                <TableCell><strong>Contact Mobile 1</strong></TableCell>
                                <TableCell><strong>Contact Mobile 2</strong></TableCell>
                                <TableCell><strong>Email 1</strong></TableCell>
                                <TableCell><strong>Email 2</strong></TableCell>
                                <TableCell><strong>Related Customer ID</strong></TableCell>
                                <TableCell><strong>Related First Name</strong></TableCell>
                                <TableCell><strong>Related Last Name</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {relation && relation.length > 0 ? (
                                relation.map((rel, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{rel.firstName || 'Not Available'}</TableCell>
                                        <TableCell>{rel.lastName || 'Not Available'}</TableCell>
                                        <TableCell>{rel.contactPersonMobileNo || 'Not Available'}</TableCell>
                                        <TableCell>{rel.contactPersonMobileNo2 || 'Not Available'}</TableCell>
                                        <TableCell>{rel.contactPersonEmailId1 || 'Not Available'}</TableCell>
                                        <TableCell>{rel.contactPersonEmailId2 || 'Not Available'}</TableCell>
                                        <TableCell>{rel.related_customer_id || 'Not Available'}</TableCell>
                                        <TableCell>{rel.related_first_name || 'Not Available'}</TableCell>
                                        <TableCell>{rel.related_last_name || 'Not Available'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} align="center">
                                        No relations found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

export default Relations;