
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
import PEPClassificationApiService from '../../data/services/customer/pepClassificationenum/pepClassification_api_services';

const Channel: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [PEPClassificationName, setPEPClassificationName] = useState('');
    const [PEPClassificationCode, setPEPClassificationCode] = useState('');
    const [PEPClassifications, setPEPClassifications] = useState<any[]>([]);
    const [blockedPEPClassifications, setBlockedPEPClassifications] = useState<any[]>([]);
    const [editingPEPClassifications, setEditingPEPClassifications] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedPEPClassifications, setSelectedPEPClassifications] = useState<any | null>(null);
    const [blockedPEPClassificationsDialogOpen, setBlockedPEPClassificationsDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const pepClassificationservice = new PEPClassificationApiService();

    useEffect(() => {
        fetchPEPClassifications();
        fetchBlockedPEPClassifications()
    }, []);

    const fetchPEPClassifications = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await pepClassificationservice.getActivePEPClassification();
            const activePEPClassifications = channel.filter((c: any) => !c.isBlocked);
            setPEPClassifications(activePEPClassifications);
        } catch (error) {
            console.error('Error fetching PEPClassifications:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchBlockedPEPClassifications = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await pepClassificationservice.getDeactivePEPClassification();
            setBlockedPEPClassifications(response);
        } catch (error) {
            console.error('Error fetching blocked PEPClassifications:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: PEPClassificationName, code: PEPClassificationCode, uid: loginDetails.id ,euid:'1'};
        try {
          if (editingPEPClassifications !== null) {
            await pepClassificationservice.updatePEPClassification(editingPEPClassifications, payload);
            setEditingPEPClassifications(null);
            setSuccessMessage('PEPClassification updated successfully!');
          } else {
            await pepClassificationservice.CreatePEPClassification(payload);
            setSuccessMessage('PEPClassification added successfully!');
          }
          setOpenSnackbar(true);
          setPEPClassificationName('');
          setPEPClassificationCode('');
          setDialogOpen(false);
          fetchPEPClassifications();
        } catch (error) {
          console.error('Error saving PEPClassification:', error);
          setErrorMessage('Error saving PEPClassification.');
          setOpenSnackbar(true);
        }
      };

    const handleEdit = (channel: any) => {
        setPEPClassificationName(channel.name);
        setPEPClassificationCode(channel.code);
        setEditingPEPClassifications(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedPEPClassifications(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedPEPClassifications !== null) {
          try {
            await pepClassificationservice.blockPEPClassification(selectedPEPClassifications.id);
            setPEPClassifications((prevPEPClassifications) =>
              prevPEPClassifications.filter((channel) => channel.id !== selectedPEPClassifications.id)
            );
            setBlockedPEPClassifications((prevBlocked) => [...prevBlocked, { ...selectedPEPClassifications, isBlocked: true }]);
            setSuccessMessage(`PEPClassification  blocked successfully!`);
            setSelectedPEPClassifications(null);
            setConfirmBlockOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error blocking PEPClassification:', error);
            setErrorMessage('Error blocking PEPClassification.');
            setOpenSnackbar(true);
          }
        }
      };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedPEPClassifications(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedPEPClassifications !== null) {
          try {
            await pepClassificationservice.unblockPEPClassification(selectedPEPClassifications.id);
            setBlockedPEPClassifications((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedPEPClassifications.id));
            setPEPClassifications((prevPEPClassifications) => [...prevPEPClassifications, { ...selectedPEPClassifications, isBlocked: false }]);
            setSuccessMessage(`PEPClassification unblocked successfully!`);
            setSelectedPEPClassifications(null);
            setConfirmUnblockOpen(false);
            setBlockedPEPClassificationsDialogOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error unblocking PEPClassification:', error);
            setErrorMessage('Error unblocking PEPClassification.');
            setOpenSnackbar(true);
          }
        }
      };

    const openDialog = () => {
        setPEPClassificationName('');
        setPEPClassificationCode('');
        setEditingPEPClassifications(null);
        setDialogOpen(true);
    };

    const toggleBlockedPEPClassifications = () => {
        setBlockedPEPClassificationsDialogOpen(true);
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
                    <h6 className='allheading'>PEP CLASSIFICATION </h6>
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
                            onClick={toggleBlockedPEPClassifications}
                        >
                            Show Blocked
                        </Button>
                    </div>

                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={PEPClassifications.length > 0 || blockedPEPClassifications.length > 0}>
                    {PEPClassifications.length === 0 ? (
                        <Typography className='confirmation-text'variant="body1" color="textSecondary">
                            No active PEPClassifications available. Please add a new channel.
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
                                        {PEPClassifications.map((channel: any, index: number) => (
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
                {/* Blocked PEPClassifications Dialog */}
                <Dialog open={blockedPEPClassificationsDialogOpen} onClose={() => setBlockedPEPClassificationsDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked PEPClassifications</DialogTitle>
                    <DialogContent>
                        {blockedPEPClassifications.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked PEPClassifications available.</Typography>
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
                                    {blockedPEPClassifications.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedPEPClassificationsDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedPEPClassifications && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the PEPClassification "{selectedPEPClassifications.name}" (Code: {selectedPEPClassifications.code})?
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
                        {selectedPEPClassifications && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the PEPClassification "{selectedPEPClassifications.name}" (Code: {selectedPEPClassifications.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingPEPClassifications !== null ? 'Edit PEPClassification' : 'Add PEPClassification'}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', gap: '3%' }}>
                            <TextField className="custom-textfield .MuiInputBase-root"
                                autoFocus
                                margin="dense"
                                label="PEPClassification Name"
                                type="text"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                value={PEPClassificationName}
                                onChange={(e) => setPEPClassificationName(e.target.value)}
                            />

                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label="PEPClassification Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={PEPClassificationCode}
                                onChange={(e) => setPEPClassificationCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingPEPClassifications !== null ? 'Update' : 'Add'}
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
