
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
import ProductSegmentApiService from '../../data/services/customer/ProductSegment/ProductSegment_api_services';

const Channel: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [ProductSegmentName, setProductSegmentName] = useState('');
    const [ProductSegmentCode, setProductSegmentCode] = useState('');
    const [ProductSegments, setProductSegments] = useState<any[]>([]);
    const [blockedProductSegments, setBlockedProductSegments] = useState<any[]>([]);
    const [editingProductSegments, setEditingProductSegments] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
    const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
    const [selectedProductSegments, setSelectedProductSegments] = useState<any | null>(null);
    const [blockedProductSegmentsDialogOpen, setBlockedProductSegmentsDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const productSegmentservice = new ProductSegmentApiService();

    useEffect(() => {
        fetchProductSegments();
        fetchBlockedProductSegments()
    }, []);

    const fetchProductSegments = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const channel = await productSegmentservice.getProductSegments();
            const activeProductSegments = channel.filter((c: any) => !c.isBlocked);
            setProductSegments(activeProductSegments);
        } catch (error) {
            console.error('Error fetching ProductSegments:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchBlockedProductSegments = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await productSegmentservice.getDeactiveProductSegment();
            setBlockedProductSegments(response);
        } catch (error) {
            console.error('Error fetching blocked ProductSegments:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: ProductSegmentName, code: ProductSegmentCode, uid: loginDetails.id ,euid:'1'};
        try {
          if (editingProductSegments !== null) {
            await productSegmentservice.updateProductSegment(editingProductSegments, payload);
            setEditingProductSegments(null);
            setSuccessMessage('ProductSegment updated successfully!');
          } else {
            await productSegmentservice.CreateProductSegment(payload);
            setSuccessMessage('ProductSegment added successfully!');
          }
          setOpenSnackbar(true);
          setProductSegmentName('');
          setProductSegmentCode('');
          setDialogOpen(false);
          fetchProductSegments();
        } catch (error) {
          console.error('Error saving ProductSegment:', error);
          setErrorMessage('Error saving ProductSegment.');
          setOpenSnackbar(true);
        }
      };

    const handleEdit = (channel: any) => {
        setProductSegmentName(channel.name);
        setProductSegmentCode(channel.code);
        setEditingProductSegments(channel.id);
        setDialogOpen(true);
    };

    const handleBlockDialogOpen = (channel: any) => {
        setSelectedProductSegments(channel);
        setConfirmBlockOpen(true);
    };

    const handleBlockChannel = async () => {
        if (selectedProductSegments !== null) {
          try {
            await productSegmentservice.blockProductSegment(selectedProductSegments.id);
            setProductSegments((prevProductSegments) =>
              prevProductSegments.filter((channel) => channel.id !== selectedProductSegments.id)
            );
            setBlockedProductSegments((prevBlocked) => [...prevBlocked, { ...selectedProductSegments, isBlocked: true }]);
            setSuccessMessage(`ProductSegment  blocked successfully!`);
            setSelectedProductSegments(null);
            setConfirmBlockOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error blocking ProductSegment:', error);
            setErrorMessage('Error blocking ProductSegment.');
            setOpenSnackbar(true);
          }
        }
      };

    const handleUnblockDialogOpen = (channel: any) => {
        setSelectedProductSegments(channel);
        setConfirmUnblockOpen(true);
    };

    const handleUnblockChannel = async () => {
        if (selectedProductSegments !== null) {
          try {
            await productSegmentservice.unblockProductSegment(selectedProductSegments.id);
            setBlockedProductSegments((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedProductSegments.id));
            setProductSegments((prevProductSegments) => [...prevProductSegments, { ...selectedProductSegments, isBlocked: false }]);
            setSuccessMessage(`ProductSegment unblocked successfully!`);
            setSelectedProductSegments(null);
            setConfirmUnblockOpen(false);
            setBlockedProductSegmentsDialogOpen(false);
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error unblocking ProductSegment:', error);
            setErrorMessage('Error unblocking ProductSegment.');
            setOpenSnackbar(true);
          }
        }
      };

    const openDialog = () => {
        setProductSegmentName('');
        setProductSegmentCode('');
        setEditingProductSegments(null);
        setDialogOpen(true);
    };

    const toggleBlockedProductSegments = () => {
        setBlockedProductSegmentsDialogOpen(true);
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
                    <h6 className='allheading'>PRODUCTSEGMENT</h6>
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
                            onClick={toggleBlockedProductSegments}
                        >
                            Show Blocked
                        </Button>
                    </div>

                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={ProductSegments.length > 0 || blockedProductSegments.length > 0}>
                    {ProductSegments.length === 0 ? (
                        <Typography className='confirmation-text' variant="body1" color="textSecondary">
                            No active ProductSegments available. Please add a new channel.
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
                                        {ProductSegments.map((channel: any, index: number) => (
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
                {/* Blocked ProductSegments Dialog */}
                <Dialog open={blockedProductSegmentsDialogOpen} onClose={() => setBlockedProductSegmentsDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">Blocked ProductSegments</DialogTitle>
                    <DialogContent>
                        {blockedProductSegments.length === 0 ? (
                            <Typography className='confirmation-text'>No blocked ProductSegments available.</Typography>
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
                                    {blockedProductSegments.map((channel: any, index: number) => (
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
                        <Button onClick={() => setBlockedProductSegmentsDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Unblock Confirmation Dialog */}
                <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
                    <DialogContent>
                        {selectedProductSegments && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to unblock the ProductSegment "{selectedProductSegments.name}" (Code: {selectedProductSegments.code})?
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
                        {selectedProductSegments && (
                            <Typography className='confirmation-text'>
                                Are you sure you want to block the ProductSegment "{selectedProductSegments.name}" (Code: {selectedProductSegments.code})?
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
                    <DialogTitle className="custom-dialog-title">{editingProductSegments !== null ? 'Edit ProductSegment' : 'Add ProductSegment'}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', gap: '3%' }}>
                            <TextField className="custom-textfield .MuiInputBase-root"
                                autoFocus
                                margin="dense"
                                label="ProductSegment Name"
                                type="text"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                value={ProductSegmentName}
                                onChange={(e) => setProductSegmentName(e.target.value)}
                            />

                            <TextField className="custom-textfield .MuiInputBase-root"
                                margin="dense"
                                label="ProductSegment Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={ProductSegmentCode}
                                onChange={(e) => setProductSegmentCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingProductSegments !== null ? 'Update' : 'Add'}
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
