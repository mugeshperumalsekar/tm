import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card, Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import TagApiService from '../../data/services/customer/tags/tag_api_service';

const Channel: React.FC = () => {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [TagName, setTagName] = useState('');
    const [TagCode, setTagCode] = useState('');
    const [Tags, setTags] = useState<any[]>([]);
    const [blockedTags, setBlockedTags] = useState<any[]>([]);
    const [editingTags, setEditingTags] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<any | null>(null);
    const [blockedTagsDialogOpen, setBlockedTagsDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const tagservice = new TagApiService();

    useEffect(() => {
        fetchTags();
        fetchBlockedTags()
    }, []);

    const fetchTags = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await tagservice.getTags();
            const activeTags = channel.filter((c: any) => !c.isBlocked);
            setTags(activeTags);
        } catch (error) {
            console.error('Error fetching Tags:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBlockedTags = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await tagservice.getDeactiveTag();
            setBlockedTags(response);
        } catch (error) {
            console.error('Error fetching blocked Tags:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: TagName, code: TagCode, uid: loginDetails.id, euid: '1' };
        try {
            if (editingTags !== null) {
                await tagservice.updateTag(editingTags, payload);
                setEditingTags(null);
                setSuccessMessage('Tag updated successfully!');
            } else {
                await tagservice.CreateTag(payload);
                setSuccessMessage('Tag added successfully!');
            }
            setOpenSnackbar(true);
            setTagName('');
            setTagCode('');
            setDialogOpen(false);
            fetchTags();
        } catch (error) {
            console.error('Error saving Tag:', error);
            setErrorMessage('Error saving Tag.');
            setOpenSnackbar(true);
        }
    };

    const handleEdit = (channel: any) => {
        setTagName(channel.name);
        setTagCode(channel.code);
        setEditingTags(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedTags(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedTags !== null) {
            try {
                await tagservice.blockTag(selectedTags.id);
                setTags((prevTags) =>
                    prevTags.filter((channel) => channel.id !== selectedTags.id)
                );
                setBlockedTags((prevBlocked) => [...prevBlocked, { ...selectedTags, isBlocked: true }]);
                setSuccessMessage(`Tag  blocked successfully!`);
                setSelectedTags(null);
                setConfirmBlockOpen(false);
                setOpenSnackbar(true);
            } catch (error) {
                console.error('Error blocking Tag:', error);
                setErrorMessage('Error blocking Tag.');
                setOpenSnackbar(true);
            }
        }
    };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedTags(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedTags !== null) {
            try {
                await tagservice.unblockTag(selectedTags.id);
                setBlockedTags((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedTags.id));
                setTags((prevTags) => [...prevTags, { ...selectedTags, isBlocked: false }]);
                setSuccessMessage(`Tag unblocked successfully!`);
                setSelectedTags(null);
                setConfirmUnblockOpen(false);
                setBlockedTagsDialogOpen(false);
                setOpenSnackbar(true);
            } catch (error) {
                console.error('Error unblocking Tag:', error);
                setErrorMessage('Error unblocking Tag.');
                setOpenSnackbar(true);
            }
        }
    };

    const openDialog = () => {
        setTagName('');
        setTagCode('');
        setEditingTags(null);
        setDialogOpen(true);
    };

    const toggleBlockedTags = () => {
        setBlockedTagsDialogOpen(true);
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
                    <h6 className='allheading'>TAG</h6>
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
                            onClick={toggleBlockedTags}
                        >
                            Show Blocked
                        </Button>
                    </div>
                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={Tags.length > 0 || blockedTags.length > 0}>
                    {Tags.length === 0 ? (
                        <Typography className='confirmation-text' variant="body1" color="textSecondary">
                            No active Tags available. Please add a new channel.
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
                                        {Tags.map((channel: any, index: number) => (
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
                {/* Blocked Tags Dialog */}
                <Dialog open={blockedTagsDialogOpen} onClose={() => setBlockedTagsDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked Tags</DialogTitle>
                    <DialogContent>
                        {blockedTags.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked Tags available.</Typography>
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
                                    {blockedTags.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedTagsDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedTags && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the Tag "{selectedTags.name}" (Code: {selectedTags.code})?
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
                        {selectedTags && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the Tag "{selectedTags.name}" (Code: {selectedTags.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingTags !== null ? 'Edit Tag' : 'Add Tag'}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', gap: '3%' }}>
                            <TextField className="custom-textfield .MuiInputBase-root"
                                autoFocus
                                margin="dense"
                                label="Tag Name"
                                type="text"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                value={TagName}
                                onChange={(e) => setTagName(e.target.value)}
                            />
                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label="Tag Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={TagCode}
                                onChange={(e) => setTagCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingTags !== null ? 'Update' : 'Add'}
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