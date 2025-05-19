import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Grid, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';
import MoneyFlowApiServices from '../../data/services/customerDetails/moneyFlow/moneyFlow_api_services';
import { useParams } from 'react-router-dom';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface MoneyFlows {
    [x: string]: any;
    length: number;
    customerId: number;
    period: number;
    moneyIn: number;
    moneyOut: number;
    netMoneyFlow: number;
    frmDate: string;
    toDate: string;
}

interface Months {
    [x: string]: any;
    length: number;
    period: string;
    moneyIn: number;
    moneyOut: number;
    netMoneyFlow: number;
    fromDate: String;
    toDate: String;
}

const MoneyFlow: React.FC = () => {

    const MoneyFlowService = new MoneyFlowApiServices();
    const { accountId } = useParams();
    const [moneyFlow, setMoneyFlow] = useState<MoneyFlows | null>(null);
    const [month, setMonth] = useState<Months | null>(null);
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [useLast12Months, setUseLast12Months] = useState(false);
    const [useLast6Months, setUseLast6Months] = useState(false);
    const [useLast3Months, setUseLast3Months] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [noRecordMessage, setNoRecordMessage] = useState<string | null>(null);

    useEffect(() => {
        if (useLast12Months && accountId) {
            fetchMonthData(Number(accountId), 12);
        } else if (useLast6Months && accountId) {
            fetchMonthData(Number(accountId), 6);
        } else if (useLast3Months && accountId) {
            fetchMonthData(Number(accountId), 3);
        }
    }, [useLast12Months, useLast6Months, useLast3Months, accountId]);

    useEffect(() => {
        if (!useLast12Months && !useLast6Months && !useLast3Months && accountId && fromDate && toDate) {
            fetchMoneyFlow(
                Number(accountId),
                fromDate.toISOString().split('T')[0],
                toDate.toISOString().split('T')[0],
                useLast12Months ? 1 : 0
            );
        }
    }, [fromDate, toDate, accountId, useLast12Months, useLast6Months, useLast3Months]);

    const handleStartChange = (date: Date | null) => {
        setFromDate(date);
        if (date || toDate || useLast12Months || useLast6Months || useLast3Months) {
            setErrorMessage(null);
        }
    };

    const handleEndChange = (date: Date | null) => {
        setToDate(date);
        if (fromDate || date || useLast12Months || useLast6Months || useLast3Months) {
            setErrorMessage(null);
        }
    };

    const handleCheckboxChange = () => {
        setUseLast12Months(!useLast12Months);
        setUseLast6Months(false);
        setUseLast3Months(false);
        setMoneyFlow(null);
        setMonth(null);
    };

    const handleCheckboxChangeSix = () => {
        setUseLast6Months(!useLast6Months);
        setUseLast12Months(false);
        setUseLast3Months(false);
        setMoneyFlow(null);
        setMonth(null);
    };

    const handleCheckboxChangeThree = () => {
        setUseLast3Months(!useLast3Months);
        setUseLast12Months(false);
        setUseLast6Months(false);
        setMoneyFlow(null);
        setMonth(null);
    };

    const fetchMonthData = async (accountId: number, months: number) => {
        try {
            const data = await MoneyFlowService.getMonth(accountId, months);
            if (!data || data.length === 0) {
                setNoRecordMessage('No Record for this month');
            } else {
                setMonth(data);
                setMoneyFlow(null);
                setNoRecordMessage(null);
            }
        } catch (error) {
            console.error('Error fetching month data:', error);
            setErrorMessage('Error fetching data. Please try again.');
        }
    };

    const fetchMoneyFlow = async (accountId: number, frmDate: string, toDate: string, useLast12Months: number) => {
        try {
            const data = await MoneyFlowService.getMoneyFlow(accountId, frmDate, toDate, useLast12Months);
            if (!data || data.length === 0) {
                setNoRecordMessage('No Record for this month');
            } else {
                setMoneyFlow(data);
                setMonth(null);
                setNoRecordMessage(null);
            }
        } catch (error) {
            console.error('Error fetching money flow data:', error);
            setErrorMessage('Error fetching data. Please try again.');
        }
    };

    const handleSubmit = () => {
        const id = accountId ? Number(accountId) : undefined;
        setErrorMessage(null);
        setNoRecordMessage(null);
        if (id === undefined) {
            setErrorMessage("Account ID is required.");
            return;
        }
        if (!fromDate && !toDate) {
            setErrorMessage("FromDate and ToDate is required !");
            return;
        }
        if (fromDate && toDate) {
            setUseLast12Months(false);
            setUseLast6Months(false);
            setUseLast3Months(false);
            fetchMoneyFlow(
                id,
                fromDate.toISOString().split('T')[0],
                toDate.toISOString().split('T')[0],
                0
            );
        } else if (useLast12Months) {
            fetchMonthData(id, 12);
        } else if (useLast6Months) {
            fetchMonthData(id, 6);
        } else if (useLast3Months) {
            fetchMonthData(id, 3);
        } else {
            setErrorMessage("FromDate and ToDate are required!");
        }
    };

    const chartYear = month && month.length > 0 && month[0]?.period
        ? new Date(month[0].period).getFullYear()
        : new Date().getFullYear();

    const chartData = {
        labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        datasets: [
            {
                label: 'Money In',
                data: Array(12).fill(0).map((_, index) => {
                    const monthData = month?.find((data: any) => new Date(data.period).getMonth() === index);
                    return monthData ? monthData.moneyIn : 0;
                }),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Money Out',
                data: Array(12).fill(0).map((_, index) => {
                    const monthData = month?.find((data: any) => new Date(data.period).getMonth() === index);
                    return monthData ? monthData.moneyOut : 0;
                }),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: 'Net Money Flow',
                data: Array(12).fill(0).map((_, index) => {
                    const monthData = month?.find((data: any) => new Date(data.period).getMonth() === index);
                    return monthData ? monthData.netMoneyFlow : 0;
                }),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
                    <Grid container spacing={1} alignItems="center" wrap="nowrap" style={{ backgroundColor: '#8080800f', display: 'flex', flexWrap: 'wrap' }}>
                        <Grid item container xs={4} sm={4} md={3} alignItems="center" spacing={1}>
                            <Grid item >
                                <Typography variant="h6" gutterBottom>From :</Typography>
                            </Grid>
                            <Grid item xs>
                                <DatePicker
                                    value={fromDate}
                                    onChange={handleStartChange}
                                    format="MMMM d, yyyy"
                                    minDate={new Date(1900, 0, 1)}
                                    maxDate={new Date(2100, 11, 31)}
                                    className="form-control Reportform-input-custom"
                                    sx={{
                                        '& .MuiInputBase-root': { height: '36px' },
                                        '& .MuiInputBase-input': { fontSize: 'small' },
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item container xs={4} sm={4} md={3} alignItems="center" spacing={1}>
                            <Grid item >
                                <Typography variant="h6" gutterBottom>To :</Typography>
                            </Grid>
                            <Grid item xs>
                                <DatePicker
                                    value={toDate}
                                    onChange={handleEndChange}
                                    format="MMMM d, yyyy"
                                    minDate={new Date(1900, 0, 1)}
                                    maxDate={new Date(2100, 11, 31)}
                                    className="form-control Reportform-input-custom"
                                    sx={{
                                        '& .MuiInputBase-root': { height: '36px' },
                                        '& .MuiInputBase-input': { fontSize: 'small' },
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={10} sm={6}>
                            <Button variant="contained" color="primary" startIcon={<SearchIcon />} onClick={handleSubmit}>
                                Submit
                            </Button>&nbsp;&nbsp;
                            <FormControlLabel
                                control={<Checkbox checked={useLast12Months} onChange={handleCheckboxChange} />}
                                label="Last 12 Months"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={useLast6Months} onChange={handleCheckboxChangeSix} />}
                                label="Last 6 Months"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={useLast3Months} onChange={handleCheckboxChangeThree} />}
                                label="Last 3 Months"
                            />
                        </Grid>
                    </Grid>

                    {errorMessage && (
                        <Typography color="error" sx={{ mt: 1, fontSize: '12px' }}>
                            {errorMessage}
                        </Typography>
                    )}

                    {noRecordMessage && (
                        <Typography color="error" sx={{ mt: 1, fontSize: '14px' }}>
                            {noRecordMessage}
                        </Typography>
                    )}

                    {month && month.length > 0 && (useLast6Months || useLast12Months || useLast3Months) && (
                        <TableContainer component={Paper}>
                            <Table size="small" style={{ marginTop: '1%' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Period</strong></TableCell>
                                        <TableCell><strong>Money In</strong></TableCell>
                                        <TableCell><strong>Money Out</strong></TableCell>
                                        <TableCell><strong>Net Money Flow</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {month.map((data: { period: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; moneyIn: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; moneyOut: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; netMoneyFlow: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                                        <TableRow key={index}>
                                            <TableCell>{data.period}</TableCell>
                                            <TableCell>{data.moneyIn}</TableCell>
                                            <TableCell>{data.moneyOut}</TableCell>
                                            <TableCell>{data.netMoneyFlow}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {moneyFlow && moneyFlow.length > 0 && !useLast12Months && !useLast6Months && !useLast3Months && (
                        <TableContainer component={Paper}>
                            <Table size="small" style={{ marginTop: '1%' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Period</strong></TableCell>
                                        <TableCell><strong>Money In</strong></TableCell>
                                        <TableCell><strong>Money Out</strong></TableCell>
                                        <TableCell><strong>Net Money Flow</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {moneyFlow.map((data: { period: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; moneyIn: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; moneyOut: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; netMoneyFlow: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                                        <TableRow key={index}>
                                            <TableCell>{data.period}</TableCell>
                                            <TableCell>{data.moneyIn}</TableCell>
                                            <TableCell>{data.moneyOut}</TableCell>
                                            <TableCell>{data.netMoneyFlow}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {month && month.length > 0 ? (
                        <Box sx={{ marginTop: 4, width: '50%', mb: '5%' }}>
                            <Typography variant="h6" gutterBottom>
                                Money Flow Chart
                            </Typography>
                            <Bar
                                data={chartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'top',
                                        },
                                        tooltip: {
                                            enabled: true,
                                        },
                                    },
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: `Period (${chartYear})`,
                                            },
                                        },
                                        y: {
                                            title: {
                                                display: true,
                                                text: 'Amount',
                                            },
                                            beginAtZero: true,
                                        },
                                    },
                                }}
                            />
                        </Box>
                    ) : (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {/* No data available for the selected period. */}
                        </Typography>
                    )}
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default MoneyFlow;