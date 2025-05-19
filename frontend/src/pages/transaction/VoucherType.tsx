
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
import VoucherTypeApiService from '../../data/services/transaction/voucherType/voucherType_api_services';

const Channel: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [VoucherTypeName, setVoucherTypeName] = useState('');
    const [VoucherTypeCode, setVoucherTypeCode] = useState('');
    const [VoucherTypes, setVoucherTypes] = useState<any[]>([]);
    const [blockedVoucherTypes, setBlockedVoucherTypes] = useState<any[]>([]);
    const [editingVoucherTypes, setEditingVoucherTypes] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedVoucherTypes, setSelectedVoucherTypes] = useState<any | null>(null);
    const [blockedVoucherTypesDialogOpen, setBlockedVoucherTypesDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const oucherTypeservice = new VoucherTypeApiService();

    useEffect(() => {
        fetchVoucherTypes();
        fetchBlockedVoucherTypes()
    }, []);

    const fetchVoucherTypes = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await oucherTypeservice.getActiveVoucherType();
            const activeVoucherTypes = channel.filter((c: any) => !c.isBlocked);
            setVoucherTypes(activeVoucherTypes);
        } catch (error) {
            console.error('Error fetching VoucherTypes:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchBlockedVoucherTypes = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await oucherTypeservice.getDeactiveVoucherType();
            setBlockedVoucherTypes(response);
        } catch (error) {
            console.error('Error fetching blocked VoucherTypes:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: VoucherTypeName, code: VoucherTypeCode, uid: loginDetails.id ,euid:'1'};
        try {
          if (editingVoucherTypes !== null) {
            await oucherTypeservice.updateVoucherType(editingVoucherTypes, payload);
            setEditingVoucherTypes(null);
            setSuccessMessage('VoucherType updated successfully!');
          } else {
            await oucherTypeservice.CreateVoucherType(payload);
            setSuccessMessage('VoucherType added successfully!');
          }
          setOpenSnackbar(true);
          setVoucherTypeName('');
          setVoucherTypeCode('');
          setDialogOpen(false);
          fetchVoucherTypes();
        } catch (error) {
          console.error('Error saving VoucherType:', error);
          setErrorMessage('Error saving VoucherType.');
          setOpenSnackbar(true);
        }
      };

    const handleEdit = (channel: any) => {
        setVoucherTypeName(channel.name);
        setVoucherTypeCode(channel.code);
        setEditingVoucherTypes(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedVoucherTypes(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedVoucherTypes !== null) {
          try {
            await oucherTypeservice.blockVoucherType(selectedVoucherTypes.id);
            setVoucherTypes((prevVoucherTypes) =>
              prevVoucherTypes.filter((channel) => channel.id !== selectedVoucherTypes.id)
            );
            setBlockedVoucherTypes((prevBlocked) => [...prevBlocked, { ...selectedVoucherTypes, isBlocked: true }]);
            setSuccessMessage(`VoucherType  blocked successfully!`);
            setSelectedVoucherTypes(null);
            setConfirmBlockOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error blocking VoucherType:', error);
            setErrorMessage('Error blocking VoucherType.');
            setOpenSnackbar(true);
          }
        }
      };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedVoucherTypes(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedVoucherTypes !== null) {
          try {
            await oucherTypeservice.unblockVoucherType(selectedVoucherTypes.id);
            setBlockedVoucherTypes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedVoucherTypes.id));
            setVoucherTypes((prevVoucherTypes) => [...prevVoucherTypes, { ...selectedVoucherTypes, isBlocked: false }]);
            setSuccessMessage(`VoucherType unblocked successfully!`);
            setSelectedVoucherTypes(null);
            setConfirmUnblockOpen(false);
            setBlockedVoucherTypesDialogOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error unblocking VoucherType:', error);
            setErrorMessage('Error unblocking VoucherType.');
            setOpenSnackbar(true);
          }
        }
      };

    const openDialog = () => {
        setVoucherTypeName('');
        setVoucherTypeCode('');
        setEditingVoucherTypes(null);
        setDialogOpen(true);
    };

    const toggleBlockedVoucherTypes = () => {
        setBlockedVoucherTypesDialogOpen(true);
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
                    <h6 className='allheading'>VOUCHER TYPE </h6>
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
                            onClick={toggleBlockedVoucherTypes}
                        >
                            Show Blocked
                        </Button>
                    </div>

                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={VoucherTypes.length > 0 || blockedVoucherTypes.length > 0}>
                    {VoucherTypes.length === 0 ? (
                        <Typography className='confirmation-text'variant="body1" color="textSecondary">
                            No active VoucherTypes available. Please add a new channel.
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
                                        {VoucherTypes.map((channel: any, index: number) => (
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
                {/* Blocked VoucherTypes Dialog */}
                <Dialog open={blockedVoucherTypesDialogOpen} onClose={() => setBlockedVoucherTypesDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked VoucherTypes</DialogTitle>
                    <DialogContent>
                        {blockedVoucherTypes.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked VoucherTypes available.</Typography>
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
                                    {blockedVoucherTypes.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedVoucherTypesDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedVoucherTypes && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the VoucherType "{selectedVoucherTypes.name}" (Code: {selectedVoucherTypes.code})?
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
                        {selectedVoucherTypes && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the VoucherType "{selectedVoucherTypes.name}" (Code: {selectedVoucherTypes.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingVoucherTypes !== null ? 'Edit VoucherType' : 'Add VoucherType'}</DialogTitle>
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
                                value={VoucherTypeName}
                                onChange={(e) => setVoucherTypeName(e.target.value)}
                            />

                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label=" Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={VoucherTypeCode}
                                onChange={(e) => setVoucherTypeCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingVoucherTypes !== null ? 'Update' : 'Add'}
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
