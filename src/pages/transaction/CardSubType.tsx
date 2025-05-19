import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card, Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import CardSubTypeApiService from '../../data/services/transaction/cardsubType/cardSubType_api_services';

const Channel: React.FC = () => {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [CardSubTypeName, setCardSubTypeName] = useState('');
    const [CardSubTypeCode, setCardSubTypeCode] = useState('');
    const [CardSubTypes, setCardSubTypes] = useState<any[]>([]);
    const [blockedCardSubTypes, setBlockedCardSubTypes] = useState<any[]>([]);
    const [editingCardSubTypes, setEditingCardSubTypes] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedCardSubTypes, setSelectedCardSubTypes] = useState<any | null>(null);
    const [blockedCardSubTypesDialogOpen, setBlockedCardSubTypesDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const cardSubTypeservice = new CardSubTypeApiService();

    useEffect(() => {
        fetchCardSubTypes();
        fetchBlockedCardSubTypes()
    }, []);

    const fetchCardSubTypes = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await cardSubTypeservice.getActiveCardSubType();
            const activeCardSubTypes = channel.filter((c: any) => !c.isBlocked);
            setCardSubTypes(activeCardSubTypes);
        } catch (error) {
            console.error('Error fetching CardSubTypes:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBlockedCardSubTypes = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await cardSubTypeservice.getDeactiveCardSubType();
            setBlockedCardSubTypes(response);
        } catch (error) {
            console.error('Error fetching blocked CardSubTypes:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: CardSubTypeName, code: CardSubTypeCode, uid: loginDetails.id, euid: '1' };
        try {
            if (editingCardSubTypes !== null) {
                await cardSubTypeservice.updateCardSubType(editingCardSubTypes, payload);
                setEditingCardSubTypes(null);
                setSuccessMessage('CardSubType updated successfully!');
            } else {
                await cardSubTypeservice.CreateCardSubType(payload);
                setSuccessMessage('CardSubType added successfully!');
            }
            setOpenSnackbar(true);
            setCardSubTypeName('');
            setCardSubTypeCode('');
            setDialogOpen(false);
            fetchCardSubTypes();
        } catch (error) {
            console.error('Error saving CardSubType:', error);
            setErrorMessage('Error saving CardSubType.');
            setOpenSnackbar(true);
        }
    };

    const handleEdit = (channel: any) => {
        setCardSubTypeName(channel.name);
        setCardSubTypeCode(channel.code);
        setEditingCardSubTypes(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedCardSubTypes(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedCardSubTypes !== null) {
            try {
                await cardSubTypeservice.blockCardSubType(selectedCardSubTypes.id);
                setCardSubTypes((prevCardSubTypes) =>
                    prevCardSubTypes.filter((channel) => channel.id !== selectedCardSubTypes.id)
                );
                setBlockedCardSubTypes((prevBlocked) => [...prevBlocked, { ...selectedCardSubTypes, isBlocked: true }]);
                setSuccessMessage(`CardSubType  blocked successfully!`);
                setSelectedCardSubTypes(null);
                setConfirmBlockOpen(false);
                setOpenSnackbar(true);
            } catch (error) {
                console.error('Error blocking CardSubType:', error);
                setErrorMessage('Error blocking CardSubType.');
                setOpenSnackbar(true);
            }
        }
    };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedCardSubTypes(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedCardSubTypes !== null) {
            try {
                await cardSubTypeservice.unblockCardSubType(selectedCardSubTypes.id);
                setBlockedCardSubTypes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedCardSubTypes.id));
                setCardSubTypes((prevCardSubTypes) => [...prevCardSubTypes, { ...selectedCardSubTypes, isBlocked: false }]);
                setSuccessMessage(`CardSubType unblocked successfully!`);
                setSelectedCardSubTypes(null);
                setConfirmUnblockOpen(false);
                setBlockedCardSubTypesDialogOpen(false);
                setOpenSnackbar(true);
            } catch (error) {
                console.error('Error unblocking CardSubType:', error);
                setErrorMessage('Error unblocking CardSubType.');
                setOpenSnackbar(true);
            }
        }
    };

    const openDialog = () => {
        setCardSubTypeName('');
        setCardSubTypeCode('');
        setEditingCardSubTypes(null);
        setDialogOpen(true);
    };

    const toggleBlockedCardSubTypes = () => {
        setBlockedCardSubTypesDialogOpen(true);
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
                    <h6 className='allheading'>CARD SUBTYPE </h6>
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
                            onClick={toggleBlockedCardSubTypes}
                        >
                            Show Blocked
                        </Button>
                    </div>
                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={CardSubTypes.length > 0 || blockedCardSubTypes.length > 0}>
                    {CardSubTypes.length === 0 ? (
                        <Typography className='confirmation-text' variant="body1" color="textSecondary">
                            No active CardSubTypes available. Please add a new channel.
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
                                        {CardSubTypes.map((channel: any, index: number) => (
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

                {/* Blocked CardSubTypes Dialog */}
                <Dialog open={blockedCardSubTypesDialogOpen} onClose={() => setBlockedCardSubTypesDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked CardSubTypes</DialogTitle>
                    <DialogContent>
                        {blockedCardSubTypes.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked CardSubTypes available.</Typography>
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
                                    {blockedCardSubTypes.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedCardSubTypesDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedCardSubTypes && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the CardSubType "{selectedCardSubTypes.name}" (Code: {selectedCardSubTypes.code})?
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
                        {selectedCardSubTypes && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the CardSubType "{selectedCardSubTypes.name}" (Code: {selectedCardSubTypes.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingCardSubTypes !== null ? 'Edit CardSubType' : 'Add CardSubType'}</DialogTitle>
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
                                value={CardSubTypeName}
                                onChange={(e) => setCardSubTypeName(e.target.value)}
                            />
                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label=" Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={CardSubTypeCode}
                                onChange={(e) => setCardSubTypeCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingCardSubTypes !== null ? 'Update' : 'Add'}
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