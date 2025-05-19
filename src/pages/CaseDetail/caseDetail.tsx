import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import KycApiService from '../../data/services/customerDetails/kyc/kyc_api_service';
import { KycPayload } from '../../data/services/customerDetails/kyc/kyc_payload';
import { useParams } from 'react-router-dom';
import Loader from '../loader/loader';

const CaseDetail = () => {

    const KycService = new KycApiService();
    const { customerId } = useParams();
    const [kycData, setKycData] = useState<KycPayload | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (customerId) {
            fetchKycData(Number(customerId));
        }
    }, [customerId]);

    const fetchKycData = async (id: number) => {
        try {
            setIsLoading(true);
            const kyc = await KycService.getCashManager(id);
            setKycData(kyc);
        } catch (error) {
            console.error('Error fetching the fetchKycData:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatter = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const formatIncomeRange = (incomeRange: string) => {
        if (!incomeRange) return 'Not Available';
        const [start, end] = incomeRange.split('-').map((value) => formatter.format(Number(value.trim())));
        return `${start} - ${end}`;
    };

    return (

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {isLoading && <Loader />}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                    maxWidth: { xs: '100%', md: '100%', lg: '100%' },
                }}
            >
                <Card sx={{ minWidth: '300px', height: { md: 'fit-content' }, flexGrow: 1 }}>
                    <Box sx={{ backgroundColor: '#f0f0f0', padding: 1 }}>
                        <Typography variant="h6" gutterBottom>Basic Details</Typography>
                    </Box>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Country of Incorporation : </span> {kycData?.basicDetailsData.companyRegistrationCountry || 'Not Available'}</Typography></Grid>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Date of Incorporation : </span> {kycData?.basicDetailsData.commencementDate || 'Not Available'}</Typography></Grid>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Industry-Sector : </span> {kycData?.basicDetailsData.industry || 'Not Available'}</Typography></Grid>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Country of Operation : </span> {kycData?.basicDetailsData.countryOfOperation || 'Not Available'}</Typography></Grid>
                            <Grid item xs={4}>
                                <Typography variant="body1">
                                    <span style={{ fontWeight: 'bold' }}>Income : </span>
                                    {kycData?.basicDetailsData.exactIncome
                                        ? formatter.format(Number(kycData.basicDetailsData.exactIncome))
                                        : 'Not Available'}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Proof of Address : </span> {kycData?.basicDetailsData.aadhaar || 'Not Available'}</Typography></Grid>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Country of Birth : </span> {kycData?.basicDetailsData.countryOfBirth || 'Not Available'}</Typography></Grid>
                            <Grid item xs={4}>
                                <Typography variant="body1">
                                    <span style={{ fontWeight: 'bold' }}>Networth : </span>
                                    {kycData?.basicDetailsData.exactNetworth
                                        ? formatter.format(Number(kycData.basicDetailsData.exactNetworth))
                                        : 'Not Available'}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>ID available : </span> {kycData?.basicDetailsData.companyRegistrationNumber || 'Not Available'}</Typography></Grid>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Listed : </span> {kycData?.basicDetailsData.listed ? 'Yes' : 'No'}</Typography></Grid>
                            <Grid item xs={4}>
                                <Typography variant="body1">
                                    <span style={{ fontWeight: 'bold' }}>Financial Size : </span>
                                    {kycData?.basicDetailsData?.incomeRange
                                        ? formatIncomeRange(kycData.basicDetailsData.incomeRange)
                                        : 'Not Available'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Occupation Details Card */}
                <Card sx={{ minWidth: '300px', height: { md: 'fit-content' }, flexGrow: 1 }}>
                    <Box sx={{ backgroundColor: '#f0f0f0', padding: 1 }}>
                        <Typography variant="h6" gutterBottom>Occupation Details</Typography>
                    </Box>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Occupation-Industry : </span> {kycData?.occupationDetailsData.occupationType || 'Not Available'}</Typography></Grid>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Employer Name : </span> {kycData?.occupationDetailsData.employerName || 'Not Available'}</Typography></Grid>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Employment Years : </span> {kycData?.occupationDetailsData.currentEmploymentInYears || 'Not Available'}</Typography></Grid>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Educational Qualification : </span> {kycData?.occupationDetailsData.educationalQualification || 'Not Available'}</Typography></Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Risk and Other Details Card */}
                <Card sx={{ minWidth: '300px', height: { md: 'fit-content' }, flexGrow: 1 }}>
                    <Box sx={{ backgroundColor: '#f0f0f0', padding: 1 }}>
                        <Typography variant="h6" gutterBottom>Risk Level and Other Details</Typography>
                    </Box>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Pep : </span>{kycData?.riskAndOtherDetailsData.pep || 'Not Available'}</Typography></Grid>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Risk Level : </span>{kycData?.riskAndOtherDetailsData.regulatoryAmlRisk || 'Not Available'}</Typography></Grid>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Adverse Information : </span>{kycData?.riskAndOtherDetailsData.adverseMedia || 'Not Available'}</Typography></Grid>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Special Category Customer : </span>{kycData?.riskAndOtherDetailsData.regAmlSpecialCategory || 'Not Available'}</Typography></Grid>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>STR Reported : </span>{kycData?.riskAndOtherDetailsData.customerStatus || 'Not Available'}</Typography></Grid>
                            <Grid item xs={4}><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Adverse Classification : </span>{kycData?.riskAndOtherDetailsData.adverseMediaClassification || 'Not Available'}</Typography></Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <br></br>
            </Box>
        </Box>
    );
};

export default CaseDetail;