
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
import CorrespondenceAddressProofApiService from '../../data/services/customer/correspondenceAddressProof/correspondenceAddressProof_api_services';

const Channel: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [CorrespondenceAddressProofName, setCorrespondenceAddressProofName] = useState('');
    const [CorrespondenceAddressProofCode, setCorrespondenceAddressProofCode] = useState('');
    const [CorrespondenceAddressProofs, setCorrespondenceAddressProofs] = useState<any[]>([]);
    const [blockedCorrespondenceAddressProofs, setBlockedCorrespondenceAddressProofs] = useState<any[]>([]);
    const [editingCorrespondenceAddressProofs, setEditingCorrespondenceAddressProofs] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedCorrespondenceAddressProofs, setSelectedCorrespondenceAddressProofs] = useState<any | null>(null);
    const [blockedCorrespondenceAddressProofsDialogOpen, setBlockedCorrespondenceAddressProofsDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const correspondenceAddressProofservice = new CorrespondenceAddressProofApiService();

    useEffect(() => {
        fetchCorrespondenceAddressProofs();
        fetchBlockedCorrespondenceAddressProofs()
    }, []);

    const fetchCorrespondenceAddressProofs = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await correspondenceAddressProofservice.getActiveCorrespondenceAddressProof();
            const activeCorrespondenceAddressProofs = channel.filter((c: any) => !c.isBlocked);
            setCorrespondenceAddressProofs(activeCorrespondenceAddressProofs);
        } catch (error) {
            console.error('Error fetching CorrespondenceAddressProofs:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchBlockedCorrespondenceAddressProofs = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await correspondenceAddressProofservice.getDeactiveCorrespondenceAddressProof();
            setBlockedCorrespondenceAddressProofs(response);
        } catch (error) {
            console.error('Error fetching blocked CorrespondenceAddressProofs:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: CorrespondenceAddressProofName, code: CorrespondenceAddressProofCode, uid: loginDetails.id ,euid:'1'};
        try {
          if (editingCorrespondenceAddressProofs !== null) {
            await correspondenceAddressProofservice.updateCorrespondenceAddressProof(editingCorrespondenceAddressProofs, payload);
            setEditingCorrespondenceAddressProofs(null);
            setSuccessMessage('CorrespondenceAddressProof updated successfully!');
          } else {
            await correspondenceAddressProofservice.CreateCorrespondenceAddressProof(payload);
            setSuccessMessage('CorrespondenceAddressProof added successfully!');
          }
          setOpenSnackbar(true);
          setCorrespondenceAddressProofName('');
          setCorrespondenceAddressProofCode('');
          setDialogOpen(false);
          fetchCorrespondenceAddressProofs();
        } catch (error) {
          console.error('Error saving CorrespondenceAddressProof:', error);
          setErrorMessage('Error saving CorrespondenceAddressProof.');
          setOpenSnackbar(true);
        }
      };

    const handleEdit = (channel: any) => {
        setCorrespondenceAddressProofName(channel.name);
        setCorrespondenceAddressProofCode(channel.code);
        setEditingCorrespondenceAddressProofs(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedCorrespondenceAddressProofs(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedCorrespondenceAddressProofs !== null) {
          try {
            await correspondenceAddressProofservice.blockCorrespondenceAddressProof(selectedCorrespondenceAddressProofs.id);
            setCorrespondenceAddressProofs((prevCorrespondenceAddressProofs) =>
              prevCorrespondenceAddressProofs.filter((channel) => channel.id !== selectedCorrespondenceAddressProofs.id)
            );
            setBlockedCorrespondenceAddressProofs((prevBlocked) => [...prevBlocked, { ...selectedCorrespondenceAddressProofs, isBlocked: true }]);
            setSuccessMessage(`CorrespondenceAddressProof  blocked successfully!`);
            setSelectedCorrespondenceAddressProofs(null);
            setConfirmBlockOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error blocking CorrespondenceAddressProof:', error);
            setErrorMessage('Error blocking CorrespondenceAddressProof.');
            setOpenSnackbar(true);
          }
        }
      };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedCorrespondenceAddressProofs(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedCorrespondenceAddressProofs !== null) {
          try {
            await correspondenceAddressProofservice.unblockCorrespondenceAddressProof(selectedCorrespondenceAddressProofs.id);
            setBlockedCorrespondenceAddressProofs((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedCorrespondenceAddressProofs.id));
            setCorrespondenceAddressProofs((prevCorrespondenceAddressProofs) => [...prevCorrespondenceAddressProofs, { ...selectedCorrespondenceAddressProofs, isBlocked: false }]);
            setSuccessMessage(`CorrespondenceAddressProof unblocked successfully!`);
            setSelectedCorrespondenceAddressProofs(null);
            setConfirmUnblockOpen(false);
            setBlockedCorrespondenceAddressProofsDialogOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error unblocking CorrespondenceAddressProof:', error);
            setErrorMessage('Error unblocking CorrespondenceAddressProof.');
            setOpenSnackbar(true);
          }
        }
      };

    const openDialog = () => {
        setCorrespondenceAddressProofName('');
        setCorrespondenceAddressProofCode('');
        setEditingCorrespondenceAddressProofs(null);
        setDialogOpen(true);
    };

    const toggleBlockedCorrespondenceAddressProofs = () => {
        setBlockedCorrespondenceAddressProofsDialogOpen(true);
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
                    <h6 className='allheading'>CorrespondenceAddressProof </h6>
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
                            onClick={toggleBlockedCorrespondenceAddressProofs}
                        >
                            Show Blocked
                        </Button>
                    </div>

                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={CorrespondenceAddressProofs.length > 0 || blockedCorrespondenceAddressProofs.length > 0}>
                    {CorrespondenceAddressProofs.length === 0 ? (
                        <Typography className='confirmation-text'variant="body1" color="textSecondary">
                            No active CorrespondenceAddressProofs available. Please add a new channel.
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
                                        {CorrespondenceAddressProofs.map((channel: any, index: number) => (
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
                {/* Blocked CorrespondenceAddressProofs Dialog */}
                <Dialog open={blockedCorrespondenceAddressProofsDialogOpen} onClose={() => setBlockedCorrespondenceAddressProofsDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked CorrespondenceAddressProofs</DialogTitle>
                    <DialogContent>
                        {blockedCorrespondenceAddressProofs.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked CorrespondenceAddressProofs available.</Typography>
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
                                    {blockedCorrespondenceAddressProofs.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedCorrespondenceAddressProofsDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedCorrespondenceAddressProofs && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the CorrespondenceAddressProof "{selectedCorrespondenceAddressProofs.name}" (Code: {selectedCorrespondenceAddressProofs.code})?
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
                        {selectedCorrespondenceAddressProofs && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the CorrespondenceAddressProof "{selectedCorrespondenceAddressProofs.name}" (Code: {selectedCorrespondenceAddressProofs.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingCorrespondenceAddressProofs !== null ? 'Edit CorrespondenceAddress' : 'Add CorrespondenceAddress'}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', gap: '3%' }}>
                            <TextField className="custom-textfield .MuiInputBase-root"
                                autoFocus
                                margin="dense"
                                label="ChannCorrespondenceAddress Name"
                                type="text"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                value={CorrespondenceAddressProofName}
                                onChange={(e) => setCorrespondenceAddressProofName(e.target.value)}
                            />

                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label="CorrespondenceAddress Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={CorrespondenceAddressProofCode}
                                onChange={(e) => setCorrespondenceAddressProofCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingCorrespondenceAddressProofs !== null ? 'Update' : 'Add'}
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
