import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CaseDetailsApiService from '../../data/services/customerDetails/caseDetails/caseDetails_api_service';
import { useParams } from 'react-router-dom';
import { CaseDetailsPayload, RiskReviewCase, TransactionMonitoringCases, ScreeningCases } from '../../data/services/customerDetails/caseDetails/caseDetails_payload';
import Loader from '../loader/loader';

const Cases = () => {

    const CaseDetails = new CaseDetailsApiService();
    const { accountId } = useParams();
    const [caseDetailsData, setCaseDetailsData] = useState<CaseDetailsPayload | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (accountId) {
            fetchCaseDetails(Number(accountId));
        }
    }, [accountId]);

    const fetchCaseDetails = async (accountId: number) => {
        try {
            setIsLoading(true);
            const caseDetails = await CaseDetails.getCaseDetails(accountId);
            setCaseDetailsData(caseDetails);
        } catch (error) {
            console.log('Error fetching the fetchCaseDetails:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* <Header /> */}
            <Box component="main" sx={{ flexGrow: 1 }}>
                {isLoading && <Loader />}
                <Typography variant="h6" gutterBottom>Risk Review Cases</Typography>
                <TableContainer component={Paper} sx={{ mt: 2, mb: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                <TableCell><strong>Case Id</strong></TableCell>
                                <TableCell><strong>Review Type</strong></TableCell>
                                <TableCell><strong>Risk Value</strong></TableCell>
                                <TableCell><strong>Final Decision</strong></TableCell>
                                <TableCell><strong>Step Category</strong></TableCell>
                                <TableCell><strong>Review Date</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {caseDetailsData && caseDetailsData.riskReviewCases && caseDetailsData.riskReviewCases.length > 0 ? (
                                caseDetailsData.riskReviewCases.map((caseItem: RiskReviewCase) => (
                                    <TableRow key={caseItem.caseId}>
                                        <TableCell>{caseItem.caseId || 'Not Available'}</TableCell>
                                        <TableCell>{caseItem.reviewType || 'Not Available'}</TableCell>
                                        <TableCell>{caseItem.risk || 'Not Available'}</TableCell>
                                        <TableCell>{caseItem.finalDecision || 'Not Available'}</TableCell>
                                        <TableCell>{caseItem.stepCategory || 'Not Available'}</TableCell>
                                        <TableCell>{caseItem.reviewDate || 'Not Available'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No Risk Review Cases Available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h6" gutterBottom>Transaction Monitoring Cases</Typography>
                <TableContainer component={Paper} sx={{ mt: 2, mb: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                <TableCell><strong>Case Id</strong></TableCell>
                                <TableCell><strong>Alerts</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Step Category</strong></TableCell>
                                <TableCell><strong>Edited On</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {caseDetailsData && caseDetailsData.transactionMonitoringCases && caseDetailsData.transactionMonitoringCases.length > 0 ? (
                                caseDetailsData.transactionMonitoringCases.map((transactionItem: TransactionMonitoringCases) => (
                                    <TableRow key={transactionItem.caseId}>
                                        <TableCell>{transactionItem.caseId || 'Not Available'}</TableCell>
                                        <TableCell>{transactionItem.alert || 'Not Available'}</TableCell>
                                        <TableCell>{transactionItem.statusNw || 'Not Available'}</TableCell>
                                        <TableCell>{transactionItem.stepCategory || 'Not Available'}</TableCell>
                                        <TableCell>{transactionItem.editedOn || 'Not Available'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">No Transaction Monitoring Cases Available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h6" gutterBottom>Screening Cases</Typography>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                <TableCell><strong>Case Id</strong></TableCell>
                                <TableCell><strong>Case Type</strong></TableCell>
                                <TableCell><strong>Alerts</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Step Category</strong></TableCell>
                                <TableCell><strong>Edited On</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {caseDetailsData && caseDetailsData.screeningCases && caseDetailsData.screeningCases.length > 0 ? (
                                caseDetailsData.screeningCases.map((screeningItem: ScreeningCases) => (
                                    <TableRow key={screeningItem.caseId}>
                                        <TableCell>{screeningItem.caseId || 'Not Available'}</TableCell>
                                        <TableCell>{screeningItem.caseType || 'Not Available'}</TableCell>
                                        <TableCell>{screeningItem.alert || 'Not Available'}</TableCell>
                                        <TableCell>{screeningItem.statusNw || 'Not Available'}</TableCell>
                                        <TableCell>{screeningItem.stepCategory || 'Not Available'}</TableCell>
                                        <TableCell>{screeningItem.editedOn || 'Not Available'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No Screening Cases Available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <br></br>
            </Box>
        </Box>
    );
};

export default Cases;