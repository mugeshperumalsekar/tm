
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
import ProductAccountStatusApiService from '../../data/services/account/productAccountStatus/productAccountStatus_api_service';

const ProductAccountStatus: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [ProductAccountStatusName, setProductAccountStatusName] = useState('');
  const [ProductAccountStatusCode, setProductAccountStatusCode] = useState('');
  const [ProductAccountStatuss, setProductAccountStatuss] = useState<any[]>([]);
  const [blockedProductAccountStatuss, setBlockedProductAccountStatuss] = useState<any[]>([]);
  const [editingProductAccountStatus, setEditingProductAccountStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedProductAccountStatus, setSelectedProductAccountStatus] = useState<any | null>(null);
  const [blockedProductAccountStatussDialogOpen, setBlockedProductAccountStatussDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const ProductAccountStatusService = new ProductAccountStatusApiService();

  useEffect(() => {
    fetchProductAccountStatuss();
    fetchBlockedProductAccountStatuss()
  }, []);

  const fetchProductAccountStatuss = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const ProductAccountStatus = await ProductAccountStatusService.getProductAccountStatus();
      const activeProductAccountStatuss = ProductAccountStatus.filter((c: any) => !c.isBlocked);
      setProductAccountStatuss(activeProductAccountStatuss);
    } catch (error) {
      console.error('Error fetching ProductAccountStatuss:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedProductAccountStatuss = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await ProductAccountStatusService.getDeactiveProductAccountStatus();
      setBlockedProductAccountStatuss(response);
    } catch (error) {
      console.error('Error fetching blocked ProductAccountStatuss:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: ProductAccountStatusName, code: ProductAccountStatusCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingProductAccountStatus !== null) {
        await ProductAccountStatusService.updateProductAccountStatus(editingProductAccountStatus, payload);
        setEditingProductAccountStatus(null);
        setSuccessMessage('ProductAccountStatus updated successfully!');

      } else {
        await ProductAccountStatusService.CreateProductAccountStatus(payload);
        setSuccessMessage('ProductAccountStatus added successfully!');

      }

      setOpenSnackbar(true);

      setProductAccountStatusName('');
      setProductAccountStatusCode('');
      setDialogOpen(false);
      fetchProductAccountStatuss();
    } catch (error) {
      console.error('Error saving ProductAccountStatus:', error);
      setErrorMessage('Error saving ProductAccountStatus.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (ProductAccountStatus: any) => {
    setProductAccountStatusName(ProductAccountStatus.name);
    setProductAccountStatusCode(ProductAccountStatus.code);
    setEditingProductAccountStatus(ProductAccountStatus.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (ProductAccountStatus: any) => {
    setSelectedProductAccountStatus(ProductAccountStatus);
    setConfirmBlockOpen(true);
  };

  const handleBlockProductAccountStatus = async () => {
    if (selectedProductAccountStatus !== null) {
      try {
      await ProductAccountStatusService.blockProductAccountStatus(selectedProductAccountStatus.id);
      setProductAccountStatuss((prevProductAccountStatuss) =>
        prevProductAccountStatuss.filter((ProductAccountStatus) => ProductAccountStatus.id !== selectedProductAccountStatus.id)
      );
      setBlockedProductAccountStatuss((prevBlocked) => [...prevBlocked, { ...selectedProductAccountStatus, isBlocked: true }]);
      setSuccessMessage(`ProductAccountStatus  blocked successfully!`);

      setSelectedProductAccountStatus(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking ProductAccountStatus:', error);
      setErrorMessage('Error blocking ProductAccountStatus.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (ProductAccountStatus: any) => {
    setSelectedProductAccountStatus(ProductAccountStatus);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockProductAccountStatus = async () => {
    if (selectedProductAccountStatus !== null) {
      try {
        await ProductAccountStatusService.unblockProductAccountStatus(selectedProductAccountStatus.id);

        setBlockedProductAccountStatuss((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedProductAccountStatus.id));
        setProductAccountStatuss((prevProductAccountStatuss) => [...prevProductAccountStatuss, { ...selectedProductAccountStatus, isBlocked: false }]);
        setSuccessMessage(`ProductAccountStatus unblocked successfully!`);

        setSelectedProductAccountStatus(null);
        setConfirmUnblockOpen(false);
        setBlockedProductAccountStatussDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking ProductAccountStatus:', error);
        setErrorMessage('Error unblocking ProductAccountStatus.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setProductAccountStatusName('');
    setProductAccountStatusCode('');
    setEditingProductAccountStatus(null);
    setDialogOpen(true);
  };

  const toggleBlockedProductAccountStatuss = () => {
    setBlockedProductAccountStatussDialogOpen(true);
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
          <h6 className='allheading'>ProductAccountStatus </h6>
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
              onClick={toggleBlockedProductAccountStatuss}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={ProductAccountStatuss.length > 0 || blockedProductAccountStatuss.length > 0}>
          {ProductAccountStatuss.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active ProductAccountStatuss available. Please add a new ProductAccountStatus.
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
                    {ProductAccountStatuss.map((ProductAccountStatus: any,index: number) => (
                      <TableRow key={ProductAccountStatus.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{ProductAccountStatus.name}</TableCell>
                        <TableCell className="small-cell">{ProductAccountStatus.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(ProductAccountStatus)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(ProductAccountStatus)} style={{ padding: '1px' }}>
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
        {/* Blocked ProductAccountStatuss Dialog */}
        <Dialog open={blockedProductAccountStatussDialogOpen} onClose={() => setBlockedProductAccountStatussDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked ProductAccountStatuss</DialogTitle>
          <DialogContent>
            {blockedProductAccountStatuss.length === 0 ? (
              <Typography className='confirmation-text'>No blocked ProductAccountStatuss available.</Typography>
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
                  {blockedProductAccountStatuss.map((ProductAccountStatus: any,index:number) => (
                    <TableRow key={ProductAccountStatus.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{ProductAccountStatus.name}</TableCell>
                      <TableCell className="small-cell">{ProductAccountStatus.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(ProductAccountStatus)}>
                          <Block style={{ fontSize: '16px',color: "red" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBlockedProductAccountStatussDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedProductAccountStatus && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the ProductAccountStatus "{selectedProductAccountStatus.name}" (Code: {selectedProductAccountStatus.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockProductAccountStatus} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedProductAccountStatus && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the ProductAccountStatus "{selectedProductAccountStatus.name}" (Code: {selectedProductAccountStatus.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockProductAccountStatus} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* ProductAccountStatus Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingProductAccountStatus !== null ? 'Edit ProductAccountStatus' : 'Add ProductAccountStatus'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="ProductAccountStatus Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={ProductAccountStatusName}
                onChange={(e) => setProductAccountStatusName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="ProductAccountStatus Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={ProductAccountStatusCode}
                onChange={(e) => setProductAccountStatusCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingProductAccountStatus !== null ? 'Update' : 'Add'}
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

export default ProductAccountStatus;
