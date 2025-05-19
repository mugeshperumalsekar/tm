
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
import AttachmentApiService from '../../data/services/customer/attachment/attachment_api_services';

const Attachment: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [AttachmentName, setAttachmentName] = useState('');
  const [AttachmentCode, setAttachmentCode] = useState('');
  const [Attachments, setAttachments] = useState<any[]>([]);
  const [blockedAttachments, setBlockedAttachments] = useState<any[]>([]);
  const [editingAttachment, setEditingAttachment] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<any | null>(null);
  const [blockedAttachmentsDialogOpen, setBlockedAttachmentsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const AttachmentService = new AttachmentApiService();

  useEffect(() => {
    fetchAttachments();
    fetchBlockedAttachments()
  }, []);

  const fetchAttachments = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const Attachment = await AttachmentService.getAttachment();
      const activeAttachments = Attachment.filter((c: any) => !c.isBlocked);
      setAttachments(activeAttachments);
    } catch (error) {
      console.error('Error fetching Attachments:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedAttachments = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await AttachmentService.getDeactiveAttachment();
      setBlockedAttachments(response);
    } catch (error) {
      console.error('Error fetching blocked Attachments:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: AttachmentName, code: AttachmentCode, uid: loginDetails.id };
    try {
      if (editingAttachment !== null) {
        await AttachmentService.updateAttachment(editingAttachment, payload);
        setEditingAttachment(null);
        setSuccessMessage('Attachment updated successfully!');

      } else {
        await AttachmentService.CreateAttachment(payload);
        setSuccessMessage('Attachment added successfully!');

      }
      setOpenSnackbar(true);
      setAttachmentName('');
      setAttachmentCode('');
      setDialogOpen(false);
      fetchAttachments();
    } catch (error) {
      console.error('Error saving Attachment:', error);
      setErrorMessage('Error saving Attachment.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (Attachment: any) => {
    setAttachmentName(Attachment.name);
    setAttachmentCode(Attachment.code);
    setEditingAttachment(Attachment.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (Attachment: any) => {
    setSelectedAttachment(Attachment);
    setConfirmBlockOpen(true);
  };

  const handleBlockAttachment = async () => {
    if (selectedAttachment !== null) {
      try {
        const euid = 1;
        await AttachmentService.deActivateAttachment(selectedAttachment.id, euid);

        setAttachments((prevAttachments) =>
          prevAttachments.filter((Attachment) => Attachment.id !== selectedAttachment.id)
        );

        setBlockedAttachments((prevBlocked) => [
          ...prevBlocked,
          { ...selectedAttachment, isBlocked: true }
        ]);

        setSuccessMessage(`Attachment blocked successfully!`);
        setSelectedAttachment(null);
        setConfirmBlockOpen(false);
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error blocking Attachment:', error);
        setErrorMessage('Error blocking Attachment.');
        setOpenSnackbar(true);
      }
    }
  };

  const handleUnblockDialogOpen = (Attachment: any) => {
    setSelectedAttachment(Attachment);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockAttachment = async () => {
    if (selectedAttachment !== null) {
      try {
        await AttachmentService.unblockAttachment(selectedAttachment.id);

        setBlockedAttachments((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedAttachment.id));
        setAttachments((prevAttachments) => [...prevAttachments, { ...selectedAttachment, isBlocked: false }]);
        setSuccessMessage(`Attachment unblocked successfully!`);

        setSelectedAttachment(null);
        setConfirmUnblockOpen(false);
        setBlockedAttachmentsDialogOpen(false);
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking Attachment:', error);
        setErrorMessage('Error unblocking Attachment.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setAttachmentName('');
    setAttachmentCode('');
    setEditingAttachment(null);
    setDialogOpen(true);
  };

  const toggleBlockedAttachments = () => {
    setBlockedAttachmentsDialogOpen(true);
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
          <h6 className='allheading'> ATTACHMENT </h6>
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
              onClick={toggleBlockedAttachments}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={Attachments.length > 0 || blockedAttachments.length > 0}>
          {Attachments.length === 0 ? (
            <Typography className='confirmation-text' variant="body1" color="textSecondary">
              No active Attachments available. Please add a new Attachment.
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
                    {Attachments.map((Attachment: any, index: number) => (
                      <TableRow key={Attachment.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell>

                        <TableCell className="small-cell">{Attachment.name}</TableCell>
                        <TableCell className="small-cell">{Attachment.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(Attachment)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(Attachment)} style={{ padding: '1px' }}>
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
        {/* Blocked Attachments Dialog */}
        <Dialog open={blockedAttachmentsDialogOpen} onClose={() => setBlockedAttachmentsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked Attachments</DialogTitle>
          <DialogContent>
            {blockedAttachments.length === 0 ? (
              <Typography className='confirmation-text'>No blocked Attachments available.</Typography>
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
                  {blockedAttachments.map((Attachment: any, index: number) => (
                    <TableRow key={Attachment.id}>
                      <TableCell className="small-cell">{index + 1}</TableCell>
                      <TableCell className="small-cell">{Attachment.name}</TableCell>
                      <TableCell className="small-cell">{Attachment.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(Attachment)}>
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
            <Button onClick={() => setBlockedAttachmentsDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedAttachment && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the Attachment "{selectedAttachment.name}" (Code: {selectedAttachment.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockAttachment} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedAttachment && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the Attachment "{selectedAttachment.name}" (Code: {selectedAttachment.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockAttachment} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* Attachment Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingAttachment !== null ? 'Edit Attachment' : 'Add Attachment'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="Attachment Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={AttachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
              />

              <TextField className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="Attachment Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={AttachmentCode}
                onChange={(e) => setAttachmentCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingAttachment !== null ? 'Update' : 'Add'}
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

export default Attachment;
