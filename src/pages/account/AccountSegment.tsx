import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card, Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import AccountSegmentApiService from '../../data/services/account/accountSegment/accountSegment_api_service';

const AccountSegment: React.FC = () => {

  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [AccountSegmentName, setAccountSegmentName] = useState('');
  const [AccountSegmentCode, setAccountSegmentCode] = useState('');
  const [AccountSegments, setAccountSegments] = useState<any[]>([]);
  const [blockedAccountSegments, setBlockedAccountSegments] = useState<any[]>([]);
  const [editingAccountSegment, setEditingAccountSegment] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedAccountSegment, setSelectedAccountSegment] = useState<any | null>(null);
  const [blockedAccountSegmentsDialogOpen, setBlockedAccountSegmentsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const AccountSegmentService = new AccountSegmentApiService();

  useEffect(() => {
    fetchAccountSegments();
    fetchBlockedAccountSegments()
  }, []);

  const fetchAccountSegments = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const AccountSegment = await AccountSegmentService.getAccountSegment();
      const activeAccountSegments = AccountSegment.filter((c: any) => !c.isBlocked);
      setAccountSegments(activeAccountSegments);
    } catch (error) {
      console.error('Error fetching AccountSegments:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlockedAccountSegments = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await AccountSegmentService.getDeactiveAccountSegment();
      setBlockedAccountSegments(response);
    } catch (error) {
      console.error('Error fetching blocked AccountSegments:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: AccountSegmentName, code: AccountSegmentCode, uid: loginDetails.id, euid: '1' };
    try {
      if (editingAccountSegment !== null) {
        await AccountSegmentService.updateAccountSegment(editingAccountSegment, payload);
        setEditingAccountSegment(null);
        setSuccessMessage('AccountSegment updated successfully!');
      } else {
        await AccountSegmentService.CreateAccountSegment(payload);
        setSuccessMessage('AccountSegment added successfully!');
      }
      setOpenSnackbar(true);
      setAccountSegmentName('');
      setAccountSegmentCode('');
      setDialogOpen(false);
      fetchAccountSegments();
    } catch (error) {
      console.error('Error saving AccountSegment:', error);
      setErrorMessage('Error saving AccountSegment.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (AccountSegment: any) => {
    setAccountSegmentName(AccountSegment.name);
    setAccountSegmentCode(AccountSegment.code);
    setEditingAccountSegment(AccountSegment.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (AccountSegment: any) => {
    setSelectedAccountSegment(AccountSegment);
    setConfirmBlockOpen(true);
  };

  const handleBlockAccountSegment = async () => {
    if (selectedAccountSegment !== null) {
      try {
        await AccountSegmentService.blockAccountSegment(selectedAccountSegment.id);
        setAccountSegments((prevAccountSegments) =>
          prevAccountSegments.filter((AccountSegment) => AccountSegment.id !== selectedAccountSegment.id)
        );
        setBlockedAccountSegments((prevBlocked) => [...prevBlocked, { ...selectedAccountSegment, isBlocked: true }]);
        setSuccessMessage(`AccountSegment  blocked successfully!`);
        setSelectedAccountSegment(null);
        setConfirmBlockOpen(false);
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error blocking AccountSegment:', error);
        setErrorMessage('Error blocking AccountSegment.');
        setOpenSnackbar(true);
      }
    }
  };

  const handleUnblockDialogOpen = (AccountSegment: any) => {
    setSelectedAccountSegment(AccountSegment);
    setConfirmUnblockOpen(true);
  };

  const handleUnblockAccountSegment = async () => {
    if (selectedAccountSegment !== null) {
      try {
        await AccountSegmentService.unblockAccountSegment(selectedAccountSegment.id);
        setBlockedAccountSegments((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedAccountSegment.id));
        setAccountSegments((prevAccountSegments) => [...prevAccountSegments, { ...selectedAccountSegment, isBlocked: false }]);
        setSuccessMessage(`AccountSegment unblocked successfully!`);
        setSelectedAccountSegment(null);
        setConfirmUnblockOpen(false);
        setBlockedAccountSegmentsDialogOpen(false);
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error unblocking AccountSegment:', error);
        setErrorMessage('Error unblocking AccountSegment.');
        setOpenSnackbar(true);
      }
    }
  };

  const openDialog = () => {
    setAccountSegmentName('');
    setAccountSegmentCode('');
    setEditingAccountSegment(null);
    setDialogOpen(true);
  };

  const toggleBlockedAccountSegments = () => {
    setBlockedAccountSegmentsDialogOpen(true);
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
          <h6 className='allheading'>AccountSegment </h6>
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
              onClick={toggleBlockedAccountSegments}
            >
              Show Blocked
            </Button>
          </div>

        </Box>

        <Loading isLoading={isLoading} hasError={hasError} hasData={AccountSegments.length > 0 || blockedAccountSegments.length > 0}>
          {AccountSegments.length === 0 ? (
            <Typography className='confirmation-text' variant="body1" color="textSecondary">
              No active AccountSegments available. Please add a new AccountSegment.
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
                    {AccountSegments.map((AccountSegment: any, index: number) => (
                      <TableRow key={AccountSegment.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell>
                        <TableCell className="small-cell">{AccountSegment.name}</TableCell>
                        <TableCell className="small-cell">{AccountSegment.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(AccountSegment)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(AccountSegment)} style={{ padding: '1px' }}>
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

        {/* Blocked AccountSegments Dialog */}
        <Dialog open={blockedAccountSegmentsDialogOpen} onClose={() => setBlockedAccountSegmentsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked AccountSegments</DialogTitle>
          <DialogContent>
            {blockedAccountSegments.length === 0 ? (
              <Typography className='confirmation-text'>No blocked AccountSegments available.</Typography>
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
                  {blockedAccountSegments.map((AccountSegment: any, index: number) => (
                    <TableRow key={AccountSegment.id}>
                      <TableCell className="small-cell">{index + 1}</TableCell>
                      <TableCell className="small-cell">{AccountSegment.name}</TableCell>
                      <TableCell className="small-cell">{AccountSegment.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(AccountSegment)}>
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
            <Button onClick={() => setBlockedAccountSegmentsDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedAccountSegment && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the AccountSegment "{selectedAccountSegment.name}" (Code: {selectedAccountSegment.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockAccountSegment} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>

        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedAccountSegment && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the AccountSegment "{selectedAccountSegment.name}" (Code: {selectedAccountSegment.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockAccountSegment} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>

        {/* AccountSegment Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingAccountSegment !== null ? 'Edit AccountSegment' : 'Add AccountSegment'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="AccountSegment Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={AccountSegmentName}
                onChange={(e) => setAccountSegmentName(e.target.value)}
              />
              <TextField className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="AccountSegment Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={AccountSegmentCode}
                onChange={(e) => setAccountSegmentCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingAccountSegment !== null ? 'Update' : 'Add'}
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

export default AccountSegment;