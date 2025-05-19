import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card, Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import AccountRelationApiService from '../../data/services/account/accountRelation/accountRelation_api_service';

const AccountRelation: React.FC = () => {

  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [AccountRelationName, setAccountRelationName] = useState('');
  const [AccountRelationCode, setAccountRelationCode] = useState('');
  const [AccountRelations, setAccountRelations] = useState<any[]>([]);
  const [blockedAccountRelations, setBlockedAccountRelations] = useState<any[]>([]);
  const [editingAccountRelation, setEditingAccountRelation] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedAccountRelation, setSelectedAccountRelation] = useState<any | null>(null);
  const [blockedAccountRelationsDialogOpen, setBlockedAccountRelationsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const AccountRelationService = new AccountRelationApiService();

  useEffect(() => {
    fetchAccountRelations();
    fetchBlockedAccountRelations()
  }, []);

  const fetchAccountRelations = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const AccountRelation = await AccountRelationService.getAccountRelation();
      const activeAccountRelations = AccountRelation.filter((c: any) => !c.isBlocked);
      setAccountRelations(activeAccountRelations);
    } catch (error) {
      console.error('Error fetching AccountRelations:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlockedAccountRelations = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await AccountRelationService.getDeactiveAccountRelation();
      setBlockedAccountRelations(response);
    } catch (error) {
      console.error('Error fetching blocked AccountRelations:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: AccountRelationName, code: AccountRelationCode, uid: loginDetails.id, euid: '1' };
    try {
      if (editingAccountRelation !== null) {
        await AccountRelationService.updateAccountRelation(editingAccountRelation, payload);
        setEditingAccountRelation(null);
        setSuccessMessage('AccountRelation updated successfully!');
      } else {
        await AccountRelationService.CreateAccountRelation(payload);
        setSuccessMessage('AccountRelation added successfully!');
      }
      setOpenSnackbar(true);
      setAccountRelationName('');
      setAccountRelationCode('');
      setDialogOpen(false);
      fetchAccountRelations();
    } catch (error) {
      console.error('Error saving AccountRelation:', error);
      setErrorMessage('Error saving AccountRelation.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (AccountRelation: any) => {
    setAccountRelationName(AccountRelation.name);
    setAccountRelationCode(AccountRelation.code);
    setEditingAccountRelation(AccountRelation.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (AccountRelation: any) => {
    setSelectedAccountRelation(AccountRelation);
    setConfirmBlockOpen(true);
  };

  const handleBlockAccountRelation = async () => {
    if (selectedAccountRelation !== null) {
      try {
        await AccountRelationService.blockAccountRelation(selectedAccountRelation.id);
        setAccountRelations((prevAccountRelations) =>
          prevAccountRelations.filter((AccountRelation) => AccountRelation.id !== selectedAccountRelation.id)
        );
        setBlockedAccountRelations((prevBlocked) => [...prevBlocked, { ...selectedAccountRelation, isBlocked: true }]);
        setSuccessMessage(`AccountRelation  blocked successfully!`);
        setSelectedAccountRelation(null);
        setConfirmBlockOpen(false);
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error blocking AccountRelation:', error);
        setErrorMessage('Error blocking AccountRelation.');
        setOpenSnackbar(true);
      }
    }
  };

  const handleUnblockDialogOpen = (AccountRelation: any) => {
    setSelectedAccountRelation(AccountRelation);
    setConfirmUnblockOpen(true);
  };

  const handleUnblockAccountRelation = async () => {
    if (selectedAccountRelation !== null) {
      try {
        await AccountRelationService.unblockAccountRelation(selectedAccountRelation.id);
        setBlockedAccountRelations((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedAccountRelation.id));
        setAccountRelations((prevAccountRelations) => [...prevAccountRelations, { ...selectedAccountRelation, isBlocked: false }]);
        setSuccessMessage(`AccountRelation unblocked successfully!`);
        setSelectedAccountRelation(null);
        setConfirmUnblockOpen(false);
        setBlockedAccountRelationsDialogOpen(false);
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error unblocking AccountRelation:', error);
        setErrorMessage('Error unblocking AccountRelation.');
        setOpenSnackbar(true);
      }
    }
  };

  const openDialog = () => {
    setAccountRelationName('');
    setAccountRelationCode('');
    setEditingAccountRelation(null);
    setDialogOpen(true);
  };

  const toggleBlockedAccountRelations = () => {
    setBlockedAccountRelationsDialogOpen(true);
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
          <h6 className='allheading'>AccountRelation </h6>
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
              onClick={toggleBlockedAccountRelations}
            >
              Show Blocked
            </Button>
          </div>
        </Box>

        <Loading isLoading={isLoading} hasError={hasError} hasData={AccountRelations.length > 0 || blockedAccountRelations.length > 0}>
          {AccountRelations.length === 0 ? (
            <Typography className='confirmation-text' variant="body1" color="textSecondary">
              No active AccountRelations available. Please add a new AccountRelation.
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
                    {AccountRelations.map((AccountRelation: any, index: number) => (
                      <TableRow key={AccountRelation.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell>
                        <TableCell className="small-cell">{AccountRelation.name}</TableCell>
                        <TableCell className="small-cell">{AccountRelation.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(AccountRelation)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(AccountRelation)} style={{ padding: '1px' }}>
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

        {/* Blocked AccountRelations Dialog */}
        <Dialog open={blockedAccountRelationsDialogOpen} onClose={() => setBlockedAccountRelationsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked AccountRelations</DialogTitle>
          <DialogContent>
            {blockedAccountRelations.length === 0 ? (
              <Typography className='confirmation-text'>No blocked AccountRelations available.</Typography>
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
                  {blockedAccountRelations.map((AccountRelation: any, index: number) => (
                    <TableRow key={AccountRelation.id}>
                      <TableCell className="small-cell">{index + 1}</TableCell>
                      <TableCell className="small-cell">{AccountRelation.name}</TableCell>
                      <TableCell className="small-cell">{AccountRelation.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(AccountRelation)}>
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
            <Button onClick={() => setBlockedAccountRelationsDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedAccountRelation && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the AccountRelation "{selectedAccountRelation.name}" (Code: {selectedAccountRelation.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockAccountRelation} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>

        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedAccountRelation && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the AccountRelation "{selectedAccountRelation.name}" (Code: {selectedAccountRelation.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockAccountRelation} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>

        {/* AccountRelation Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingAccountRelation !== null ? 'Edit AccountRelation' : 'Add AccountRelation'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="AccountRelation Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={AccountRelationName}
                onChange={(e) => setAccountRelationName(e.target.value)}
              />
              <TextField className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="AccountRelation Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={AccountRelationCode}
                onChange={(e) => setAccountRelationCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingAccountRelation !== null ? 'Update' : 'Add'}
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

export default AccountRelation;