
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
import SourceOfFundApiService from '../../data/services/transaction/sourceOfFund/sourceOfFund_api_services';

const Channel: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [SourceOfFundName, setSourceOfFundName] = useState('');
    const [SourceOfFundCode, setSourceOfFundCode] = useState('');
    const [SourceOfFunds, setSourceOfFunds] = useState<any[]>([]);
    const [blockedSourceOfFunds, setBlockedSourceOfFunds] = useState<any[]>([]);
    const [editingSourceOfFunds, setEditingSourceOfFunds] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedSourceOfFunds, setSelectedSourceOfFunds] = useState<any | null>(null);
    const [blockedSourceOfFundsDialogOpen, setBlockedSourceOfFundsDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const sourceOfFundservice = new SourceOfFundApiService();

    useEffect(() => {
        fetchSourceOfFunds();
        fetchBlockedSourceOfFunds()
    }, []);

    const fetchSourceOfFunds = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await sourceOfFundservice.getActiveSourceOfFund();
            const activeSourceOfFunds = channel.filter((c: any) => !c.isBlocked);
            setSourceOfFunds(activeSourceOfFunds);
        } catch (error) {
            console.error('Error fetching SourceOfFunds:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchBlockedSourceOfFunds = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await sourceOfFundservice.getDeactiveSourceOfFund();
            setBlockedSourceOfFunds(response);
        } catch (error) {
            console.error('Error fetching blocked SourceOfFunds:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: SourceOfFundName, code: SourceOfFundCode, uid: loginDetails.id ,euid:'1'};
        try {
          if (editingSourceOfFunds !== null) {
            await sourceOfFundservice.updateSourceOfFund(editingSourceOfFunds, payload);
            setEditingSourceOfFunds(null);
            setSuccessMessage('SourceOfFund updated successfully!');
          } else {
            await sourceOfFundservice.CreateSourceOfFund(payload);
            setSuccessMessage('SourceOfFund added successfully!');
          }
          setOpenSnackbar(true);
          setSourceOfFundName('');
          setSourceOfFundCode('');
          setDialogOpen(false);
          fetchSourceOfFunds();
        } catch (error) {
          console.error('Error saving SourceOfFund:', error);
          setErrorMessage('Error saving SourceOfFund.');
          setOpenSnackbar(true);
        }
      };

    const handleEdit = (channel: any) => {
        setSourceOfFundName(channel.name);
        setSourceOfFundCode(channel.code);
        setEditingSourceOfFunds(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedSourceOfFunds(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedSourceOfFunds !== null) {
          try {
            await sourceOfFundservice.blockSourceOfFund(selectedSourceOfFunds.id);
            setSourceOfFunds((prevSourceOfFunds) =>
              prevSourceOfFunds.filter((channel) => channel.id !== selectedSourceOfFunds.id)
            );
            setBlockedSourceOfFunds((prevBlocked) => [...prevBlocked, { ...selectedSourceOfFunds, isBlocked: true }]);
            setSuccessMessage(`SourceOfFund  blocked successfully!`);
            setSelectedSourceOfFunds(null);
            setConfirmBlockOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error blocking SourceOfFund:', error);
            setErrorMessage('Error blocking SourceOfFund.');
            setOpenSnackbar(true);
          }
        }
      };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedSourceOfFunds(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedSourceOfFunds !== null) {
          try {
            await sourceOfFundservice.unblockSourceOfFund(selectedSourceOfFunds.id);
            setBlockedSourceOfFunds((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedSourceOfFunds.id));
            setSourceOfFunds((prevSourceOfFunds) => [...prevSourceOfFunds, { ...selectedSourceOfFunds, isBlocked: false }]);
            setSuccessMessage(`SourceOfFund unblocked successfully!`);
            setSelectedSourceOfFunds(null);
            setConfirmUnblockOpen(false);
            setBlockedSourceOfFundsDialogOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error unblocking SourceOfFund:', error);
            setErrorMessage('Error unblocking SourceOfFund.');
            setOpenSnackbar(true);
          }
        }
      };

    const openDialog = () => {
        setSourceOfFundName('');
        setSourceOfFundCode('');
        setEditingSourceOfFunds(null);
        setDialogOpen(true);
    };

    const toggleBlockedSourceOfFunds = () => {
        setBlockedSourceOfFundsDialogOpen(true);
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
                    <h6 className='allheading'>SOURCE OF FUND </h6>
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
                            onClick={toggleBlockedSourceOfFunds}
                        >
                            Show Blocked
                        </Button>
                    </div>

                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={SourceOfFunds.length > 0 || blockedSourceOfFunds.length > 0}>
                    {SourceOfFunds.length === 0 ? (
                        <Typography className='confirmation-text'variant="body1" color="textSecondary">
                            No active SourceOfFunds available. Please add a new channel.
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
                                        {SourceOfFunds.map((channel: any, index: number) => (
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
                {/* Blocked SourceOfFunds Dialog */}
                <Dialog open={blockedSourceOfFundsDialogOpen} onClose={() => setBlockedSourceOfFundsDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked SourceOfFunds</DialogTitle>
                    <DialogContent>
                        {blockedSourceOfFunds.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked SourceOfFunds available.</Typography>
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
                                    {blockedSourceOfFunds.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedSourceOfFundsDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedSourceOfFunds && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the SourceOfFund "{selectedSourceOfFunds.name}" (Code: {selectedSourceOfFunds.code})?
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
                        {selectedSourceOfFunds && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the SourceOfFund "{selectedSourceOfFunds.name}" (Code: {selectedSourceOfFunds.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingSourceOfFunds !== null ? 'Edit SourceOfFund' : 'Add SourceOfFund'}</DialogTitle>
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
                                value={SourceOfFundName}
                                onChange={(e) => setSourceOfFundName(e.target.value)}
                            />

                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label=" Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={SourceOfFundCode}
                                onChange={(e) => setSourceOfFundCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingSourceOfFunds !== null ? 'Update' : 'Add'}
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
