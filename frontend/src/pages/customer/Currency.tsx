
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
import CurrencyApiService from '../../data/services/customer/currency/currency_api_service';

const Currency: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [CurrencyName, setCurrencyName] = useState('');
  const [CurrencyCode, setCurrencyCode] = useState('');
  const [Currencys, setCurrencys] = useState<any[]>([]);
  const [blockedCurrencys, setBlockedCurrencys] = useState<any[]>([]);
  const [editingCurrency, setEditingCurrency] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<any | null>(null);
  const [blockedCurrencysDialogOpen, setBlockedCurrencysDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const currencyService = new CurrencyApiService();

  useEffect(() => {
    fetchCurrencys();
    fetchBlockedCurrencys()
  }, []);

  const fetchCurrencys = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const Currency = await currencyService.getCurrency();
      const activeCurrencys = Currency.filter((c: any) => !c.isBlocked);
      setCurrencys(activeCurrencys);
    } catch (error) {
      console.error('Error fetching Currencys:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedCurrencys = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await currencyService.getDeactiveCurrency();
      setBlockedCurrencys(response);
    } catch (error) {
      console.error('Error fetching blocked Currencys:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: CurrencyName, code: CurrencyCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingCurrency !== null) {
        await currencyService.updateCurrency(editingCurrency, payload);
        setEditingCurrency(null);
        setSuccessMessage('Currency updated successfully!');

      } else {
        await currencyService.CreateCurrency(payload);
        setSuccessMessage('Currency added successfully!');

      }

      setOpenSnackbar(true);

      setCurrencyName('');
      setCurrencyCode('');
      setDialogOpen(false);
      fetchCurrencys();
    } catch (error) {
      console.error('Error saving Currency:', error);
      setErrorMessage('Error saving Currency.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (Currency: any) => {
    setCurrencyName(Currency.name);
    setCurrencyCode(Currency.code);
    setEditingCurrency(Currency.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (Currency: any) => {
    setSelectedCurrency(Currency);
    setConfirmBlockOpen(true);
  };

  const handleBlockCurrency = async () => {
    if (selectedCurrency !== null) {
      try {
      await currencyService.blockCurrency(selectedCurrency.id);
      setCurrencys((prevCurrencys) =>
        prevCurrencys.filter((Currency) => Currency.id !== selectedCurrency.id)
      );
      setBlockedCurrencys((prevBlocked) => [...prevBlocked, { ...selectedCurrency, isBlocked: true }]);
      setSuccessMessage(`Currency  blocked successfully!`);

      setSelectedCurrency(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking Currency:', error);
      setErrorMessage('Error blocking Currency.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (Currency: any) => {
    setSelectedCurrency(Currency);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockCurrency = async () => {
    if (selectedCurrency !== null) {
      try {
        await currencyService.unblockCurrency(selectedCurrency.id);

        setBlockedCurrencys((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedCurrency.id));
        setCurrencys((prevCurrencys) => [...prevCurrencys, { ...selectedCurrency, isBlocked: false }]);
        setSuccessMessage(`Currency unblocked successfully!`);

        setSelectedCurrency(null);
        setConfirmUnblockOpen(false);
        setBlockedCurrencysDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking Currency:', error);
        setErrorMessage('Error unblocking Currency.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setCurrencyName('');
    setCurrencyCode('');
    setEditingCurrency(null);
    setDialogOpen(true);
  };

  const toggleBlockedCurrencys = () => {
    setBlockedCurrencysDialogOpen(true);
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
          <h6 className='allheading'>Currency </h6>
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
              onClick={toggleBlockedCurrencys}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={Currencys.length > 0 || blockedCurrencys.length > 0}>
          {Currencys.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active Currencys available. Please add a new Currency.
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
                    {Currencys.map((Currency: any,index: number) => (
                      <TableRow key={Currency.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{Currency.name}</TableCell>
                        <TableCell className="small-cell">{Currency.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(Currency)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(Currency)} style={{ padding: '1px' }}>
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
        {/* Blocked Currencys Dialog */}
        <Dialog open={blockedCurrencysDialogOpen} onClose={() => setBlockedCurrencysDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked Currencys</DialogTitle>
          <DialogContent>
            {blockedCurrencys.length === 0 ? (
              <Typography className='confirmation-text'>No blocked Currencys available.</Typography>
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
                  {blockedCurrencys.map((Currency: any,index:number) => (
                    <TableRow key={Currency.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{Currency.name}</TableCell>
                      <TableCell className="small-cell">{Currency.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(Currency)}>
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
            <Button onClick={() => setBlockedCurrencysDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedCurrency && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the Currency "{selectedCurrency.name}" (Code: {selectedCurrency.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockCurrency} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedCurrency && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the Currency "{selectedCurrency.name}" (Code: {selectedCurrency.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockCurrency} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* Currency Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingCurrency !== null ? 'Edit Currency' : 'Add Currency'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="Currency Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={CurrencyName}
                onChange={(e) => setCurrencyName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="Currency Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={CurrencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingCurrency !== null ? 'Update' : 'Add'}
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

export default Currency;
