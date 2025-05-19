import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card, Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import OriginalCurrencyApiService from '../../data/services/transaction/originalCurrency/originalCurrency_api_services';

const Channel: React.FC = () => {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [OriginalCurrencyName, setOriginalCurrencyName] = useState('');
    const [OriginalCurrencyCode, setOriginalCurrencyCode] = useState('');
    const [OriginalCurrencys, setOriginalCurrencys] = useState<any[]>([]);
    const [blockedOriginalCurrencys, setBlockedOriginalCurrencys] = useState<any[]>([]);
    const [editingOriginalCurrencys, setEditingOriginalCurrencys] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedOriginalCurrencys, setSelectedOriginalCurrencys] = useState<any | null>(null);
    const [blockedOriginalCurrencysDialogOpen, setBlockedOriginalCurrencysDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const originalCurrencyservice = new OriginalCurrencyApiService();

    useEffect(() => {
        fetchOriginalCurrencys();
        fetchBlockedOriginalCurrencys()
    }, []);

    const fetchOriginalCurrencys = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await originalCurrencyservice.getActiveOriginalCurrency();
            const activeOriginalCurrencys = channel.filter((c: any) => !c.isBlocked);
            setOriginalCurrencys(activeOriginalCurrencys);
        } catch (error) {
            console.error('Error fetching OriginalCurrencys:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBlockedOriginalCurrencys = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await originalCurrencyservice.getDeactiveOriginalCurrency();
            setBlockedOriginalCurrencys(response);
        } catch (error) {
            console.error('Error fetching blocked OriginalCurrencys:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: OriginalCurrencyName, code: OriginalCurrencyCode, uid: loginDetails.id, euid: '1' };
        try {
            if (editingOriginalCurrencys !== null) {
                await originalCurrencyservice.updateOriginalCurrency(editingOriginalCurrencys, payload);
                setEditingOriginalCurrencys(null);
                setSuccessMessage('OriginalCurrency updated successfully!');
            } else {
                await originalCurrencyservice.CreateOriginalCurrency(payload);
                setSuccessMessage('OriginalCurrency added successfully!');
            }
            setOpenSnackbar(true);
            setOriginalCurrencyName('');
            setOriginalCurrencyCode('');
            setDialogOpen(false);
            fetchOriginalCurrencys();
        } catch (error) {
            console.error('Error saving OriginalCurrency:', error);
            setErrorMessage('Error saving OriginalCurrency.');
            setOpenSnackbar(true);
        }
    };

    const handleEdit = (channel: any) => {
        setOriginalCurrencyName(channel.name);
        setOriginalCurrencyCode(channel.code);
        setEditingOriginalCurrencys(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedOriginalCurrencys(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedOriginalCurrencys !== null) {
            try {
                await originalCurrencyservice.blockOriginalCurrency(selectedOriginalCurrencys.id);
                setOriginalCurrencys((prevOriginalCurrencys) =>
                    prevOriginalCurrencys.filter((channel) => channel.id !== selectedOriginalCurrencys.id)
                );
                setBlockedOriginalCurrencys((prevBlocked) => [...prevBlocked, { ...selectedOriginalCurrencys, isBlocked: true }]);
                setSuccessMessage(`OriginalCurrency  blocked successfully!`);
                setSelectedOriginalCurrencys(null);
                setConfirmBlockOpen(false);
                setOpenSnackbar(true);
            } catch (error) {
                console.error('Error blocking OriginalCurrency:', error);
                setErrorMessage('Error blocking OriginalCurrency.');
                setOpenSnackbar(true);
            }
        }
    };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedOriginalCurrencys(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedOriginalCurrencys !== null) {
            try {
                await originalCurrencyservice.unblockOriginalCurrency(selectedOriginalCurrencys.id);
                setBlockedOriginalCurrencys((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedOriginalCurrencys.id));
                setOriginalCurrencys((prevOriginalCurrencys) => [...prevOriginalCurrencys, { ...selectedOriginalCurrencys, isBlocked: false }]);
                setSuccessMessage(`OriginalCurrency unblocked successfully!`);
                setSelectedOriginalCurrencys(null);
                setConfirmUnblockOpen(false);
                setBlockedOriginalCurrencysDialogOpen(false);
                setOpenSnackbar(true);
            } catch (error) {
                console.error('Error unblocking OriginalCurrency:', error);
                setErrorMessage('Error unblocking OriginalCurrency.');
                setOpenSnackbar(true);
            }
        }
    };

    const openDialog = () => {
        setOriginalCurrencyName('');
        setOriginalCurrencyCode('');
        setEditingOriginalCurrencys(null);
        setDialogOpen(true);
    };

    const toggleBlockedOriginalCurrencys = () => {
        setBlockedOriginalCurrencysDialogOpen(true);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
        setSuccessMessage('');
        setErrorMessage('');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h6 className='allheading'>ORGINAL CURRENCY </h6>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            className='MuiButton-root'
                            variant="contained"
                            color="primary"
                            onClick={openDialog}
                        >
                            Add New
                        </Button>
                        <Button
                            className='MuiButton-root'
                            variant="contained"
                            color="primary"
                            onClick={toggleBlockedOriginalCurrencys}
                        >
                            Show Blocked
                        </Button>
                    </div>
                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={OriginalCurrencys.length > 0 || blockedOriginalCurrencys.length > 0}>
                    {OriginalCurrencys.length === 0 ? (
                        <Typography className='confirmation-text' variant="body1" color="textSecondary">
                            No active OriginalCurrencys available. Please add a new channel.
                        </Typography>
                    ) : (
                        <>
                            <TableContainer
                                component={Card}
                                style={{
                                    maxHeight: '450px',
                                    overflow: 'auto',
                                }}
                            >
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="MuiTableCell-head"> S.No</TableCell>
                                            <TableCell className="MuiTableCell-head">Name</TableCell>
                                            <TableCell className="MuiTableCell-head">Code</TableCell>
                                            <TableCell className="MuiTableCell-head">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {OriginalCurrencys.map((channel: any, index: number) => (
                                            <TableRow key={channel.id}>
                                                <TableCell className="small-cell">{index + 1}</TableCell>
                                                <TableCell className="small-cell">{channel.name}</TableCell>
                                                <TableCell className="small-cell">{channel.code}</TableCell>
                                                <TableCell className="small-cell">
                                                    <IconButton onClick={() => handleBlockDialogOpen(channel)} >
                                                        <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleEdit(channel)} style={{ padding: '1px' }}>
                                                        <Edit style={{ fontSize: '16px', color: "#1968dd" }} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                </Loading>

                {/* Blocked OriginalCurrencys Dialog */}
                <Dialog open={blockedOriginalCurrencysDialogOpen} onClose={() => setBlockedOriginalCurrencysDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked OriginalCurrencys</DialogTitle>
                    <DialogContent>
                        {blockedOriginalCurrencys.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked OriginalCurrencys available.</Typography>
                        ) : (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="MuiTableCell-head"> S.No</TableCell>
                                        <TableCell className="MuiTableCell-head">Name</TableCell>
                                        <TableCell className="MuiTableCell-head">Code</TableCell>
                                        <TableCell className="MuiTableCell-head">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {blockedOriginalCurrencys.map((channel: any, index: number) => (
                                        <TableRow key={channel.id}>
                                            <TableCell className="small-cell">{index + 1}</TableCell>
                                            <TableCell className="small-cell">{channel.name}</TableCell>
                                            <TableCell className="small-cell">{channel.code}</TableCell>
                                            <TableCell className="small-cell">
                                                <IconButton onClick={() => handleUnblockDialogOpen(channel)}>
                                                    <Block style={{ fontSize: '16px', color: "red" }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setBlockedOriginalCurrencysDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedOriginalCurrencys && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the OriginalCurrency "{selectedOriginalCurrencys.name}" (Code: {selectedOriginalCurrencys.code})?
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleUnblockChannel} color="primary">
                            Unblock
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Block Confirmation Dialog */}
                <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
                    <DialogContent>
                        {selectedOriginalCurrencys && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the OriginalCurrency "{selectedOriginalCurrencys.name}" (Code: {selectedOriginalCurrencys.code})?
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleBlockChannel} color="primary">
                            Block
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Channel Edit Dialog */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
                    maxWidth="md">
                    <DialogTitle className="custom-dialog-title">{editingOriginalCurrencys !== null ? 'Edit OriginalCurrency' : 'Add OriginalCurrency'}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', gap: '3%' }}>
                            <TextField className="custom-textfield .MuiInputBase-root"
                                autoFocus
                                margin="dense"
                                label=" Name"
                                type="text"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                value={OriginalCurrencyName}
                                onChange={(e) => setOriginalCurrencyName(e.target.value)}
                            />
                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label=" Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={OriginalCurrencyCode}
                                onChange={(e) => setOriginalCurrencyCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingOriginalCurrencys !== null ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                {successMessage ? (
                    <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                        {successMessage}
                    </Alert>
                ) : (
                    <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                        {errorMessage}
                    </Alert>
                )}
            </Snackbar>

        </Box>
    );
};

export default Channel;