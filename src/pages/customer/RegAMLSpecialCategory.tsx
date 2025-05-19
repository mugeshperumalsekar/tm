
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
import RegAMLSpecialCategoryApiService from '../../data/services/customer/regAMLSpecialCategory/regAMLSpecialCategory_api_services';

const Channel: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [RegAMLSpecialCategoryName, setRegAMLSpecialCategoryName] = useState('');
    const [RegAMLSpecialCategoryCode, setRegAMLSpecialCategoryCode] = useState('');
    const [RegAMLSpecialCategorys, setRegAMLSpecialCategorys] = useState<any[]>([]);
    const [blockedRegAMLSpecialCategorys, setBlockedRegAMLSpecialCategorys] = useState<any[]>([]);
    const [editingRegAMLSpecialCategorys, setEditingRegAMLSpecialCategorys] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedRegAMLSpecialCategorys, setSelectedRegAMLSpecialCategorys] = useState<any | null>(null);
    const [blockedRegAMLSpecialCategorysDialogOpen, setBlockedRegAMLSpecialCategorysDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const regAMLSpecialCategoryservice = new RegAMLSpecialCategoryApiService();

    useEffect(() => {
        fetchRegAMLSpecialCategorys();
        fetchBlockedRegAMLSpecialCategorys()
    }, []);

    const fetchRegAMLSpecialCategorys = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await regAMLSpecialCategoryservice.getActiveRegAMLSpecialCategory();
            const activeRegAMLSpecialCategorys = channel.filter((c: any) => !c.isBlocked);
            setRegAMLSpecialCategorys(activeRegAMLSpecialCategorys);
        } catch (error) {
            console.error('Error fetching RegAMLSpecialCategorys:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchBlockedRegAMLSpecialCategorys = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await regAMLSpecialCategoryservice.getDeactiveRegAMLSpecialCategory();
            setBlockedRegAMLSpecialCategorys(response);
        } catch (error) {
            console.error('Error fetching blocked RegAMLSpecialCategorys:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: RegAMLSpecialCategoryName, code: RegAMLSpecialCategoryCode, uid: loginDetails.id ,euid:'1'};
        try {
          if (editingRegAMLSpecialCategorys !== null) {
            await regAMLSpecialCategoryservice.updateRegAMLSpecialCategory(editingRegAMLSpecialCategorys, payload);
            setEditingRegAMLSpecialCategorys(null);
            setSuccessMessage('RegAMLSpecialCategory updated successfully!');
          } else {
            await regAMLSpecialCategoryservice.CreateRegAMLSpecialCategory(payload);
            setSuccessMessage('RegAMLSpecialCategory added successfully!');
          }
          setOpenSnackbar(true);
          setRegAMLSpecialCategoryName('');
          setRegAMLSpecialCategoryCode('');
          setDialogOpen(false);
          fetchRegAMLSpecialCategorys();
        } catch (error) {
          console.error('Error saving RegAMLSpecialCategory:', error);
          setErrorMessage('Error saving RegAMLSpecialCategory.');
          setOpenSnackbar(true);
        }
      };

    const handleEdit = (channel: any) => {
        setRegAMLSpecialCategoryName(channel.name);
        setRegAMLSpecialCategoryCode(channel.code);
        setEditingRegAMLSpecialCategorys(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedRegAMLSpecialCategorys(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedRegAMLSpecialCategorys !== null) {
          try {
            await regAMLSpecialCategoryservice.blockRegAMLSpecialCategory(selectedRegAMLSpecialCategorys.id);
            setRegAMLSpecialCategorys((prevRegAMLSpecialCategorys) =>
              prevRegAMLSpecialCategorys.filter((channel) => channel.id !== selectedRegAMLSpecialCategorys.id)
            );
            setBlockedRegAMLSpecialCategorys((prevBlocked) => [...prevBlocked, { ...selectedRegAMLSpecialCategorys, isBlocked: true }]);
            setSuccessMessage(`RegAMLSpecialCategory  blocked successfully!`);
            setSelectedRegAMLSpecialCategorys(null);
            setConfirmBlockOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error blocking RegAMLSpecialCategory:', error);
            setErrorMessage('Error blocking RegAMLSpecialCategory.');
            setOpenSnackbar(true);
          }
        }
      };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedRegAMLSpecialCategorys(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedRegAMLSpecialCategorys !== null) {
          try {
            await regAMLSpecialCategoryservice.unblockRegAMLSpecialCategory(selectedRegAMLSpecialCategorys.id);
            setBlockedRegAMLSpecialCategorys((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedRegAMLSpecialCategorys.id));
            setRegAMLSpecialCategorys((prevRegAMLSpecialCategorys) => [...prevRegAMLSpecialCategorys, { ...selectedRegAMLSpecialCategorys, isBlocked: false }]);
            setSuccessMessage(`RegAMLSpecialCategory unblocked successfully!`);
            setSelectedRegAMLSpecialCategorys(null);
            setConfirmUnblockOpen(false);
            setBlockedRegAMLSpecialCategorysDialogOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error unblocking RegAMLSpecialCategory:', error);
            setErrorMessage('Error unblocking RegAMLSpecialCategory.');
            setOpenSnackbar(true);
          }
        }
      };

    const openDialog = () => {
        setRegAMLSpecialCategoryName('');
        setRegAMLSpecialCategoryCode('');
        setEditingRegAMLSpecialCategorys(null);
        setDialogOpen(true);
    };

    const toggleBlockedRegAMLSpecialCategorys = () => {
        setBlockedRegAMLSpecialCategorysDialogOpen(true);
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
                    <h6 className='allheading'>REGAMLSPECIALCATEGORY </h6>
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
                            onClick={toggleBlockedRegAMLSpecialCategorys}
                        >
                            Show Blocked
                        </Button>
                    </div>

                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={RegAMLSpecialCategorys.length > 0 || blockedRegAMLSpecialCategorys.length > 0}>
                    {RegAMLSpecialCategorys.length === 0 ? (
                        <Typography className='confirmation-text'variant="body1" color="textSecondary">
                            No active RegAMLSpecialCategorys available. Please add a new channel.
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
                                        {RegAMLSpecialCategorys.map((channel: any, index: number) => (
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
                {/* Blocked RegAMLSpecialCategorys Dialog */}
                <Dialog open={blockedRegAMLSpecialCategorysDialogOpen} onClose={() => setBlockedRegAMLSpecialCategorysDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked RegAMLSpecialCategorys</DialogTitle>
                    <DialogContent>
                        {blockedRegAMLSpecialCategorys.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked RegAMLSpecialCategorys available.</Typography>
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
                                    {blockedRegAMLSpecialCategorys.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedRegAMLSpecialCategorysDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedRegAMLSpecialCategorys && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the RegAMLSpecialCategory "{selectedRegAMLSpecialCategorys.name}" (Code: {selectedRegAMLSpecialCategorys.code})?
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
                        {selectedRegAMLSpecialCategorys && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the RegAMLSpecialCategory "{selectedRegAMLSpecialCategorys.name}" (Code: {selectedRegAMLSpecialCategorys.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingRegAMLSpecialCategorys !== null ? 'Edit RegAMLSpecialCategory' : 'Add RegAMLSpecialCategory'}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', gap: '3%' }}>
                            <TextField className="custom-textfield .MuiInputBase-root"
                                autoFocus
                                margin="dense"
                                label="RegAMLSpecialCategory Name"
                                type="text"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                value={RegAMLSpecialCategoryName}
                                onChange={(e) => setRegAMLSpecialCategoryName(e.target.value)}
                            />

                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label="RegAMLSpecialCategory Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={RegAMLSpecialCategoryCode}
                                onChange={(e) => setRegAMLSpecialCategoryCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingRegAMLSpecialCategorys !== null ? 'Update' : 'Add'}
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
