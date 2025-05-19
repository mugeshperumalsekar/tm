
import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card,
    Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography
} from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';
import IndustryApiService from '../../data/services/customer/industry.tsx/industry_api_service';
import { Snackbar, Alert } from '@mui/material';

const Channel: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [IndustryName, setIndustryName] = useState('');
    const [IndustryCode, setIndustryCode] = useState('');
    const [Industrys, setIndustrys] = useState<any[]>([]);
    const [blockedIndustrys, setBlockedIndustrys] = useState<any[]>([]);
    const [editingIndustry, setEditingIndustry] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedIndustry, setSelectedIndustry] = useState<any | null>(null);
    const [blockedIndustrysDialogOpen, setBlockedIndustrysDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const industryService = new IndustryApiService();

    useEffect(() => {
        fetchIndustrys();
        fetchBlockedIndustrys()
    }, []);

    const fetchIndustrys = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await industryService.getIndustrys();
            const activeIndustrys = channel.filter((c: any) => !c.isBlocked);
            setIndustrys(activeIndustrys);
        } catch (error) {
            console.error('Error fetching Industrys:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchBlockedIndustrys = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await industryService.getDeactiveIndustry();
            setBlockedIndustrys(response);
        } catch (error) {
            console.error('Error fetching blocked Industrys:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: IndustryName, code: IndustryCode, uid: loginDetails.id,euid:'1' };
        try {
            if (editingIndustry !== null) {
                await industryService.updateIndustry(editingIndustry, payload);
                setEditingIndustry(null);
                setSuccessMessage('Industry updated successfully!');
            } else {
                await industryService.CreateIndustry(payload);
                setSuccessMessage('Industry added successfully!');
            }
            setOpenSnackbar(true);
            setIndustryName('');
            setIndustryCode('');
            setDialogOpen(false);
            fetchIndustrys();
        } catch (error) {
            console.error('Error saving Industry:', error);
            setErrorMessage('Error saving Industry.');
            setOpenSnackbar(true);
        }
    };

    const handleEdit = (channel: any) => {
        setIndustryName(channel.name);
        setIndustryCode(channel.code);
        setEditingIndustry(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedIndustry(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedIndustry !== null) {
            try {
                await industryService.blockIndustry(selectedIndustry.id);
                setIndustrys((prevIndustrys) =>
                    prevIndustrys.filter((channel) => channel.id !== selectedIndustry.id)
                );
                setBlockedIndustrys((prevBlocked) => [...prevBlocked, { ...selectedIndustry, isBlocked: true }]);
                setSuccessMessage(`Industry  blocked successfully!`);
                setSelectedIndustry(null);
                setConfirmBlockOpen(false);
                setOpenSnackbar(true);
            } catch (error) {
                console.error('Error blocking Industry:', error);
                setErrorMessage('Error blocking Industry.');
                setOpenSnackbar(true);
            }
        }
    };
    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedIndustry(channel);
        setConfirmUnblockOpen(true);
    };


    const handleUnblockChannel = async () => {
        if (selectedIndustry !== null) {
            try {
                await industryService.unblockIndustry(selectedIndustry.id);

                setBlockedIndustrys((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedIndustry.id));
                setIndustrys((prevIndustrys) => [...prevIndustrys, { ...selectedIndustry, isBlocked: false }]);
                setSuccessMessage(`Industry  unblocked successfully!`);

                setSelectedIndustry(null);
                setConfirmUnblockOpen(false);
                setBlockedIndustrysDialogOpen(false);
                setOpenSnackbar(true);

            } catch (error) {
                console.error('Error blocking Industry:', error);
                setErrorMessage('Error blocking Industry.');
                setOpenSnackbar(true);
            }
        }
    };

    const openDialog = () => {
        setIndustryName('');
        setIndustryCode('');
        setEditingIndustry(null);
        setDialogOpen(true);
    };

    const toggleBlockedIndustrys = () => {
        setBlockedIndustrysDialogOpen(true);
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
                    <h6 className='allheading'>Industry </h6>
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
                            onClick={toggleBlockedIndustrys}
                        >
                            Show Blocked
                        </Button>
                    </div>

                </Box>


                <Loading isLoading={isLoading} hasError={hasError} hasData={Industrys.length > 0 || blockedIndustrys.length > 0}>
                    {Industrys.length === 0 ? (
                        <Typography className='confirmation-text' variant="body1" color="textSecondary">
                            No active Industrys available. Please add a new channel.
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
                                        {Industrys.map((channel: any, index: number) => (
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
                {/* Blocked Industrys Dialog */}
                <Dialog open={blockedIndustrysDialogOpen} onClose={() => setBlockedIndustrysDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked Industrys</DialogTitle>
                    <DialogContent>
                        {blockedIndustrys.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked Industrys available.</Typography>
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
                                    {blockedIndustrys.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedIndustrysDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedIndustry && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the Industry "{selectedIndustry.name}" (Code: {selectedIndustry.code})?
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
                        {selectedIndustry && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the Industry "{selectedIndustry.name}" (Code: {selectedIndustry.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingIndustry !== null ? 'Edit Industry' : 'Add Industry'}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', gap: '3%' }}>
                            <TextField className="custom-textfield .MuiInputBase-root"
                                autoFocus
                                margin="dense"
                                label="Industry Name"
                                type="text"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                value={IndustryName}
                                onChange={(e) => setIndustryName(e.target.value)}
                            />

                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label="Industry Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={IndustryCode}
                                onChange={(e) => setIndustryCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingIndustry !== null ? 'Update' : 'Add'}
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
