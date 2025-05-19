
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
import OccupationTypeApiService from '../../data/services/customer/occupationType/occupationType_api_service';

const Channel: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [OccupationTypeName, setOccupationTypeName] = useState('');
    const [OccupationTypeCode, setOccupationTypeCode] = useState('');
    const [OccupationTypes, setOccupationTypes] = useState<any[]>([]);
    const [blockedOccupationTypes, setBlockedOccupationTypes] = useState<any[]>([]);
    const [editingOccupationTypes, setEditingOccupationTypes] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedOccupationTypes, setSelectedOccupationTypes] = useState<any | null>(null);
    const [blockedOccupationTypesDialogOpen, setBlockedOccupationTypesDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const occupationTypeservice = new OccupationTypeApiService();

    useEffect(() => {
        fetchOccupationTypes();
        fetchBlockedOccupationTypes()
    }, []);

    const fetchOccupationTypes = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await occupationTypeservice.getOccupationTypes();
            const activeOccupationTypes = channel.filter((c: any) => !c.isBlocked);
            setOccupationTypes(activeOccupationTypes);
        } catch (error) {
            console.error('Error fetching OccupationTypes:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchBlockedOccupationTypes = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await occupationTypeservice.getDeactiveOccupationType();
            setBlockedOccupationTypes(response);
        } catch (error) {
            console.error('Error fetching blocked OccupationTypes:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: OccupationTypeName, code: OccupationTypeCode, uid: loginDetails.id ,euid:'1'};
        try {
          if (editingOccupationTypes !== null) {
            await occupationTypeservice.updateOccupationType(editingOccupationTypes, payload);
            setEditingOccupationTypes(null);
            setSuccessMessage('OccupationType updated successfully!');
          } else {
            await occupationTypeservice.CreateOccupationType(payload);
            setSuccessMessage('OccupationType added successfully!');
          }
          setOpenSnackbar(true);
          setOccupationTypeName('');
          setOccupationTypeCode('');
          setDialogOpen(false);
          fetchOccupationTypes();
        } catch (error) {
          console.error('Error saving OccupationType:', error);
          setErrorMessage('Error saving OccupationType.');
          setOpenSnackbar(true);
        }
      };

    const handleEdit = (channel: any) => {
        setOccupationTypeName(channel.name);
        setOccupationTypeCode(channel.code);
        setEditingOccupationTypes(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedOccupationTypes(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedOccupationTypes !== null) {
          try {
            await occupationTypeservice.blockOccupationType(selectedOccupationTypes.id);
            setOccupationTypes((prevOccupationTypes) =>
              prevOccupationTypes.filter((channel) => channel.id !== selectedOccupationTypes.id)
            );
            setBlockedOccupationTypes((prevBlocked) => [...prevBlocked, { ...selectedOccupationTypes, isBlocked: true }]);
            setSuccessMessage(`OccupationType  blocked successfully!`);
            setSelectedOccupationTypes(null);
            setConfirmBlockOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error blocking OccupationType:', error);
            setErrorMessage('Error blocking OccupationType.');
            setOpenSnackbar(true);
          }
        }
      };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedOccupationTypes(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedOccupationTypes !== null) {
          try {
            await occupationTypeservice.unblockOccupationType(selectedOccupationTypes.id);
            setBlockedOccupationTypes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedOccupationTypes.id));
            setOccupationTypes((prevOccupationTypes) => [...prevOccupationTypes, { ...selectedOccupationTypes, isBlocked: false }]);
            setSuccessMessage(`OccupationType unblocked successfully!`);
            setSelectedOccupationTypes(null);
            setConfirmUnblockOpen(false);
            setBlockedOccupationTypesDialogOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error unblocking OccupationType:', error);
            setErrorMessage('Error unblocking OccupationType.');
            setOpenSnackbar(true);
          }
        }
      };

    const openDialog = () => {
        setOccupationTypeName('');
        setOccupationTypeCode('');
        setEditingOccupationTypes(null);
        setDialogOpen(true);
    };

    const toggleBlockedOccupationTypes = () => {
        setBlockedOccupationTypesDialogOpen(true);
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
                    <h6 className='allheading'>OCCUPATIONTYPE CODE </h6>
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
                            onClick={toggleBlockedOccupationTypes}
                        >
                            Show Blocked
                        </Button>
                    </div>

                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={OccupationTypes.length > 0 || blockedOccupationTypes.length > 0}>
                    {OccupationTypes.length === 0 ? (
                        <Typography className='confirmation-text'variant="body1" color="textSecondary">
                            No active OccupationTypes available. Please add a new channel.
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
                                        {OccupationTypes.map((channel: any, index: number) => (
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
                {/* Blocked OccupationTypes Dialog */}
                <Dialog open={blockedOccupationTypesDialogOpen} onClose={() => setBlockedOccupationTypesDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked OccupationTypes</DialogTitle>
                    <DialogContent>
                        {blockedOccupationTypes.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked OccupationTypes available.</Typography>
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
                                    {blockedOccupationTypes.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedOccupationTypesDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedOccupationTypes && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the OccupationType "{selectedOccupationTypes.name}" (Code: {selectedOccupationTypes.code})?
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
                        {selectedOccupationTypes && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the OccupationType "{selectedOccupationTypes.name}" (Code: {selectedOccupationTypes.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingOccupationTypes !== null ? 'Edit OccupationType' : 'Add OccupationType'}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', gap: '3%' }}>
                            <TextField className="custom-textfield .MuiInputBase-root"
                                autoFocus
                                margin="dense"
                                label="OccupationType Name"
                                type="text"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                value={OccupationTypeName}
                                onChange={(e) => setOccupationTypeName(e.target.value)}
                            />

                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label="OccupationType Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={OccupationTypeCode}
                                onChange={(e) => setOccupationTypeCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingOccupationTypes !== null ? 'Update' : 'Add'}
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
