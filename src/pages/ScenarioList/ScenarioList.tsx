import { useEffect, useState } from 'react';
import Header from '../../layouts/header/header';
import { Box, Grid, FormControl, InputLabel, MenuItem, Select, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, } from '@mui/material';
import ScenarioListApiService from '../../data/services/scenarioList/ScenarioList_api_service';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ScenariolistPayload } from '../../data/services/scenarioList/Scenariolist_payload';

interface ScenarioList {
    id: number;
    name: string;
    code: string;
    orderNo: number;
}

interface TransactionType {
    id: number;
    name: string;
    code: string;
}

interface TransactionPeriod {
    id: number;
    name: string;
    days: number;
}

const ScenarioList = () => {

    const [transactionType, setTransactionType] = useState<number | null>(null);
    const [period, setPeriod] = useState<number | null>(null);
    const [scenariolist, setScenarioList] = useState<number | null>(null);
    const [scenarioOptions, setScenarioOptions] = useState<ScenarioList[]>([]);
    const [transactionTypeOptions, setTransactionTypeOptions] = useState<TransactionType[]>([]);
    const [periodOptions, setPeriodOptions] = useState<TransactionPeriod[]>([]);
    const [includeCustomerType, setIncludeCustomerType] = useState(false);
    const [includeCustomerRisk, setIncludeCustomerRisk] = useState(false);
    const [includeCustomerSegment, setIncludeCustomerSegment] = useState(false);
    const [includeOccupationType, setIncludeOccupationType] = useState(false);
    const [amount, setAmount] = useState<string>("");
    const [noOfTransaction, setNoOfTransaction] = useState<string>("");
    const [percentage, setPercentage] = useState<string>("");
    const [tableData, setTableData] = useState<any[]>([]);
    const scenarioListApi = new ScenarioListApiService();

    useEffect(() => {
        fetchScenarioList();
        fetchTransactionType();
        fetchTransactionPeriod();
    }, []);

    const fetchScenarioList = async () => {
        try {
            const users = await scenarioListApi.getScenarioList();
            setScenarioOptions(users);
        } catch (error) {
            console.error("Error fetching the scenario list:", error);
        }
    };

    const fetchTransactionType = async () => {
        try {
            const users = await scenarioListApi.getTransactionType();
            setTransactionTypeOptions(users);
        } catch (error) {
            console.error("Error fetching transaction types:", error);
        }
    };

    const fetchTransactionPeriod = async () => {
        try {
            const users = await scenarioListApi.getTransactionPeriod();
            setPeriodOptions(users);
        } catch (error) {
            console.error("Error fetching transaction periods:", error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await scenarioListApi.getScenarioData(
                includeCustomerType,
                includeCustomerRisk,
                includeCustomerSegment,
                includeOccupationType,
                transactionType
            );
            console.log('Raw API Response:', response);
            if (response && Array.isArray(response)) {
                const updatedData = response.map((row) => ({
                    ...row,
                    amount: amount || "",
                    noOfTransaction: noOfTransaction || "",
                    percentage: percentage || ""
                }));
                setTableData(updatedData);
            } else {
                console.error('API response is not an array:', response);
            }
        } catch (error) {
            console.error('Error fetching scenario data:', error);
        }
    };

    const handleSave = async () => {
        try {
            const transactionTypeMapping: { [key: number]: string } = {
                1: 'CASH',
                2: 'NONCASH',
            };
            const periodMapping: { [key: number]: string } = {
                1: 'ONE_MONTH',
                2: 'THREE_MONTH',
                3: 'SIX_MONTH',
                4: 'NINE MONTH',
                5: 'TWELVE_MONTH',
            };
            const transactionTypeString = transactionType != null ? transactionTypeMapping[transactionType] || '' : '';
            const periodString = period != null ? periodMapping[period] || '' : '';
            const payload: ScenariolistPayload = {
                transactionType: transactionTypeString,
                scenarioListId: scenariolist || 0,
                riskLevel: includeCustomerRisk ? 'true' : 'false',
                occupationType: includeOccupationType ? 'true' : 'false',
                segmentType: includeCustomerSegment ? 'true' : 'false',
                customerType: includeCustomerType ? 'true' : 'false',
                period: periodString,
                amount: [Number(tableData[0]?.amount) || 0],
                noOfTransaction: [Number(tableData[0]?.noOfTransaction) || 0],
                percentageValue: [Number(tableData[0]?.percentage) || 0],
                transaction_period_id: Number(period) || 0,
            };
            console.log('Payload to API:', payload);
            const response = await scenarioListApi.CreateScenarioList(payload);
            console.log('Save successful:', response);
            alert('Data saved successfully!');
        } catch (error: any) {
            console.error('Error saving data:', error);
            if (error.response) {
                console.error('Response Data:', error.response.data);
                console.error('Response Status:', error.response.status);
            }
            alert('Failed to save data. Please try again.');
        }
    };

    const handleInputChange = (index: number, field: string, value: string) => {
        setTableData((prevData) => {
            const newData = [...prevData];
            newData[index] = {
                ...newData[index],
                [field]: field === "noOfTransaction" ? parseInt(value.replace(/[^0-9]/g, ''), 10) || null : value.replace(/[^0-9]/g, ''),
            };
            return newData;
        });
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "search_results.xlsx");
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, mt: 5, p: 2 }}>
                <Box sx={{ mb: 4 }}>
                    <h6>SCENARIO LIST</h6>
                </Box>

                {/* Dropdowns in a single row */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel className='commonStyle'>Scenario List</InputLabel>
                            <Select
                                label="Scenario List"
                                value={scenariolist ?? ""}
                                onChange={(e) => setScenarioList(Number(e.target.value))}
                                size="small"
                                className='check'
                            >
                                {scenarioOptions.map((scenario) => (
                                    <MenuItem key={scenario.id} value={scenario.id}>
                                        <span className='check'>{scenario.name}</span>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel className='commonStyle'>Transaction Type</InputLabel>
                            <Select
                                label="Transaction Type"
                                value={transactionType ?? ""}
                                onChange={(e) => setTransactionType(Number(e.target.value))}
                                size="small"
                                className='check'
                            >
                                {transactionTypeOptions.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        <span className='check'>{type.name}</span>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel className='commonStyle' >Period</InputLabel>
                            <Select
                                label="Period"
                                value={period ?? ""}
                                onChange={(e) => setPeriod(Number(e.target.value))}
                                size="small"
                                className='check'
                            >
                                {periodOptions.map((period) => (
                                    <MenuItem key={period.id} value={period.id}>
                                        <span className='check'>{period.name}</span>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container sx={{ mb: 4, alignItems: 'center', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {/* Checkboxes Section */}
                    <Grid item sx={{ display: 'flex', gap: '8px' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={includeCustomerType}
                                    onChange={(e) => setIncludeCustomerType(e.target.checked)}
                                />
                            }
                            label="Customer Type"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={includeCustomerRisk}
                                    onChange={(e) => setIncludeCustomerRisk(e.target.checked)}
                                />
                            }
                            label="Risk Level"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={includeCustomerSegment}
                                    onChange={(e) => setIncludeCustomerSegment(e.target.checked)}
                                />
                            }
                            label="Segment Type"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={includeOccupationType}
                                    onChange={(e) => setIncludeOccupationType(e.target.checked)}
                                />
                            }
                            label="Occupation Type"
                        />
                    </Grid>

                    {/* TextField Section */}
                    <Grid item sx={{ display: 'flex', gap: '8px' }}>
                        <TextField
                            label="Amount"
                            type="number"
                            variant="outlined"
                            size="small"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className='check'
                        />
                        <TextField
                            label="No. of Transactions"
                            type="number"
                            variant="outlined"
                            size="small"
                            value={noOfTransaction}
                            onChange={(e) => setNoOfTransaction(e.target.value)}
                        />
                        <TextField
                            label="Percentage"
                            type="number"
                            variant="outlined"
                            size="small"
                            value={percentage}
                            onChange={(e) => setPercentage(e.target.value)}
                        />
                    </Grid>

                    {/* Buttons Section */}
                    <Grid item sx={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                        <Button variant="contained" color="primary" onClick={handleSearch} sx={{ minWidth: '100px' }}>
                            Search
                        </Button>
                        <Button
                            variant="contained"
                            disabled={tableData.length === 0}
                            onClick={exportToExcel}
                            sx={{ padding: '8px 16px' }}
                        >
                            <FileDownloadIcon />
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} style={{ maxHeight: '320px', marginTop: '-2%' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align='center'>Transaction Type</TableCell>
                                <TableCell align='center'>Customer Type</TableCell>
                                <TableCell align='center'>Risk Level</TableCell>
                                <TableCell align='center'>Segment</TableCell>
                                <TableCell align='center'>Occupation</TableCell>
                                <TableCell align='center'>Period</TableCell>
                                <TableCell align='center'>Amount</TableCell>
                                <TableCell align='center'>No of Transaction</TableCell>
                                <TableCell align='center'>Percentage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{row.transactionType || 'N/A'}</TableCell>
                                    <TableCell align="center">{row.customerType || 'N/A'}</TableCell>
                                    <TableCell align="center">{row.riskLevel || 'N/A'}</TableCell>
                                    <TableCell align="center">{row.segmentType || 'N/A'}</TableCell>
                                    <TableCell align="center">{row.occupationType || 'N/A'}</TableCell>
                                    <TableCell align="center">{row.period || 'N/A'}</TableCell>
                                    {/* <TableCell align="center">
                                        <input
                                            type="text"
                                            placeholder="Enter Amount"
                                            style={{ width: '100%' }}
                                            value={tableData[index]?.amount || ""}
                                            onInput={(e) => {
                                                const input = e.target as HTMLInputElement;
                                                input.value = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                                            }}
                                            onChange={(e) => handleInputChange(index, "amount", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <input
                                            type="text"
                                            placeholder="Enter Transactions"
                                            style={{ width: '100%' }}
                                            value={tableData[index]?.noOfTransaction || ""}
                                            onInput={(e) => {
                                                const input = e.target as HTMLInputElement;
                                                input.value = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                                            }}
                                            onChange={(e) => handleInputChange(index, "noOfTransaction", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <input
                                            type="text"
                                            placeholder="Enter Percentage"
                                            style={{ width: '100%' }}
                                            value={tableData[index]?.percentage || ""}
                                            onInput={(e) => {
                                                const input = e.target as HTMLInputElement;
                                                input.value = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                                            }}
                                            onChange={(e) => handleInputChange(index, "percentage", e.target.value)}
                                        />
                                    </TableCell> */}
                                    <TableCell align="center">
                                        <input
                                            type="text"
                                            placeholder="Enter Amount"
                                            style={{ width: '100%' }}
                                            value={tableData[index]?.amount || ""}
                                            onChange={(e) => handleInputChange(index, "amount", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <input
                                            type="text"
                                            placeholder="Enter Transactions"
                                            style={{ width: '100%' }}
                                            value={tableData[index]?.noOfTransaction || ""}
                                            onChange={(e) => handleInputChange(index, "noOfTransaction", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <input
                                            type="text"
                                            placeholder="Enter Percentage"
                                            style={{ width: '100%' }}
                                            value={tableData[index]?.percentage || ""}
                                            onChange={(e) => handleInputChange(index, "percentage", e.target.value)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1%' }}>
                    {tableData.length > 0 && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                        >
                            SAVE
                        </Button>
                    )}
                </Grid>
            </Box>
        </Box >
    );
};

export default ScenarioList;