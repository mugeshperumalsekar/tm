
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
import TransactionProductAccountTypeApiService from '../../data/services/transaction/transactionProductAccountType/transactionProductAccountType_api_services';

const Channel: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [TransactionProductAccountTypeName, setTransactionProductAccountTypeName] = useState('');
    const [TransactionProductAccountTypeCode, setTransactionProductAccountTypeCode] = useState('');
    const [TransactionProductAccountTypes, setTransactionProductAccountTypes] = useState<any[]>([]);
    const [blockedTransactionProductAccountTypes, setBlockedTransactionProductAccountTypes] = useState<any[]>([]);
    const [editingTransactionProductAccountTypes, setEditingTransactionProductAccountTypes] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedTransactionProductAccountTypes, setSelectedTransactionProductAccountTypes] = useState<any | null>(null);
    const [blockedTransactionProductAccountTypesDialogOpen, setBlockedTransactionProductAccountTypesDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const transactionProductAccountTypeservice = new TransactionProductAccountTypeApiService();

    useEffect(() => {
        fetchTransactionProductAccountTypes();
        fetchBlockedTransactionProductAccountTypes()
    }, []);

    const fetchTransactionProductAccountTypes = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await transactionProductAccountTypeservice.getActiveTransactionProductAccountType();
            const activeTransactionProductAccountTypes = channel.filter((c: any) => !c.isBlocked);
            setTransactionProductAccountTypes(activeTransactionProductAccountTypes);
        } catch (error) {
            console.error('Error fetching TransactionProductAccountTypes:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchBlockedTransactionProductAccountTypes = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await transactionProductAccountTypeservice.getDeactiveTransactionProductAccountType();
            setBlockedTransactionProductAccountTypes(response);
        } catch (error) {
            console.error('Error fetching blocked TransactionProductAccountTypes:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: TransactionProductAccountTypeName, code: TransactionProductAccountTypeCode, uid: loginDetails.id ,euid:'1'};
        try {
          if (editingTransactionProductAccountTypes !== null) {
            await transactionProductAccountTypeservice.updateTransactionProductAccountType(editingTransactionProductAccountTypes, payload);
            setEditingTransactionProductAccountTypes(null);
            setSuccessMessage('TransactionProductAccountType updated successfully!');
          } else {
            await transactionProductAccountTypeservice.CreateTransactionProductAccountType(payload);
            setSuccessMessage('TransactionProductAccountType added successfully!');
          }
          setOpenSnackbar(true);
          setTransactionProductAccountTypeName('');
          setTransactionProductAccountTypeCode('');
          setDialogOpen(false);
          fetchTransactionProductAccountTypes();
        } catch (error) {
          console.error('Error saving TransactionProductAccountType:', error);
          setErrorMessage('Error saving TransactionProductAccountType.');
          setOpenSnackbar(true);
        }
      };

    const handleEdit = (channel: any) => {
        setTransactionProductAccountTypeName(channel.name);
        setTransactionProductAccountTypeCode(channel.code);
        setEditingTransactionProductAccountTypes(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedTransactionProductAccountTypes(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedTransactionProductAccountTypes !== null) {
          try {
            await transactionProductAccountTypeservice.blockTransactionProductAccountType(selectedTransactionProductAccountTypes.id);
            setTransactionProductAccountTypes((prevTransactionProductAccountTypes) =>
              prevTransactionProductAccountTypes.filter((channel) => channel.id !== selectedTransactionProductAccountTypes.id)
            );
            setBlockedTransactionProductAccountTypes((prevBlocked) => [...prevBlocked, { ...selectedTransactionProductAccountTypes, isBlocked: true }]);
            setSuccessMessage(`TransactionProductAccountType  blocked successfully!`);
            setSelectedTransactionProductAccountTypes(null);
            setConfirmBlockOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error blocking TransactionProductAccountType:', error);
            setErrorMessage('Error blocking TransactionProductAccountType.');
            setOpenSnackbar(true);
          }
        }
      };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedTransactionProductAccountTypes(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedTransactionProductAccountTypes !== null) {
          try {
            await transactionProductAccountTypeservice.unblockTransactionProductAccountType(selectedTransactionProductAccountTypes.id);
            setBlockedTransactionProductAccountTypes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedTransactionProductAccountTypes.id));
            setTransactionProductAccountTypes((prevTransactionProductAccountTypes) => [...prevTransactionProductAccountTypes, { ...selectedTransactionProductAccountTypes, isBlocked: false }]);
            setSuccessMessage(`TransactionProductAccountType unblocked successfully!`);
            setSelectedTransactionProductAccountTypes(null);
            setConfirmUnblockOpen(false);
            setBlockedTransactionProductAccountTypesDialogOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error unblocking TransactionProductAccountType:', error);
            setErrorMessage('Error unblocking TransactionProductAccountType.');
            setOpenSnackbar(true);
          }
        }
      };

    const openDialog = () => {
        setTransactionProductAccountTypeName('');
        setTransactionProductAccountTypeCode('');
        setEditingTransactionProductAccountTypes(null);
        setDialogOpen(true);
    };

    const toggleBlockedTransactionProductAccountTypes = () => {
        setBlockedTransactionProductAccountTypesDialogOpen(true);
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
                    <h6 className='allheading'>TRANSACTION INSTRUMENT TYPE </h6>
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
                            onClick={toggleBlockedTransactionProductAccountTypes}
                        >
                            Show Blocked
                        </Button>
                    </div>

                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={TransactionProductAccountTypes.length > 0 || blockedTransactionProductAccountTypes.length > 0}>
                    {TransactionProductAccountTypes.length === 0 ? (
                        <Typography className='confirmation-text'variant="body1" color="textSecondary">
                            No active TransactionProductAccountTypes available. Please add a new channel.
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
                                        {TransactionProductAccountTypes.map((channel: any, index: number) => (
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
                {/* Blocked TransactionProductAccountTypes Dialog */}
                <Dialog open={blockedTransactionProductAccountTypesDialogOpen} onClose={() => setBlockedTransactionProductAccountTypesDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked TransactionProductAccountTypes</DialogTitle>
                    <DialogContent>
                        {blockedTransactionProductAccountTypes.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked TransactionProductAccountTypes available.</Typography>
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
                                    {blockedTransactionProductAccountTypes.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedTransactionProductAccountTypesDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedTransactionProductAccountTypes && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the TransactionProductAccountType "{selectedTransactionProductAccountTypes.name}" (Code: {selectedTransactionProductAccountTypes.code})?
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
                        {selectedTransactionProductAccountTypes && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the TransactionProductAccountType "{selectedTransactionProductAccountTypes.name}" (Code: {selectedTransactionProductAccountTypes.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingTransactionProductAccountTypes !== null ? 'Edit TransactionProductAccountType' : 'Add TransactionProductAccountType'}</DialogTitle>
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
                                value={TransactionProductAccountTypeName}
                                onChange={(e) => setTransactionProductAccountTypeName(e.target.value)}
                            />

                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label=" Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={TransactionProductAccountTypeCode}
                                onChange={(e) => setTransactionProductAccountTypeCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingTransactionProductAccountTypes !== null ? 'Update' : 'Add'}
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
