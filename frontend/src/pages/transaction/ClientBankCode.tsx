import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card, Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import ClientBankCodeApiService from '../../data/services/transaction/clientBankCode/clientBankCode_api_services';

const Channel: React.FC = () => {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [ClientBankCodeName, setClientBankCodeName] = useState('');
    const [ClientBankCodeCode, setClientBankCodeCode] = useState('');
    const [ClientBankCodes, setClientBankCodes] = useState<any[]>([]);
    const [blockedClientBankCodes, setBlockedClientBankCodes] = useState<any[]>([]);
    const [editingClientBankCodes, setEditingClientBankCodes] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedClientBankCodes, setSelectedClientBankCodes] = useState<any | null>(null);
    const [blockedClientBankCodesDialogOpen, setBlockedClientBankCodesDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const clientBankCodeservice = new ClientBankCodeApiService();

    useEffect(() => {
        fetchClientBankCodes();
        fetchBlockedClientBankCodes()
    }, []);

    const fetchClientBankCodes = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await clientBankCodeservice.getActiveClientBankCode();
            const activeClientBankCodes = channel.filter((c: any) => !c.isBlocked);
            setClientBankCodes(activeClientBankCodes);
        } catch (error) {
            console.error('Error fetching ClientBankCodes:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBlockedClientBankCodes = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await clientBankCodeservice.getDeactiveClientBankCode();
            setBlockedClientBankCodes(response);
        } catch (error) {
            console.error('Error fetching blocked ClientBankCodes:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: ClientBankCodeName, code: ClientBankCodeCode, uid: loginDetails.id, euid: '1' };
        try {
            if (editingClientBankCodes !== null) {
                await clientBankCodeservice.updateClientBankCode(editingClientBankCodes, payload);
                setEditingClientBankCodes(null);
                setSuccessMessage('ClientBankCode updated successfully!');
            } else {
                await clientBankCodeservice.CreateClientBankCode(payload);
                setSuccessMessage('ClientBankCode added successfully!');
            }
            setOpenSnackbar(true);
            setClientBankCodeName('');
            setClientBankCodeCode('');
            setDialogOpen(false);
            fetchClientBankCodes();
        } catch (error) {
            console.error('Error saving ClientBankCode:', error);
            setErrorMessage('Error saving ClientBankCode.');
            setOpenSnackbar(true);
        }
    };

    const handleEdit = (channel: any) => {
        setClientBankCodeName(channel.name);
        setClientBankCodeCode(channel.code);
        setEditingClientBankCodes(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedClientBankCodes(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedClientBankCodes !== null) {
            try {
                await clientBankCodeservice.blockClientBankCode(selectedClientBankCodes.id);
                setClientBankCodes((prevClientBankCodes) =>
                    prevClientBankCodes.filter((channel) => channel.id !== selectedClientBankCodes.id)
                );
                setBlockedClientBankCodes((prevBlocked) => [...prevBlocked, { ...selectedClientBankCodes, isBlocked: true }]);
                setSuccessMessage(`ClientBankCode  blocked successfully!`);
                setSelectedClientBankCodes(null);
                setConfirmBlockOpen(false);
                setOpenSnackbar(true);
            } catch (error) {
                console.error('Error blocking ClientBankCode:', error);
                setErrorMessage('Error blocking ClientBankCode.');
                setOpenSnackbar(true);
            }
        }
    };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedClientBankCodes(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedClientBankCodes !== null) {
            try {
                await clientBankCodeservice.unblockClientBankCode(selectedClientBankCodes.id);
                setBlockedClientBankCodes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedClientBankCodes.id));
                setClientBankCodes((prevClientBankCodes) => [...prevClientBankCodes, { ...selectedClientBankCodes, isBlocked: false }]);
                setSuccessMessage(`ClientBankCode unblocked successfully!`);
                setSelectedClientBankCodes(null);
                setConfirmUnblockOpen(false);
                setBlockedClientBankCodesDialogOpen(false);
                setOpenSnackbar(true);
            } catch (error) {
                console.error('Error unblocking ClientBankCode:', error);
                setErrorMessage('Error unblocking ClientBankCode.');
                setOpenSnackbar(true);
            }
        }
    };

    const openDialog = () => {
        setClientBankCodeName('');
        setClientBankCodeCode('');
        setEditingClientBankCodes(null);
        setDialogOpen(true);
    };

    const toggleBlockedClientBankCodes = () => {
        setBlockedClientBankCodesDialogOpen(true);
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
                    <h6 className='allheading'>CLIENT BANK CODE </h6>
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
                            onClick={toggleBlockedClientBankCodes}
                        >
                            Show Blocked
                        </Button>
                    </div>
                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={ClientBankCodes.length > 0 || blockedClientBankCodes.length > 0}>
                    {ClientBankCodes.length === 0 ? (
                        <Typography className='confirmation-text' variant="body1" color="textSecondary">
                            No active ClientBankCodes available. Please add a new channel.
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
                                        {ClientBankCodes.map((channel: any, index: number) => (
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

                {/* Blocked ClientBankCodes Dialog */}
                <Dialog open={blockedClientBankCodesDialogOpen} onClose={() => setBlockedClientBankCodesDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked ClientBankCodes</DialogTitle>
                    <DialogContent>
                        {blockedClientBankCodes.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked ClientBankCodes available.</Typography>
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
                                    {blockedClientBankCodes.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedClientBankCodesDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedClientBankCodes && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the ClientBankCode "{selectedClientBankCodes.name}" (Code: {selectedClientBankCodes.code})?
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
                        {selectedClientBankCodes && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the ClientBankCode "{selectedClientBankCodes.name}" (Code: {selectedClientBankCodes.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingClientBankCodes !== null ? 'Edit ClientBankCode' : 'Add ClientBankCode'}</DialogTitle>
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
                                value={ClientBankCodeName}
                                onChange={(e) => setClientBankCodeName(e.target.value)}
                            />
                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label=" Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={ClientBankCodeCode}
                                onChange={(e) => setClientBankCodeCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingClientBankCodes !== null ? 'Update' : 'Add'}
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