import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card, Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import CardTypeApiService from '../../data/services/transaction/cardType/cardType_api_services';

const Channel: React.FC = () => {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [CardTypeName, setCardTypeName] = useState('');
    const [CardTypeCode, setCardTypeCode] = useState('');
    const [CardTypes, setCardTypes] = useState<any[]>([]);
    const [blockedCardTypes, setBlockedCardTypes] = useState<any[]>([]);
    const [editingCardTypes, setEditingCardTypes] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedCardTypes, setSelectedCardTypes] = useState<any | null>(null);
    const [blockedCardTypesDialogOpen, setBlockedCardTypesDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const cardTypeservice = new CardTypeApiService();

    useEffect(() => {
        fetchCardTypes();
        fetchBlockedCardTypes()
    }, []);

    const fetchCardTypes = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await cardTypeservice.getActiveCardType();
            const activeCardTypes = channel.filter((c: any) => !c.isBlocked);
            setCardTypes(activeCardTypes);
        } catch (error) {
            console.error('Error fetching CardTypes:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBlockedCardTypes = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await cardTypeservice.getDeactiveCardType();
            setBlockedCardTypes(response);
        } catch (error) {
            console.error('Error fetching blocked CardTypes:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: CardTypeName, code: CardTypeCode, uid: loginDetails.id, euid: '1' };
        try {
            if (editingCardTypes !== null) {
                await cardTypeservice.updateCardType(editingCardTypes, payload);
                setEditingCardTypes(null);
                setSuccessMessage('CardType updated successfully!');
            } else {
                await cardTypeservice.CreateCardType(payload);
                setSuccessMessage('CardType added successfully!');
            }
            setOpenSnackbar(true);
            setCardTypeName('');
            setCardTypeCode('');
            setDialogOpen(false);
            fetchCardTypes();
        } catch (error) {
            console.error('Error saving CardType:', error);
            setErrorMessage('Error saving CardType.');
            setOpenSnackbar(true);
        }
    };

    const handleEdit = (channel: any) => {
        setCardTypeName(channel.name);
        setCardTypeCode(channel.code);
        setEditingCardTypes(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedCardTypes(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedCardTypes !== null) {
            try {
                await cardTypeservice.blockCardType(selectedCardTypes.id);
                setCardTypes((prevCardTypes) =>
                    prevCardTypes.filter((channel) => channel.id !== selectedCardTypes.id)
                );
                setBlockedCardTypes((prevBlocked) => [...prevBlocked, { ...selectedCardTypes, isBlocked: true }]);
                setSuccessMessage(`CardType  blocked successfully!`);
                setSelectedCardTypes(null);
                setConfirmBlockOpen(false);
                setOpenSnackbar(true);
            } catch (error) {
                console.error('Error blocking CardType:', error);
                setErrorMessage('Error blocking CardType.');
                setOpenSnackbar(true);
            }
        }
    };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedCardTypes(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedCardTypes !== null) {
            try {
                await cardTypeservice.unblockCardType(selectedCardTypes.id);
                setBlockedCardTypes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedCardTypes.id));
                setCardTypes((prevCardTypes) => [...prevCardTypes, { ...selectedCardTypes, isBlocked: false }]);
                setSuccessMessage(`CardType unblocked successfully!`);
                setSelectedCardTypes(null);
                setConfirmUnblockOpen(false);
                setBlockedCardTypesDialogOpen(false);
                setOpenSnackbar(true);
            } catch (error) {
                console.error('Error unblocking CardType:', error);
                setErrorMessage('Error unblocking CardType.');
                setOpenSnackbar(true);
            }
        }
    };

    const openDialog = () => {
        setCardTypeName('');
        setCardTypeCode('');
        setEditingCardTypes(null);
        setDialogOpen(true);
    };

    const toggleBlockedCardTypes = () => {
        setBlockedCardTypesDialogOpen(true);
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
                    <h6 className='allheading'>CARD TYPE </h6>
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
                            onClick={toggleBlockedCardTypes}
                        >
                            Show Blocked
                        </Button>
                    </div>
                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={CardTypes.length > 0 || blockedCardTypes.length > 0}>
                    {CardTypes.length === 0 ? (
                        <Typography className='confirmation-text' variant="body1" color="textSecondary">
                            No active CardTypes available. Please add a new channel.
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
                                        {CardTypes.map((channel: any, index: number) => (
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

                {/* Blocked CardTypes Dialog */}
                <Dialog open={blockedCardTypesDialogOpen} onClose={() => setBlockedCardTypesDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked CardTypes</DialogTitle>
                    <DialogContent>
                        {blockedCardTypes.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked CardTypes available.</Typography>
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
                                    {blockedCardTypes.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedCardTypesDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedCardTypes && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the CardType "{selectedCardTypes.name}" (Code: {selectedCardTypes.code})?
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
                        {selectedCardTypes && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the CardType "{selectedCardTypes.name}" (Code: {selectedCardTypes.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingCardTypes !== null ? 'Edit CardType' : 'Add CardType'}</DialogTitle>
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
                                value={CardTypeName}
                                onChange={(e) => setCardTypeName(e.target.value)}
                            />
                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label=" Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={CardTypeCode}
                                onChange={(e) => setCardTypeCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingCardTypes !== null ? 'Update' : 'Add'}
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