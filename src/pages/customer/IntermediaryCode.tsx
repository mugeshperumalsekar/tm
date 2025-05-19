
import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card,
    Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography
} from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';
import IntermediaryApiService from '../../data/services/customer/intermediarycode/intermediary_api_services';
import { Snackbar, Alert } from '@mui/material';

const Channel: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [IntermediaryName, setIntermediaryName] = useState('');
    const [IntermediaryCode, setIntermediaryCode] = useState('');
    const [Intermediarys, setIntermediarys] = useState<any[]>([]);
    const [blockedIntermediarys, setBlockedIntermediarys] = useState<any[]>([]);
    const [editingIntermediarys, setEditingIntermediarys] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedIntermediarys, setSelectedIntermediarys] = useState<any | null>(null);
    const [blockedIntermediarysDialogOpen, setBlockedIntermediarysDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const intermediaryservice = new IntermediaryApiService();

    useEffect(() => {
        fetchIntermediarys();
        fetchBlockedIntermediarys()
    }, []);

    const fetchIntermediarys = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await intermediaryservice.getIntermediarys();
            const activeIntermediarys = channel.filter((c: any) => !c.isBlocked);
            setIntermediarys(activeIntermediarys);
        } catch (error) {
            console.error('Error fetching Intermediarys:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchBlockedIntermediarys = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await intermediaryservice.getDeactiveIntermediary();
            setBlockedIntermediarys(response);
        } catch (error) {
            console.error('Error fetching blocked Intermediarys:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: IntermediaryName, code: IntermediaryCode, uid: loginDetails.id ,euid:'1'};
        try {
          if (editingIntermediarys !== null) {
            await intermediaryservice.updateIntermediary(editingIntermediarys, payload);
            setEditingIntermediarys(null);
            setSuccessMessage('Intermediary updated successfully!');
          } else {
            await intermediaryservice.CreateIntermediary(payload);
            setSuccessMessage('Intermediary added successfully!');
          }
          setOpenSnackbar(true);
          setIntermediaryName('');
          setIntermediaryCode('');
          setDialogOpen(false);
          fetchIntermediarys();
        } catch (error) {
          console.error('Error saving Intermediary:', error);
          setErrorMessage('Error saving Intermediary.');
          setOpenSnackbar(true);
        }
      };

    const handleEdit = (channel: any) => {
        setIntermediaryName(channel.name);
        setIntermediaryCode(channel.code);
        setEditingIntermediarys(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedIntermediarys(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedIntermediarys !== null) {
          try {
            await intermediaryservice.blockIntermediary(selectedIntermediarys.id);
            setIntermediarys((prevIntermediarys) =>
              prevIntermediarys.filter((channel) => channel.id !== selectedIntermediarys.id)
            );
            setBlockedIntermediarys((prevBlocked) => [...prevBlocked, { ...selectedIntermediarys, isBlocked: true }]);
            setSuccessMessage(`Intermediary  blocked successfully!`);
            setSelectedIntermediarys(null);
            setConfirmBlockOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error blocking Intermediary:', error);
            setErrorMessage('Error blocking Intermediary.');
            setOpenSnackbar(true);
          }
        }
      };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedIntermediarys(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedIntermediarys !== null) {
          try {
            await intermediaryservice.unblockIntermediary(selectedIntermediarys.id);
            setBlockedIntermediarys((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedIntermediarys.id));
            setIntermediarys((prevIntermediarys) => [...prevIntermediarys, { ...selectedIntermediarys, isBlocked: false }]);
            setSuccessMessage(`Intermediary unblocked successfully!`);
            setSelectedIntermediarys(null);
            setConfirmUnblockOpen(false);
            setBlockedIntermediarysDialogOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error unblocking Intermediary:', error);
            setErrorMessage('Error unblocking Intermediary.');
            setOpenSnackbar(true);
          }
        }
      };

    const openDialog = () => {
        setIntermediaryName('');
        setIntermediaryCode('');
        setEditingIntermediarys(null);
        setDialogOpen(true);
    };

    const toggleBlockedIntermediarys = () => {
        setBlockedIntermediarysDialogOpen(true);
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
                    <h6 className='allheading'>INTERMEDIARY CODE </h6>
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
                            onClick={toggleBlockedIntermediarys}
                        >
                            Show Blocked
                        </Button>
                    </div>

                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={Intermediarys.length > 0 || blockedIntermediarys.length > 0}>
                    {Intermediarys.length === 0 ? (
                        <Typography className='confirmation-text'variant="body1" color="textSecondary">
                            No active Intermediarys available. Please add a new channel.
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
                                        {Intermediarys.map((channel: any, index: number) => (
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
                {/* Blocked Intermediarys Dialog */}
                <Dialog open={blockedIntermediarysDialogOpen} onClose={() => setBlockedIntermediarysDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked Intermediarys</DialogTitle>
                    <DialogContent>
                        {blockedIntermediarys.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked Intermediarys available.</Typography>
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
                                    {blockedIntermediarys.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedIntermediarysDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedIntermediarys && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the Intermediary "{selectedIntermediarys.name}" (Code: {selectedIntermediarys.code})?
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
                        {selectedIntermediarys && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the Intermediary "{selectedIntermediarys.name}" (Code: {selectedIntermediarys.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingIntermediarys !== null ? 'Edit Intermediary' : 'Add Intermediary'}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', gap: '3%' }}>
                            <TextField className="custom-textfield .MuiInputBase-root"
                                autoFocus
                                margin="dense"
                                label="Intermediary Name"
                                type="text"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                value={IntermediaryName}
                                onChange={(e) => setIntermediaryName(e.target.value)}
                            />

                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label="Intermediary Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={IntermediaryCode}
                                onChange={(e) => setIntermediaryCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingIntermediarys !== null ? 'Update' : 'Add'}
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
