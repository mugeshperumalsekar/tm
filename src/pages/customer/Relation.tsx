
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
import RelationApiService from '../../data/services/customer/relation/relation_api_servies';

const Channel: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [RelationName, setRelationName] = useState('');
    const [RelationCode, setRelationCode] = useState('');
    const [Relations, setRelations] = useState<any[]>([]);
    const [blockedRelations, setBlockedRelations] = useState<any[]>([]);
    const [editingRelations, setEditingRelations] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedRelations, setSelectedRelations] = useState<any | null>(null);
    const [blockedRelationsDialogOpen, setBlockedRelationsDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const relationservice = new RelationApiService();

    useEffect(() => {
        fetchRelations();
        fetchBlockedRelations()
    }, []);

    const fetchRelations = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await relationservice.getActiveRelation();
            const activeRelations = channel.filter((c: any) => !c.isBlocked);
            setRelations(activeRelations);
        } catch (error) {
            console.error('Error fetching Relations:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchBlockedRelations = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await relationservice.getDeactiveRelation();
            setBlockedRelations(response);
        } catch (error) {
            console.error('Error fetching blocked Relations:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: RelationName, code: RelationCode, uid: loginDetails.id ,euid:'1'};
        try {
          if (editingRelations !== null) {
            await relationservice.updateRelation(editingRelations, payload);
            setEditingRelations(null);
            setSuccessMessage('Relation updated successfully!');
          } else {
            await relationservice.CreateRelation(payload);
            setSuccessMessage('Relation added successfully!');
          }
          setOpenSnackbar(true);
          setRelationName('');
          setRelationCode('');
          setDialogOpen(false);
          fetchRelations();
        } catch (error) {
          console.error('Error saving Relation:', error);
          setErrorMessage('Error saving Relation.');
          setOpenSnackbar(true);
        }
      };

    const handleEdit = (channel: any) => {
        setRelationName(channel.name);
        setRelationCode(channel.code);
        setEditingRelations(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedRelations(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedRelations !== null) {
          try {
            await relationservice.blockRelation(selectedRelations.id);
            setRelations((prevRelations) =>
              prevRelations.filter((channel) => channel.id !== selectedRelations.id)
            );
            setBlockedRelations((prevBlocked) => [...prevBlocked, { ...selectedRelations, isBlocked: true }]);
            setSuccessMessage(`Relation  blocked successfully!`);
            setSelectedRelations(null);
            setConfirmBlockOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error blocking Relation:', error);
            setErrorMessage('Error blocking Relation.');
            setOpenSnackbar(true);
          }
        }
      };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedRelations(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedRelations !== null) {
          try {
            await relationservice.unblockRelation(selectedRelations.id);
            setBlockedRelations((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedRelations.id));
            setRelations((prevRelations) => [...prevRelations, { ...selectedRelations, isBlocked: false }]);
            setSuccessMessage(`Relation unblocked successfully!`);
            setSelectedRelations(null);
            setConfirmUnblockOpen(false);
            setBlockedRelationsDialogOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error unblocking Relation:', error);
            setErrorMessage('Error unblocking Relation.');
            setOpenSnackbar(true);
          }
        }
      };

    const openDialog = () => {
        setRelationName('');
        setRelationCode('');
        setEditingRelations(null);
        setDialogOpen(true);
    };

    const toggleBlockedRelations = () => {
        setBlockedRelationsDialogOpen(true);
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
                    <h6 className='allheading'>RELATION  </h6>
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
                            onClick={toggleBlockedRelations}
                        >
                            Show Blocked
                        </Button>
                    </div>

                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={Relations.length > 0 || blockedRelations.length > 0}>
                    {Relations.length === 0 ? (
                        <Typography className='confirmation-text'variant="body1" color="textSecondary">
                            No active Relations available. Please add a new channel.
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
                                        {Relations.map((channel: any, index: number) => (
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
                {/* Blocked Relations Dialog */}
                <Dialog open={blockedRelationsDialogOpen} onClose={() => setBlockedRelationsDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked Relations</DialogTitle>
                    <DialogContent>
                        {blockedRelations.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked Relations available.</Typography>
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
                                    {blockedRelations.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedRelationsDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedRelations && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the Relation "{selectedRelations.name}" (Code: {selectedRelations.code})?
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
                        {selectedRelations && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the Relation "{selectedRelations.name}" (Code: {selectedRelations.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingRelations !== null ? 'Edit Relation' : 'Add Relation'}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', gap: '3%' }}>
                            <TextField className="custom-textfield .MuiInputBase-root"
                                autoFocus
                                margin="dense"
                                label="Relation Name"
                                type="text"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                value={RelationName}
                                onChange={(e) => setRelationName(e.target.value)}
                            />

                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label="Relation Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={RelationCode}
                                onChange={(e) => setRelationCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingRelations !== null ? 'Update' : 'Add'}
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
