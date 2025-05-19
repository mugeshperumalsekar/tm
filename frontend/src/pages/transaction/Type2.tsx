
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
import Type2ApiService from '../../data/services/transaction/type2/type2_api_services';

const Channel: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [Type2Name, setType2Name] = useState('');
    const [Type2Code, setType2Code] = useState('');
    const [Type2s, setType2s] = useState<any[]>([]);
    const [blockedType2s, setBlockedType2s] = useState<any[]>([]);
    const [editingType2s, setEditingType2s] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedType2s, setSelectedType2s] = useState<any | null>(null);
    const [blockedType2sDialogOpen, setBlockedType2sDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const type2service = new Type2ApiService();

    useEffect(() => {
        fetchType2s();
        fetchBlockedType2s()
    }, []);

    const fetchType2s = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await type2service.getActiveType2();
            const activeType2s = channel.filter((c: any) => !c.isBlocked);
            setType2s(activeType2s);
        } catch (error) {
            console.error('Error fetching Type2s:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchBlockedType2s = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await type2service.getDeactiveType2();
            setBlockedType2s(response);
        } catch (error) {
            console.error('Error fetching blocked Type2s:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: Type2Name, code: Type2Code, uid: loginDetails.id ,euid:'1'};
        try {
          if (editingType2s !== null) {
            await type2service.updateType2(editingType2s, payload);
            setEditingType2s(null);
            setSuccessMessage('Type2 updated successfully!');
          } else {
            await type2service.CreateType2(payload);
            setSuccessMessage('Type2 added successfully!');
          }
          setOpenSnackbar(true);
          setType2Name('');
          setType2Code('');
          setDialogOpen(false);
          fetchType2s();
        } catch (error) {
          console.error('Error saving Type2:', error);
          setErrorMessage('Error saving Type2.');
          setOpenSnackbar(true);
        }
      };

    const handleEdit = (channel: any) => {
        setType2Name(channel.name);
        setType2Code(channel.code);
        setEditingType2s(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedType2s(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedType2s !== null) {
          try {
            await type2service.blockType2(selectedType2s.id);
            setType2s((prevType2s) =>
              prevType2s.filter((channel) => channel.id !== selectedType2s.id)
            );
            setBlockedType2s((prevBlocked) => [...prevBlocked, { ...selectedType2s, isBlocked: true }]);
            setSuccessMessage(`Type2  blocked successfully!`);
            setSelectedType2s(null);
            setConfirmBlockOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error blocking Type2:', error);
            setErrorMessage('Error blocking Type2.');
            setOpenSnackbar(true);
          }
        }
      };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedType2s(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedType2s !== null) {
          try {
            await type2service.unblockType2(selectedType2s.id);
            setBlockedType2s((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedType2s.id));
            setType2s((prevType2s) => [...prevType2s, { ...selectedType2s, isBlocked: false }]);
            setSuccessMessage(`Type2 unblocked successfully!`);
            setSelectedType2s(null);
            setConfirmUnblockOpen(false);
            setBlockedType2sDialogOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error unblocking Type2:', error);
            setErrorMessage('Error unblocking Type2.');
            setOpenSnackbar(true);
          }
        }
      };

    const openDialog = () => {
        setType2Name('');
        setType2Code('');
        setEditingType2s(null);
        setDialogOpen(true);
    };

    const toggleBlockedType2s = () => {
        setBlockedType2sDialogOpen(true);
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
                    <h6 className='allheading'> TYPE 2</h6>
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
                            onClick={toggleBlockedType2s}
                        >
                            Show Blocked
                        </Button>
                    </div>

                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={Type2s.length > 0 || blockedType2s.length > 0}>
                    {Type2s.length === 0 ? (
                        <Typography className='confirmation-text'variant="body1" color="textSecondary">
                            No active Type2s available. Please add a new channel.
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
                                        {Type2s.map((channel: any, index: number) => (
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
                {/* Blocked Type2s Dialog */}
                <Dialog open={blockedType2sDialogOpen} onClose={() => setBlockedType2sDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked Type2s</DialogTitle>
                    <DialogContent>
                        {blockedType2s.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked Type2s available.</Typography>
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
                                    {blockedType2s.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedType2sDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedType2s && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the Type2 "{selectedType2s.name}" (Code: {selectedType2s.code})?
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
                        {selectedType2s && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the Type2 "{selectedType2s.name}" (Code: {selectedType2s.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingType2s !== null ? 'Edit Type2' : 'Add Type2'}</DialogTitle>
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
                                value={Type2Name}
                                onChange={(e) => setType2Name(e.target.value)}
                            />

                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label=" Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={Type2Code}
                                onChange={(e) => setType2Code(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingType2s !== null ? 'Update' : 'Add'}
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
