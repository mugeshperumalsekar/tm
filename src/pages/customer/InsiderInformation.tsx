
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
import InsiderInformationApiService from '../../data/services/customer/InsiderInformation/insiderInformation_api_service';

const InsiderInformation: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [InsiderInformationName, setInsiderInformationName] = useState('');
    const [InsiderInformationCode, setInsiderInformationCode] = useState('');
    const [InsiderInformations, setInsiderInformations] = useState<any[]>([]);
    const [blockedInsiderInformations, setBlockedInsiderInformations] = useState<any[]>([]);
    const [editingInsiderInformation, setEditingInsiderInformation] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedInsiderInformation, setSelectedInsiderInformation] = useState<any | null>(null);
    const [blockedInsiderInformationsDialogOpen, setBlockedInsiderInformationsDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const InsiderInformationService = new InsiderInformationApiService();

    useEffect(() => {
        fetchInsiderInformations();
        fetchBlockedInsiderInformations()
    }, []);

    const fetchInsiderInformations = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const InsiderInformation = await InsiderInformationService.getInsiderInformation();
            const activeInsiderInformations = InsiderInformation.filter((c: any) => !c.isBlocked);
            setInsiderInformations(activeInsiderInformations);
        } catch (error) {
            console.error('Error fetching InsiderInformations:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    
    const fetchBlockedInsiderInformations = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await InsiderInformationService.getDeactiveInsiderInformation();
            setBlockedInsiderInformations(response);
        } catch (error) {
            console.error('Error fetching blocked InsiderInformations:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: InsiderInformationName, code: InsiderInformationCode, uid: loginDetails.id };
        try {
            if (editingInsiderInformation !== null) {
                await InsiderInformationService.updateInsiderInformation(editingInsiderInformation, payload);
                setEditingInsiderInformation(null);
                setSuccessMessage('InsiderInformation updated successfully!');

            } else {
                await InsiderInformationService.CreateInsiderInformation(payload);
                setSuccessMessage('InsiderInformation added successfully!');

            }
            setOpenSnackbar(true);

            setInsiderInformationName('');
            setInsiderInformationCode('');
            setDialogOpen(false);
            fetchInsiderInformations();
        } catch (error) {
            console.error('Error saving InsiderInformation:', error);
            setErrorMessage('Error saving InsiderInformation.');
            setOpenSnackbar(true);
        }
    };

    const handleEdit = (InsiderInformation: any) => {
        setInsiderInformationName(InsiderInformation.name);
        setInsiderInformationCode(InsiderInformation.code);
        setEditingInsiderInformation(InsiderInformation.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (InsiderInformation: any) => {
        setSelectedInsiderInformation(InsiderInformation);
        setConfirmBlockOpen(true);
    };

    const handleBlockInsiderInformation = async () => {
        if (selectedInsiderInformation !== null) {
            try {
                const euid = 1;
                await InsiderInformationService.deActivateInsiderInformation(selectedInsiderInformation.id, euid);
                setInsiderInformations((prevInsiderInformations) =>
                    prevInsiderInformations.filter((InsiderInformation) => InsiderInformation.id !== selectedInsiderInformation.id)
                );
                setBlockedInsiderInformations((prevBlocked) => [...prevBlocked, { ...selectedInsiderInformation, isBlocked: true }]);
                setSuccessMessage(`InsiderInformation  blocked successfully!`);

                setSelectedInsiderInformation(null);
                setConfirmBlockOpen(false);

                setOpenSnackbar(true);

            } catch (error) {
                console.error('Error blocking InsiderInformation:', error);
                setErrorMessage('Error blocking InsiderInformation.');
                setOpenSnackbar(true);
            }
        }
    };

    const handleUnblockDialogOpen = (InsiderInformation: any) => {
        setSelectedInsiderInformation(InsiderInformation);
        setConfirmUnblockOpen(true);
    };


    const handleUnblockInsiderInformation = async () => {
        if (selectedInsiderInformation !== null) {
            try {
                await InsiderInformationService.unblockInsiderInformation(selectedInsiderInformation.id);

                setBlockedInsiderInformations((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedInsiderInformation.id));
                setInsiderInformations((prevInsiderInformations) => [...prevInsiderInformations, { ...selectedInsiderInformation, isBlocked: false }]);
                setSuccessMessage(`InsiderInformation unblocked successfully!`);

                setSelectedInsiderInformation(null);
                setConfirmUnblockOpen(false);
                setBlockedInsiderInformationsDialogOpen(false);
                setOpenSnackbar(true);

            } catch (error) {
                console.error('Error unblocking InsiderInformation:', error);
                setErrorMessage('Error unblocking InsiderInformation.');
                setOpenSnackbar(true);
            }
        }
    };


    const openDialog = () => {
        setInsiderInformationName('');
        setInsiderInformationCode('');
        setEditingInsiderInformation(null);
        setDialogOpen(true);
    };

    const toggleBlockedInsiderInformations = () => {
        setBlockedInsiderInformationsDialogOpen(true);
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
                    <h6 className='allheading'>INSIDERINFORMATION </h6>
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
                            onClick={toggleBlockedInsiderInformations}
                        >
                            Show Blocked
                        </Button>
                    </div>

                </Box>


                <Loading isLoading={isLoading} hasError={hasError} hasData={InsiderInformations.length > 0 || blockedInsiderInformations.length > 0}>
                    {InsiderInformations.length === 0 ? (
                        <Typography className='confirmation-text' variant="body1" color="textSecondary">
                            No active InsiderInformations available. Please add a new InsiderInformation.
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
                                        {InsiderInformations.map((InsiderInformation: any, index: number) => (
                                            <TableRow key={InsiderInformation.id}>
                                                <TableCell className="small-cell">{index + 1}</TableCell>

                                                <TableCell className="small-cell">{InsiderInformation.name}</TableCell>
                                                <TableCell className="small-cell">{InsiderInformation.code}</TableCell>
                                                <TableCell className="small-cell">
                                                    <IconButton onClick={() => handleBlockDialogOpen(InsiderInformation)} >
                                                        <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleEdit(InsiderInformation)} style={{ padding: '1px' }}>
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
                {/* Blocked InsiderInformations Dialog */}
                <Dialog open={blockedInsiderInformationsDialogOpen} onClose={() => setBlockedInsiderInformationsDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked InsiderInformations</DialogTitle>
                    <DialogContent>
                        {blockedInsiderInformations.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked InsiderInformations available.</Typography>
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
                                    {blockedInsiderInformations.map((InsiderInformation: any, index: number) => (
                                        <TableRow key={InsiderInformation.id}>
                                            <TableCell className="small-cell">{index + 1}</TableCell>
                                            <TableCell className="small-cell">{InsiderInformation.name}</TableCell>
                                            <TableCell className="small-cell">{InsiderInformation.code}</TableCell>
                                            <TableCell className="small-cell">
                                                <IconButton onClick={() => handleUnblockDialogOpen(InsiderInformation)}>
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
                        <Button onClick={() => setBlockedInsiderInformationsDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedInsiderInformation && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the InsiderInformation "{selectedInsiderInformation.name}" (Code: {selectedInsiderInformation.code})?
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleUnblockInsiderInformation} color="primary">
                            Unblock
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Block Confirmation Dialog */}
                <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
                    <DialogContent>
                        {selectedInsiderInformation && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the InsiderInformation "{selectedInsiderInformation.name}" (Code: {selectedInsiderInformation.code})?
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleBlockInsiderInformation} color="primary">
                            Block
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* InsiderInformation Edit Dialog */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
                    maxWidth="md">
                    <DialogTitle className="custom-dialog-title">{editingInsiderInformation !== null ? 'Edit InsiderInformation' : 'Add InsiderInformation'}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', gap: '3%' }}>
                            <TextField className="custom-textfield .MuiInputBase-root"
                                autoFocus
                                margin="dense"
                                label="InsiderInformation Name"
                                type="text"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                value={InsiderInformationName}
                                onChange={(e) => setInsiderInformationName(e.target.value)}
                            />

                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label="InsiderInformation Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={InsiderInformationCode}
                                onChange={(e) => setInsiderInformationCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingInsiderInformation !== null ? 'Update' : 'Add'}
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

export default InsiderInformation;
