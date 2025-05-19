
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
import CountryApiService from '../../data/services/customer/country/country_api_services';

const Country: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [CountryName, setCountryName] = useState('');
  const [CountryIso2DigitCode, setIso2DigitCode] = useState('');
  const [Countrys, setCountrys] = useState<any[]>([]);
  const [blockedCountrys, setBlockedCountrys] = useState<any[]>([]);
  const [editingCountry, setEditingCountry] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
  const [blockedCountrysDialogOpen, setBlockedCountrysDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const CountryService = new CountryApiService();

  useEffect(() => {
    fetchCountrys();
    fetchBlockedCountrys()
  }, []);

  const fetchCountrys = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const Country = await CountryService.getCountry();
      const activeCountrys = Country.filter((c: any) => !c.isBlocked);
      setCountrys(activeCountrys);
    } catch (error) {
      console.error('Error fetching Countrys:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedCountrys = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await CountryService.getDeactiveCountry();
      setBlockedCountrys(response);
    } catch (error) {
      console.error('Error fetching blocked Countrys:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: CountryName, iso2DigitCode: CountryIso2DigitCode,  uid: loginDetails.id };
    try {
      if (editingCountry !== null) {
        await CountryService.updateCountry(editingCountry, payload);
        setEditingCountry(null);
        setSuccessMessage('Country updated successfully!');

      } else {
        await CountryService.CreateCountry(payload);
        setSuccessMessage('Country added successfully!');

      }
      setOpenSnackbar(true);
      setCountryName('');
      setIso2DigitCode('');
      setDialogOpen(false);
      fetchCountrys();
    } catch (error) {
      console.error('Error saving Country:', error);
      setErrorMessage('Error saving Country.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (Country: any) => {
    setCountryName(Country.name);
    setIso2DigitCode(Country.iso2DigitCode);
    setEditingCountry(Country.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (Country: any) => {
    setSelectedCountry(Country);
    setConfirmBlockOpen(true);
  };

  const handleBlockCountry = async () => {
    if (selectedCountry !== null) {
      try {
        const euid = 1;  
        await CountryService.deActivateCountry(selectedCountry.id, euid);
  
        setCountrys((prevCountrys) =>
          prevCountrys.filter((Country) => Country.id !== selectedCountry.id)
        );
  
        setBlockedCountrys((prevBlocked) => [
          ...prevBlocked, 
          { ...selectedCountry, isBlocked: true }
        ]);
  
        setSuccessMessage(`Country blocked successfully!`);
        setSelectedCountry(null);
        setConfirmBlockOpen(false);
        setOpenSnackbar(true);
  
      } catch (error) {
        console.error('Error blocking Country:', error);
        setErrorMessage('Error blocking Country.');
        setOpenSnackbar(true);
      }
    }
  };
  
  const handleUnblockDialogOpen = (Country: any) => {
    setSelectedCountry(Country);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockCountry = async () => {
    if (selectedCountry !== null) {
      try {
        await CountryService.unblockCountry(selectedCountry.id);

        setBlockedCountrys((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedCountry.id));
        setCountrys((prevCountrys) => [...prevCountrys, { ...selectedCountry, isBlocked: false }]);
        setSuccessMessage(`Country unblocked successfully!`);

        setSelectedCountry(null);
        setConfirmUnblockOpen(false);
        setBlockedCountrysDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking Country:', error);
        setErrorMessage('Error unblocking Country.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setCountryName('');
    setIso2DigitCode('');
    setEditingCountry(null);
    setDialogOpen(true);
  };

  const toggleBlockedCountrys = () => {
    setBlockedCountrysDialogOpen(true);
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
          <h6 className='allheading'> COUNTRY </h6>
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
              onClick={toggleBlockedCountrys}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={Countrys.length > 0 || blockedCountrys.length > 0}>
          {Countrys.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active Countrys available. Please add a new Country.
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
                    {Countrys.map((Country: any,index: number) => (
                      <TableRow key={Country.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{Country.name}</TableCell>
                        <TableCell className="small-cell">{Country.iso2DigitCode}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(Country)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(Country)} style={{ padding: '1px' }}>
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
        {/* Blocked Countrys Dialog */}
        <Dialog open={blockedCountrysDialogOpen} onClose={() => setBlockedCountrysDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked Countrys</DialogTitle>
          <DialogContent>
            {blockedCountrys.length === 0 ? (
              <Typography className='confirmation-text'>No blocked Countrys available.</Typography>
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
                  {blockedCountrys.map((Country: any,index:number) => (
                    <TableRow key={Country.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{Country.name}</TableCell>
                      <TableCell className="small-cell">{Country.iso2DigitCode}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(Country)}>
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
            <Button onClick={() => setBlockedCountrysDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedCountry && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the Country "{selectedCountry.name}" (Code: {selectedCountry.iso2DigitCode})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockCountry} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedCountry && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the Country "{selectedCountry.name}" (Code: {selectedCountry.iso2DigitCode})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockCountry} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* Country Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingCountry !== null ? 'Edit Country' : 'Add Country'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="Country Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={CountryName}
                onChange={(e) => setCountryName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="Country Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={CountryIso2DigitCode}
                onChange={(e) => setIso2DigitCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingCountry !== null ? 'Update' : 'Add'}
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

export default Country;
