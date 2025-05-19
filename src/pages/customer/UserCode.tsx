import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card, Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import UserCodeApiService from '../../data/services/customer/userCode/userCode_api_services';

const Channel: React.FC = () => {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [UserCodeName, setUserCodeName] = useState('');
    const [UserCodeCode, setUserCodeCode] = useState('');
    const [UserCodes, setUserCodes] = useState<any[]>([]);
    const [blockedUserCodes, setBlockedUserCodes] = useState<any[]>([]);
    const [editingUserCodes, setEditingUserCodes] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedUserCodes, setSelectedUserCodes] = useState<any | null>(null);
    const [blockedUserCodesDialogOpen, setBlockedUserCodesDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const userCodeservice = new UserCodeApiService();

    useEffect(() => {
        fetchUserCodes();
        fetchBlockedUserCodes()
    }, []);

    const fetchUserCodes = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await userCodeservice.getUserCodes();
            const activeUserCodes = channel.filter((c: any) => !c.isBlocked);
            setUserCodes(activeUserCodes);
        } catch (error) {
            console.error('Error fetching UserCodes:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBlockedUserCodes = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await userCodeservice.getDeactiveUserCode();
            setBlockedUserCodes(response);
        } catch (error) {
            console.error('Error fetching blocked UserCodes:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: UserCodeName, code: UserCodeCode, uid: loginDetails.id, euid: '1' };
        try {
            if (editingUserCodes !== null) {
                await userCodeservice.updateUserCode(editingUserCodes, payload);
                setEditingUserCodes(null);
                setSuccessMessage('UserCode updated successfully!');
            } else {
                await userCodeservice.CreateUserCode(payload);
                setSuccessMessage('UserCode added successfully!');
            }
            setOpenSnackbar(true);
            setUserCodeName('');
            setUserCodeCode('');
            setDialogOpen(false);
            fetchUserCodes();
        } catch (error) {
            console.error('Error saving UserCode:', error);
            setErrorMessage('Error saving UserCode.');
            setOpenSnackbar(true);
        }
    };

    const handleEdit = (channel: any) => {
        setUserCodeName(channel.name);
        setUserCodeCode(channel.code);
        setEditingUserCodes(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedUserCodes(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedUserCodes !== null) {
            try {
                await userCodeservice.blockUserCode(selectedUserCodes.id);
                setUserCodes((prevUserCodes) =>
                    prevUserCodes.filter((channel) => channel.id !== selectedUserCodes.id)
                );
                setBlockedUserCodes((prevBlocked) => [...prevBlocked, { ...selectedUserCodes, isBlocked: true }]);
                setSuccessMessage(`UserCode  blocked successfully!`);
                setSelectedUserCodes(null);
                setConfirmBlockOpen(false);
                setOpenSnackbar(true);
            } catch (error) {
                console.error('Error blocking UserCode:', error);
                setErrorMessage('Error blocking UserCode.');
                setOpenSnackbar(true);
            }
        }
    };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedUserCodes(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedUserCodes !== null) {
            try {
                await userCodeservice.unblockUserCode(selectedUserCodes.id);
                setBlockedUserCodes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedUserCodes.id));
                setUserCodes((prevUserCodes) => [...prevUserCodes, { ...selectedUserCodes, isBlocked: false }]);
                setSuccessMessage(`UserCode unblocked successfully!`);
                setSelectedUserCodes(null);
                setConfirmUnblockOpen(false);
                setBlockedUserCodesDialogOpen(false);
                setOpenSnackbar(true);
            } catch (error) {
                console.error('Error unblocking UserCode:', error);
                setErrorMessage('Error unblocking UserCode.');
                setOpenSnackbar(true);
            }
        }
    };

    const openDialog = () => {
        setUserCodeName('');
        setUserCodeCode('');
        setEditingUserCodes(null);
        setDialogOpen(true);
    };

    const toggleBlockedUserCodes = () => {
        setBlockedUserCodesDialogOpen(true);
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
                    <h6 className='allheading'>USER CODE</h6>
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
                            onClick={toggleBlockedUserCodes}
                        >
                            Show Blocked
                        </Button>
                    </div>
                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={UserCodes.length > 0 || blockedUserCodes.length > 0}>
                    {UserCodes.length === 0 ? (
                        <Typography className='confirmation-text' variant="body1" color="textSecondary">
                            No active UserCodes available. Please add a new channel.
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
                                        {UserCodes.map((channel: any, index: number) => (
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
                {/* Blocked UserCodes Dialog */}
                <Dialog open={blockedUserCodesDialogOpen} onClose={() => setBlockedUserCodesDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked UserCodes</DialogTitle>
                    <DialogContent>
                        {blockedUserCodes.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked UserCodes available.</Typography>
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
                                    {blockedUserCodes.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedUserCodesDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedUserCodes && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the UserCode "{selectedUserCodes.name}" (Code: {selectedUserCodes.code})?
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
                        {selectedUserCodes && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the UserCode "{selectedUserCodes.name}" (Code: {selectedUserCodes.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingUserCodes !== null ? 'Edit UserCode' : 'Add UserCode'}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', gap: '3%' }}>
                            <TextField className="custom-textfield .MuiInputBase-root"
                                autoFocus
                                margin="dense"
                                label="UserCode Name"
                                type="text"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                value={UserCodeName}
                                onChange={(e) => setUserCodeName(e.target.value)}
                            />
                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label="UserCode Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={UserCodeCode}
                                onChange={(e) => setUserCodeCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingUserCodes !== null ? 'Update' : 'Add'}
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