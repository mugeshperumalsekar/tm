
import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card,
    Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography
} from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';

import { Snackbar, Alert } from '@mui/material';
import CKYCAddressTypeApiService from '../../data/services/customer/ckyc AddressType/ckycAddressType_api_services';

const Channel: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [CKYCAddressTypeName, setCKYCAddressTypeName] = useState('');
    const [CKYCAddressTypeCode, setCKYCAddressTypeCode] = useState('');
    const [CKYCAddressTypes, setCKYCAddressTypes] = useState<any[]>([]);
    const [blockedCKYCAddressTypes, setBlockedCKYCAddressTypes] = useState<any[]>([]);
    const [editingCKYCAddressTypes, setEditingCKYCAddressTypes] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedCKYCAddressTypes, setSelectedCKYCAddressTypes] = useState<any | null>(null);
    const [blockedCKYCAddressTypesDialogOpen, setBlockedCKYCAddressTypesDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const ckycAddressTypeservice = new CKYCAddressTypeApiService();

    useEffect(() => {
        fetchCKYCAddressTypes();
        fetchBlockedCKYCAddressTypes()
    }, []);

    const fetchCKYCAddressTypes = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await ckycAddressTypeservice.getActiveCKYCAddressType();
            const activeCKYCAddressTypes = channel.filter((c: any) => !c.isBlocked);
            setCKYCAddressTypes(activeCKYCAddressTypes);
        } catch (error) {
            console.error('Error fetching CKYCAddressTypes:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchBlockedCKYCAddressTypes = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await ckycAddressTypeservice.getDeactiveCKYCAddressType();
            setBlockedCKYCAddressTypes(response);
        } catch (error) {
            console.error('Error fetching blocked CKYCAddressTypes:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: CKYCAddressTypeName, code: CKYCAddressTypeCode, uid: loginDetails.id ,euid:'1'};
        try {
          if (editingCKYCAddressTypes !== null) {
            await ckycAddressTypeservice.updateCKYCAddressType(editingCKYCAddressTypes, payload);
            setEditingCKYCAddressTypes(null);
            setSuccessMessage('CKYCAddressType updated successfully!');
          } else {
            await ckycAddressTypeservice.CreateCKYCAddressType(payload);
            setSuccessMessage('CKYCAddressType added successfully!');
          }
          setOpenSnackbar(true);
          setCKYCAddressTypeName('');
          setCKYCAddressTypeCode('');
          setDialogOpen(false);
          fetchCKYCAddressTypes();
        } catch (error) {
          console.error('Error saving CKYCAddressType:', error);
          setErrorMessage('Error saving CKYCAddressType.');
          setOpenSnackbar(true);
        }
      };

    const handleEdit = (channel: any) => {
        setCKYCAddressTypeName(channel.name);
        setCKYCAddressTypeCode(channel.code);
        setEditingCKYCAddressTypes(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedCKYCAddressTypes(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedCKYCAddressTypes !== null) {
          try {
            await ckycAddressTypeservice.blockCKYCAddressType(selectedCKYCAddressTypes.id);
            setCKYCAddressTypes((prevCKYCAddressTypes) =>
              prevCKYCAddressTypes.filter((channel) => channel.id !== selectedCKYCAddressTypes.id)
            );
            setBlockedCKYCAddressTypes((prevBlocked) => [...prevBlocked, { ...selectedCKYCAddressTypes, isBlocked: true }]);
            setSuccessMessage(`CKYCAddressType  blocked successfully!`);
            setSelectedCKYCAddressTypes(null);
            setConfirmBlockOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error blocking CKYCAddressType:', error);
            setErrorMessage('Error blocking CKYCAddressType.');
            setOpenSnackbar(true);
          }
        }
      };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedCKYCAddressTypes(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedCKYCAddressTypes !== null) {
          try {
            await ckycAddressTypeservice.unblockCKYCAddressType(selectedCKYCAddressTypes.id);
            setBlockedCKYCAddressTypes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedCKYCAddressTypes.id));
            setCKYCAddressTypes((prevCKYCAddressTypes) => [...prevCKYCAddressTypes, { ...selectedCKYCAddressTypes, isBlocked: false }]);
            setSuccessMessage(`CKYCAddressType unblocked successfully!`);
            setSelectedCKYCAddressTypes(null);
            setConfirmUnblockOpen(false);
            setBlockedCKYCAddressTypesDialogOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error unblocking CKYCAddressType:', error);
            setErrorMessage('Error unblocking CKYCAddressType.');
            setOpenSnackbar(true);
          }
        }
      };

    const openDialog = () => {
        setCKYCAddressTypeName('');
        setCKYCAddressTypeCode('');
        setEditingCKYCAddressTypes(null);
        setDialogOpen(true);
    };

    const toggleBlockedCKYCAddressTypes = () => {
        setBlockedCKYCAddressTypesDialogOpen(true);
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
                    <h6 className='allheading'>CKYC ADDRESS TYPE  </h6>
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
                            onClick={toggleBlockedCKYCAddressTypes}
                        >
                            Show Blocked
                        </Button>
                    </div>

                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={CKYCAddressTypes.length > 0 || blockedCKYCAddressTypes.length > 0}>
                    {CKYCAddressTypes.length === 0 ? (
                        <Typography className='confirmation-text'variant="body1" color="textSecondary">
                            No active CKYCAddressTypes available. Please add a new channel.
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
                                        {CKYCAddressTypes.map((channel: any, index: number) => (
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
                {/* Blocked CKYCAddressTypes Dialog */}
                <Dialog open={blockedCKYCAddressTypesDialogOpen} onClose={() => setBlockedCKYCAddressTypesDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked CKYCAddressTypes</DialogTitle>
                    <DialogContent>
                        {blockedCKYCAddressTypes.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked CKYCAddressTypes available.</Typography>
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
                                    {blockedCKYCAddressTypes.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedCKYCAddressTypesDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedCKYCAddressTypes && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the CKYCAddressType "{selectedCKYCAddressTypes.name}" (Code: {selectedCKYCAddressTypes.code})?
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
                        {selectedCKYCAddressTypes && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the CKYCAddressType "{selectedCKYCAddressTypes.name}" (Code: {selectedCKYCAddressTypes.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingCKYCAddressTypes !== null ? 'Edit CKYCAddress' : 'Add CKYCAddress'}</DialogTitle>
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
                                value={CKYCAddressTypeName}
                                onChange={(e) => setCKYCAddressTypeName(e.target.value)}
                            />

                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label=" Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={CKYCAddressTypeCode}
                                onChange={(e) => setCKYCAddressTypeCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingCKYCAddressTypes !== null ? 'Update' : 'Add'}
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
