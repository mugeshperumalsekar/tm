
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
import NetworthApiService from '../../data/services/customer/networthProof/networth_api_services';

const Channel: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [NetworthName, setNetworthName] = useState('');
    const [NetworthCode, setNetworthCode] = useState('');
    const [Networths, setNetworths] = useState<any[]>([]);
    const [blockedNetworths, setBlockedNetworths] = useState<any[]>([]);
    const [editingNetworths, setEditingNetworths] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedNetworths, setSelectedNetworths] = useState<any | null>(null);
    const [blockedNetworthsDialogOpen, setBlockedNetworthsDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const networthservice = new NetworthApiService();

    useEffect(() => {
        fetchNetworths();
        fetchBlockedNetworths()
    }, []);

    const fetchNetworths = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await networthservice.getActiveNetworth();
            const activeNetworths = channel.filter((c: any) => !c.isBlocked);
            setNetworths(activeNetworths);
        } catch (error) {
            console.error('Error fetching Networths:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchBlockedNetworths = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await networthservice.getDeactiveNetworth();
            setBlockedNetworths(response);
        } catch (error) {
            console.error('Error fetching blocked Networths:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: NetworthName, code: NetworthCode, uid: loginDetails.id ,euid:'1'};
        try {
          if (editingNetworths !== null) {
            await networthservice.updateNetworth(editingNetworths, payload);
            setEditingNetworths(null);
            setSuccessMessage('Networth updated successfully!');
          } else {
            await networthservice.CreateNetworth(payload);
            setSuccessMessage('Networth added successfully!');
          }
          setOpenSnackbar(true);
          setNetworthName('');
          setNetworthCode('');
          setDialogOpen(false);
          fetchNetworths();
        } catch (error) {
          console.error('Error saving Networth:', error);
          setErrorMessage('Error saving Networth.');
          setOpenSnackbar(true);
        }
      };

    const handleEdit = (channel: any) => {
        setNetworthName(channel.name);
        setNetworthCode(channel.code);
        setEditingNetworths(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedNetworths(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedNetworths !== null) {
          try {
            await networthservice.blockNetworth(selectedNetworths.id);
            setNetworths((prevNetworths) =>
              prevNetworths.filter((channel) => channel.id !== selectedNetworths.id)
            );
            setBlockedNetworths((prevBlocked) => [...prevBlocked, { ...selectedNetworths, isBlocked: true }]);
            setSuccessMessage(`Networth  blocked successfully!`);
            setSelectedNetworths(null);
            setConfirmBlockOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error blocking Networth:', error);
            setErrorMessage('Error blocking Networth.');
            setOpenSnackbar(true);
          }
        }
      };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedNetworths(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedNetworths !== null) {
          try {
            await networthservice.unblockNetworth(selectedNetworths.id);
            setBlockedNetworths((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedNetworths.id));
            setNetworths((prevNetworths) => [...prevNetworths, { ...selectedNetworths, isBlocked: false }]);
            setSuccessMessage(`Networth unblocked successfully!`);
            setSelectedNetworths(null);
            setConfirmUnblockOpen(false);
            setBlockedNetworthsDialogOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error unblocking Networth:', error);
            setErrorMessage('Error unblocking Networth.');
            setOpenSnackbar(true);
          }
        }
      };

    const openDialog = () => {
        setNetworthName('');
        setNetworthCode('');
        setEditingNetworths(null);
        setDialogOpen(true);
    };

    const toggleBlockedNetworths = () => {
        setBlockedNetworthsDialogOpen(true);
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
                    <h6 className='allheading'>NETWORT PROOF  </h6>
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
                            onClick={toggleBlockedNetworths}
                        >
                            Show Blocked
                        </Button>
                    </div>

                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={Networths.length > 0 || blockedNetworths.length > 0}>
                    {Networths.length === 0 ? (
                        <Typography className='confirmation-text'variant="body1" color="textSecondary">
                            No active Networths available. Please add a new channel.
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
                                        {Networths.map((channel: any, index: number) => (
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
                {/* Blocked Networths Dialog */}
                <Dialog open={blockedNetworthsDialogOpen} onClose={() => setBlockedNetworthsDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked Networths</DialogTitle>
                    <DialogContent>
                        {blockedNetworths.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked Networths available.</Typography>
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
                                    {blockedNetworths.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedNetworthsDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedNetworths && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the Networth "{selectedNetworths.name}" (Code: {selectedNetworths.code})?
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
                        {selectedNetworths && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the Networth "{selectedNetworths.name}" (Code: {selectedNetworths.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingNetworths !== null ? 'Edit Networth' : 'Add Networth'}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', gap: '3%' }}>
                            <TextField className="custom-textfield .MuiInputBase-root"
                                autoFocus
                                margin="dense"
                                label="Networth Name"
                                type="text"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                value={NetworthName}
                                onChange={(e) => setNetworthName(e.target.value)}
                            />

                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label="Networth Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={NetworthCode}
                                onChange={(e) => setNetworthCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingNetworths !== null ? 'Update' : 'Add'}
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
