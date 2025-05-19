import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Snackbar, Alert, Checkbox } from '@mui/material';
import Header from '../../layouts/header/header';
import { useSelector } from 'react-redux';
import TaskAssignApiService from '../../data/services/taskAssign/taskAssign_api_service';
import CustomCheckbox from './CustomCheckbox';
import { TaskAssignBulkPayload } from '../../data/services/taskAssign/taskAssign_payload';
import Loader from '../loader/loader';

interface User {
    id: number;
    fullName: string;
}

interface BulkData {
    hitId: number;
    riskId: number;
    scenarioId: number;
    accHolderName: string;
    accnumber: string;
    amt: number;
    risk: string;
    scenario: string;
    created_at: string;
    transCount: number;
    createdBy: number;
    isTaskAssigned: number;
}

const TaskAssign = () => {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const uid = loginDetails?.id || '';
    const fullName = loginDetails?.fullName || '';
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [user, setUser] = useState<User[]>([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [bulkdata, setBulkData] = useState<BulkData[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const searchApi = new TaskAssignApiService();
    const [unassignedData, setUnassignedData] = useState<BulkData[]>([]);
    const taskAssignApiService = new TaskAssignApiService();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchUser();
        fetchAccountDetails();
        fetchAssignedDetails();
        getCombinedUnassignedData();
    }, []);

    useEffect(() => {
        setSelectAllChecked(selectedRows.size === unassignedData.length && unassignedData.length > 0);
    }, [selectedRows, unassignedData]);

    const fetchUser = async () => {
        try {
            const users = await searchApi.getadminuser();
            setUser(users);
        } catch (error) {
            console.error("Error fetching the fetchSanUser:", error);
        }
    };

    const fetchAccountDetails = async () => {
        try {
            const account = await searchApi.getAccountDetails();
            const filteredAccount = account.filter((item: BulkData) => item.isTaskAssigned === 0);
            setBulkData(filteredAccount);
        } catch (error) {
            console.error("Error fetching the fetchAccountDetails:", error);
        }
    };

    const fetchAssignedDetails = async () => {
        try {
            const account = await searchApi.getAssignedData();
            setBulkData(account);
        } catch (error) {
            console.error("Error fetching the fetchAccountDetails:", error);
        }
    };

    const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allIds = new Set(unassignedData.map(item => item.hitId));
            setSelectedRows(allIds);
        } else {
            setSelectedRows(new Set());
        }
        setSelectAllChecked(event.target.checked);
    };

    const handleRowCheckboxChange = (hitId: number) => {
        setSelectedRows(prevSelectedRows => {
            const updatedRows = new Set(prevSelectedRows);
            if (updatedRows.has(hitId)) {
                updatedRows.delete(hitId);
            } else {
                updatedRows.add(hitId);
            }
            return updatedRows;
        });
    };

    const handleUserChange = (event: SelectChangeEvent<string>) => {
        setSelectedUser(event.target.value as string);
    };

    const handleSubmit = async () => {
        console.log("Save button clicked");
        console.log("Selected User:", selectedUser);
        console.log("Selected Rows:", Array.from(selectedRows));
        if (selectedUser === '') {
            setSnackbarMessage('Please select a user to assign the task!');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }
        const selectedItems = unassignedData.filter((item) => selectedRows.has(item.hitId));
        console.log("Filtered Selected Items:", selectedItems);
        if (selectedItems.length === 0) {
            setSnackbarMessage('Please select at least one checkbox!');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }
        try {
            const tasks = selectedItems.map(item => {
                const payload: TaskAssignBulkPayload = {
                    assignTo: parseInt(selectedUser),
                    assignBy: uid,
                    accHolderName: item.accHolderName,
                    accountNumber: item.accnumber,
                    amount: item.amt,
                    riskId: item.riskId,
                    transCount: item.transCount,
                    hitId: item.hitId,
                    isTaskAssigned: 1,
                    euid: 1,
                    uid: uid,
                    scenarioId: item.scenarioId
                };
                return searchApi.CreateBulkTask(payload);
            });
            await Promise.all(tasks);
            setSnackbarMessage('Tasks assigned successfully!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            window.location.reload()
            fetchAccountDetails();
        } catch (error) {
            console.error('Error in creating bulk tasks:', error);
            setSnackbarMessage('Error in assigning tasks.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const getCombinedUnassignedData = async () => {
        try {
            setLoading(true);
            const [response1, response2] = await Promise.all([
                searchApi.getAccountDetails(),
                taskAssignApiService.getAssignedData(),
            ]);
            const data1 = Array.isArray(response1) ? response1 : [];
            const data2 = Array.isArray(response2) ? response2 : [];
            const combinedData = [...data1, ...data2];
            const assignedItems = new Set(
                combinedData
                    .filter(item => item.isTaskAssigned === 1)
                    .map(item => `${item.accHolderName}-${item.hitId}`)
            );
            const unassignedOnly = combinedData.filter(
                item => item.isTaskAssigned === 0 && !assignedItems.has(`${item.accHolderName}-${item.hitId}`)
            );
            console.log("CombinedData", combinedData);
            console.log("unassignedOnly", unassignedOnly);
            setUnassignedData(unassignedOnly);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatter = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 1, mt: 6, caretColor: 'transparent' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <Typography variant="h6" gutterBottom>ALERT MANAGER</Typography>
                </Box>

                <Box component="form" noValidate autoComplete="off">
                    <Grid container spacing={1} item xs={12}>
                        <Grid item xs={3}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel className='commonStyle'>Assign By</InputLabel>
                                <Select
                                    label="Assign By"
                                    value={fullName}
                                    className='check'
                                    size="small"
                                    fullWidth
                                >
                                    <MenuItem value={fullName} className='check'>{fullName}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel className='commonStyle'>Assign User</InputLabel>
                                <Select
                                    label="Assign User"
                                    value={selectedUser}
                                    className='check'
                                    size="small"
                                    fullWidth
                                    onChange={handleUserChange}
                                >
                                    {user.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            <span className='check'>{user.fullName}</span>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>

                {loading && <Loader />}
                <TableContainer
                    component={Paper}
                    sx={{
                        mt: 2,
                        padding: '1px',
                        boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                        maxHeight: '340px',
                        overflowY: 'auto',
                        borderRadius: '8px',
                        width: '100%',
                        '@media (max-width: 600px)': {
                            maxHeight: '200px',
                        },
                    }}
                >
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>
                                    <span style={{ position: 'sticky', top: '0', zIndex: 1 }}>
                                        <Checkbox
                                            checked={selectAllChecked}
                                            onChange={handleSelectAllChange}
                                            // sx={{ transform: "scale(0.8)" }}
                                            className="serial-cell"
                                        />
                                    </span>S.No
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>AccountName</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>AccountNumber</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'lightgray', textAlign: 'right' }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>Risk Level</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>Scenario</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>TransCount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {unassignedData.map((item, index) => (
                                <TableRow
                                    key={item.hitId}
                                    sx={{
                                        height: '30px',
                                        '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                                        '&:nth-of-type(even)': { backgroundColor: 'white' },
                                        '@media (max-width: 600px)': {
                                            height: '25px',
                                        },
                                        '&:hover': { backgroundColor: '#f1f1f1' },
                                        cursor: 'pointer',
                                    }}
                                >
                                    <TableCell>
                                        <Box className="serial-cell">
                                            <CustomCheckbox
                                                checked={selectedRows.has(item.hitId)}
                                                onChange={() => handleRowCheckboxChange(item.hitId)}
                                                label={`${index + 1}`}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{
                                        color: '#3F51B5', textDecoration: 'underline',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {item.accHolderName}
                                    </TableCell>
                                    <TableCell>{item.accnumber}</TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>{item.amt != null ? formatter.format(item.amt) : 'Not Available'}</TableCell>
                                    <TableCell>{item.risk}</TableCell>
                                    <TableCell>{item.scenario}</TableCell>
                                    <TableCell>{item.transCount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <br></br>
                <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Save
                    </Button>
                </Box>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={() => setOpenSnackbar(false)}
                        severity={snackbarSeverity}
                        sx={{ width: '100%' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

            </Box>
        </Box>
    )
}

export default TaskAssign;