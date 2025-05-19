
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
import PermanentAddressApiService from '../../data/services/customer/permanentAddressProof/permanentAddress_api_services';

const Channel: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [PermanentAddressName, setPermanentAddressName] = useState('');
    const [PermanentAddressCode, setPermanentAddressCode] = useState('');
    const [PermanentAddresss, setPermanentAddresss] = useState<any[]>([]);
    const [blockedPermanentAddresss, setBlockedPermanentAddresss] = useState<any[]>([]);
    const [editingPermanentAddresss, setEditingPermanentAddresss] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedPermanentAddresss, setSelectedPermanentAddresss] = useState<any | null>(null);
    const [blockedPermanentAddresssDialogOpen, setBlockedPermanentAddresssDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const permanentAddressservice = new PermanentAddressApiService();

    useEffect(() => {
        fetchPermanentAddresss();
        fetchBlockedPermanentAddresss()
    }, []);

    const fetchPermanentAddresss = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await permanentAddressservice.getPermanentAddresss();
            const activePermanentAddresss = channel.filter((c: any) => !c.isBlocked);
            setPermanentAddresss(activePermanentAddresss);
        } catch (error) {
            console.error('Error fetching PermanentAddresss:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchBlockedPermanentAddresss = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await permanentAddressservice.getDeactivePermanentAddress();
            setBlockedPermanentAddresss(response);
        } catch (error) {
            console.error('Error fetching blocked PermanentAddresss:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: PermanentAddressName, code: PermanentAddressCode, uid: loginDetails.id ,euid:'1'};
        try {
          if (editingPermanentAddresss !== null) {
            await permanentAddressservice.updatePermanentAddress(editingPermanentAddresss, payload);
            setEditingPermanentAddresss(null);
            setSuccessMessage('PermanentAddress updated successfully!');
          } else {
            await permanentAddressservice.CreatePermanentAddress(payload);
            setSuccessMessage('PermanentAddress added successfully!');
          }
          setOpenSnackbar(true);
          setPermanentAddressName('');
          setPermanentAddressCode('');
          setDialogOpen(false);
          fetchPermanentAddresss();
        } catch (error) {
          console.error('Error saving PermanentAddress:', error);
          setErrorMessage('Error saving PermanentAddress.');
          setOpenSnackbar(true);
        }
      };

    const handleEdit = (channel: any) => {
        setPermanentAddressName(channel.name);
        setPermanentAddressCode(channel.code);
        setEditingPermanentAddresss(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedPermanentAddresss(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedPermanentAddresss !== null) {
          try {
            await permanentAddressservice.blockPermanentAddress(selectedPermanentAddresss.id);
            setPermanentAddresss((prevPermanentAddresss) =>
              prevPermanentAddresss.filter((channel) => channel.id !== selectedPermanentAddresss.id)
            );
            setBlockedPermanentAddresss((prevBlocked) => [...prevBlocked, { ...selectedPermanentAddresss, isBlocked: true }]);
            setSuccessMessage(`PermanentAddress  blocked successfully!`);
            setSelectedPermanentAddresss(null);
            setConfirmBlockOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error blocking PermanentAddress:', error);
            setErrorMessage('Error blocking PermanentAddress.');
            setOpenSnackbar(true);
          }
        }
      };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedPermanentAddresss(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedPermanentAddresss !== null) {
          try {
            await permanentAddressservice.unblockPermanentAddress(selectedPermanentAddresss.id);
            setBlockedPermanentAddresss((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedPermanentAddresss.id));
            setPermanentAddresss((prevPermanentAddresss) => [...prevPermanentAddresss, { ...selectedPermanentAddresss, isBlocked: false }]);
            setSuccessMessage(`PermanentAddress unblocked successfully!`);
            setSelectedPermanentAddresss(null);
            setConfirmUnblockOpen(false);
            setBlockedPermanentAddresssDialogOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error unblocking PermanentAddress:', error);
            setErrorMessage('Error unblocking PermanentAddress.');
            setOpenSnackbar(true);
          }
        }
      };

    const openDialog = () => {
        setPermanentAddressName('');
        setPermanentAddressCode('');
        setEditingPermanentAddresss(null);
        setDialogOpen(true);
    };

    const toggleBlockedPermanentAddresss = () => {
        setBlockedPermanentAddresssDialogOpen(true);
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
                    <h6 className='allheading'>PERMANENT ADDRESS </h6>
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
                            onClick={toggleBlockedPermanentAddresss}
                        >
                            Show Blocked
                        </Button>
                    </div>

                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={PermanentAddresss.length > 0 || blockedPermanentAddresss.length > 0}>
                    {PermanentAddresss.length === 0 ? (
                        <Typography className='confirmation-text' variant="body1" color="textSecondary">
                            No active PermanentAddresss available. Please add a new channel.
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
                                        {PermanentAddresss.map((channel: any, index: number) => (
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
                {/* Blocked PermanentAddresss Dialog */}
                <Dialog open={blockedPermanentAddresssDialogOpen} onClose={() => setBlockedPermanentAddresssDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked PermanentAddresss</DialogTitle>
                    <DialogContent>
                        {blockedPermanentAddresss.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked PermanentAddresss available.</Typography>
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
                                    {blockedPermanentAddresss.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedPermanentAddresssDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedPermanentAddresss && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the PermanentAddress "{selectedPermanentAddresss.name}" (Code: {selectedPermanentAddresss.code})?
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
                        {selectedPermanentAddresss && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the PermanentAddress "{selectedPermanentAddresss.name}" (Code: {selectedPermanentAddresss.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingPermanentAddresss !== null ? 'Edit PermanentAddress' : 'Add PermanentAddress'}</DialogTitle>
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
                                value={PermanentAddressName}
                                onChange={(e) => setPermanentAddressName(e.target.value)}
                            />

                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label=" Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={PermanentAddressCode}
                                onChange={(e) => setPermanentAddressCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingPermanentAddresss !== null ? 'Update' : 'Add'}
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
