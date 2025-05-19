
import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card,
    Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography
} from '@mui/material';
import { Block, Edit } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import FamilyCodeApiService from '../../data/services/customer/familycode/familycode_api_service';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';

interface Family {
    id: number;
    name: string;
    code: string;
    status: string;
}

const FamilyCode: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [FamilyName, setFamilyName] = useState('');
    const [FamilyCode, setFamilyCode] = useState('');
    const [Familys, setFamilys] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingFamily, setEditingFamily] = useState<number | null>(null);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<'block' | 'unblock' | null>(null);
    const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const familyCodeService = new FamilyCodeApiService();

    useEffect(() => {
        fetchFamilys();

    }, []);

    const fetchFamilys = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const family = await familyCodeService.getFamilysCode();
            setFamilys(family);
        } catch (error) {
            console.error('Error fetching Familys:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { name: FamilyName, code: FamilyCode, uid: loginDetails.id,euid:'1' };
        try {
            if (editingFamily !== null) {
                await familyCodeService.updateFamilyCode(editingFamily, payload);
                setEditingFamily(null);
                setSuccessMessage('Family updated successfully!');

            } else {
                await familyCodeService.CreateFamilyCode(payload);
                setSuccessMessage('Family added successfully!');

            }
            setOpenSnackbar(true);

            setFamilyName('');
            setFamilyCode('');
            setDialogOpen(false);
            fetchFamilys();
        } catch (error) {
            console.error('Error saving Family:', error);
            setErrorMessage('Error saving Family.');
            setOpenSnackbar(true);
          }
        };
    const handleEdit = (family: Family) => {
        setFamilyName(family.name);
        setFamilyCode(family.code);
        setEditingFamily(family.id);
        setDialogOpen(true);
    };

    const handleToggleBlock = (family: any) => {
        setSelectedFamily(family);
        setDialogAction(family.status === 'DELETE' ? 'unblock' : 'block');
        setConfirmDialogOpen(true);
    };
    
    const handleConfirmDialog = async (confirmed: boolean) => {
        if (confirmed && selectedFamily) {
            try {
                if (dialogAction === 'block') {
                    await familyCodeService.blockFamilyCode(selectedFamily.id);
                    setSuccessMessage(`Family  blocked successfully!`);

                } else if (dialogAction === 'unblock') {
                    await familyCodeService.unblockFamilyCode(selectedFamily.id);
                    setSuccessMessage(`Family  Unblocked successfully!`);

                }
                fetchFamilys(); 
                setOpenSnackbar(true);

            } catch (error) {
                console.error('Error blocking Family:', error);
                setErrorMessage('Error blocking Family.');
                setOpenSnackbar(true);
              }
            }
        setConfirmDialogOpen(false);
        setSelectedFamily(null);
    };
    


    const openDialog = () => {
        setFamilyName('');
        setFamilyCode('');
        setEditingFamily(null);
        setDialogOpen(true);
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
                    <h6 className='allheading'>FAMILY CODE</h6>
                    <Button
                        className='MuiButton-root'
                        variant="contained"
                        color="primary"
                        onClick={openDialog}
                    >
                        Add New
                    </Button>
                </Box>

                <Loading isLoading={isLoading} hasError={hasError} hasData={Familys.length > 0}>
                    {Familys.length === 0 ? (
                        <h4 className='allheading' color="textSecondary">
                            No active Familys available. Please add a new Familys.
                        </h4>
                    ) : (
                        <TableContainer component={Card} style={{ maxHeight: '450px', overflow: 'auto' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="MuiTableCell-head">S.No</TableCell>
                                        <TableCell className="MuiTableCell-head">Name</TableCell>
                                        <TableCell className="MuiTableCell-head">Code</TableCell>
                                        <TableCell className="MuiTableCell-head">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Familys.map((family: Family, index: number) => (
                                        <TableRow key={family.id}>
                                            <TableCell className="small-cell">{index + 1}</TableCell>
                                            <TableCell className="small-cell">{family.name}</TableCell>
                                            <TableCell className="small-cell">{family.code}</TableCell>
                                            <TableCell className="small-cell">
                                                <IconButton onClick={() => handleToggleBlock(family)}>
                                                    {family.status === 'DELETE' ? (
                                                        <Block style={{ fontSize: '16px', color: "red" }} />
                                                    ) : (
                                                        <VisibilityIcon style={{ fontSize: '16px', color: "#1968dd" }} />
                                                    )}
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleEdit(family)}
                                                    disabled={family.status === 'DELETE'} 
                                                    style={{ padding: '1px' }}
                                                >
                                                    <Edit style={{ fontSize: '16px', color: "#1968dd" }} />
                                                </IconButton>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Loading>

                {/* Family Code Edit Dialog */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle className="custom-dialog-title">{editingFamily !== null ? 'Edit Family' : 'Add Family'}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', gap: '3%' }}>
                            <TextField
                                className="custom-textfield"

                                autoFocus
                                margin="dense"
                                label="Family Name"
                                type="text"
                                size="small"
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                value={FamilyName}
                                onChange={(e) => setFamilyName(e.target.value)}
                            />
                            <TextField
                                className="custom-textfield"

                                margin="dense"
                                label="Family Code"
                                type="text"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                variant="outlined"
                                value={FamilyCode}
                                onChange={(e) => setFamilyCode(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">Cancel</Button>
                        <Button onClick={handleSubmit} color="primary">
                            {editingFamily !== null ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Confirmation Dialog */}
                <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                    <DialogTitle className="custom-dialog-title">Confirmation</DialogTitle>
                    <DialogContent>
                        {selectedFamily && dialogAction === 'block' && (
                            <p>
                                Are you sure you want to block the Family code "{selectedFamily.name}" (Code: {selectedFamily.code})?
                            </p>
                        )}
                        {selectedFamily && dialogAction === 'unblock' && (
                            <p>
                                Are you sure you want to unblock the Family code "{selectedFamily.name}" (Code: {selectedFamily.code})?
                            </p>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleConfirmDialog(false)} color="primary">Cancel</Button>
                        <Button onClick={() => handleConfirmDialog(true)} color="primary">Confirm</Button>
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

export default FamilyCode;





// import React, { useState, useEffect } from 'react';
// import {
//     TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card,
//     Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography
// } from '@mui/material';
// import { Edit } from '@mui/icons-material';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import Header from '../../layouts/header/header';
// import Loading from '../../loading/Loading';
// import FamilyCodeApiService from '../../data/services/customer/familycode/familycode_api_service';
// import { useSelector } from 'react-redux';

// interface Family {
//     id: number;
//     name: string;
//     code: string;
//     status: string;
// }

// const FamilyCode: React.FC = () => {
//     const userDetails = useSelector((state: any) => state.loginReducer);
//     const loginDetails = userDetails.loginDetails;
//     const [FamilyName, setFamilyName] = useState('');
//     const [FamilyCode, setFamilyCode] = useState('');
//     const [Familys, setFamilys] = useState<any[]>([]);
//     const [blockedRows, setBlockedRows] = useState<any[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [editingFamily, setEditingFamily] = useState<number | null>(null);
//     const [hasError, setHasError] = useState(false);
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
//     const [dialogAction, setDialogAction] = useState<'block' | 'unblock' | null>(null);
//     const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
//     const familyCodeService = new FamilyCodeApiService();

//     useEffect(() => {
//         fetchFamilys();

//     }, []);

//     const fetchFamilys = async () => {
//         setIsLoading(true);
//         setHasError(false);
//         try {
//             const family = await familyCodeService.getFamilysCode();
//             setFamilys(family);
//         } catch (error) {
//             console.error('Error fetching Familys:', error);
//             setHasError(true);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleSubmit = async () => {
//         const payload = { name: FamilyName, code: FamilyCode, uid: loginDetails.id };
//         try {
//             if (editingFamily !== null) {
//                 await familyCodeService.updateFamilyCode(editingFamily, payload);
//                 setEditingFamily(null);
//             } else {
//                 await familyCodeService.CreateFamilyCode(payload);
//             }
//             setFamilyName('');
//             setFamilyCode('');
//             setDialogOpen(false);
//             fetchFamilys();
//         } catch (error) {
//             console.error('Error saving channel:', error);
//         }
//     };

//     const handleEdit = (family: Family) => {
//         setFamilyName(family.name);
//         setFamilyCode(family.code);
//         setEditingFamily(family.id);
//         setDialogOpen(true);
//     };

//     const handleToggleBlock = (family: Family) => {
//         setSelectedFamily(family);
//         setDialogAction(blockedRows.includes(family.id) ? 'unblock' : 'block');
//         setConfirmDialogOpen(true);
//     };

//     const handleConfirmDialog = async (confirmed: boolean) => {
//         if (confirmed && selectedFamily) {
//             try {
//                 if (dialogAction === 'block') {
//                     await familyCodeService.blockFamilyCode(selectedFamily.id);

//                     setBlockedRows((prev) => [...prev, selectedFamily.id]);
//                 } else if (dialogAction === 'unblock') {
//                     await familyCodeService.unblockFamilyCode(selectedFamily.id);

//                     setBlockedRows((prev) => prev.filter((id) => id !== selectedFamily.id));
//                 }

//                 fetchFamilys();
//             } catch (error) {
//                 console.error('Error toggling block status:', error);
//             }
//         }
//         setConfirmDialogOpen(false);
//         setSelectedFamily(null);
//     };

//     const openDialog = () => {
//         setFamilyName('');
//         setFamilyCode('');
//         setEditingFamily(null);
//         setDialogOpen(true);
//     };

//     return (
//         <Box sx={{ display: 'flex' }}>
//             <Header />
//             <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
//                     <h6 className='allheading'>FAMILY CODE</h6>
//                     <Button
//                         className='MuiButton-root'
//                         variant="contained"
//                         color="primary"
//                         onClick={openDialog}
//                     >
//                         Add New
//                     </Button>
//                 </Box>

//                 <Loading isLoading={isLoading} hasError={hasError} hasData={Familys.length > 0}>
//                     {Familys.length === 0 ? (
//                         <h4 className='allheading' color="textSecondary">
//                             No active Familys available. Please add a new channel.
//                         </h4>
//                     ) : (
//                         <TableContainer component={Card} style={{ maxHeight: '450px', overflow: 'auto' }}>
//                             <Table size="small">
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell className="MuiTableCell-head">S.No</TableCell>
//                                         <TableCell className="MuiTableCell-head">Name</TableCell>
//                                         <TableCell className="MuiTableCell-head">Code</TableCell>
//                                         <TableCell className="MuiTableCell-head">Actions</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {Familys.map((family: Family, index: number) => (
//                                         <TableRow key={family.id}>
//                                             <TableCell className="small-cell">{index + 1}</TableCell>
//                                             <TableCell className="small-cell">{family.name}</TableCell>
//                                             <TableCell className="small-cell">{family.code}</TableCell>
//                                             <TableCell className="small-cell">
//                                                 <IconButton onClick={() => handleToggleBlock(family)}>
//                                                     {blockedRows.includes(family.id) ? (
//                                                         <VisibilityOffIcon style={{ fontSize: '16px', color: "red" }} />
//                                                     ) : (
//                                                         <VisibilityIcon style={{ fontSize: '16px', color: "1968dd" }} />
//                                                     )}
//                                                 </IconButton>
//                                                 <IconButton
//                                                     onClick={() => handleEdit(family)}
//                                                     disabled={blockedRows.includes(family.id)}
//                                                     style={{ padding: '1px' }}
//                                                 >
//                                                     <Edit style={{ fontSize: '16px', color: "#1968dd" }} />
//                                                 </IconButton>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     )}
//                 </Loading>

//                 {/* Family Code Edit Dialog */}
//                 <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
//                     <DialogTitle className="custom-dialog-title">{editingFamily !== null ? 'Edit Family' : 'Add Family'}</DialogTitle>
//                     <DialogContent>
//                         <div style={{ display: 'flex', gap: '3%' }}>
//                             <TextField
//                                 className="custom-textfield"

//                                 autoFocus
//                                 margin="dense"
//                                 label="Family Name"
//                                 type="text"
//                                 size="small"
//                                 fullWidth
//                                 autoComplete="off"
//                                 variant="outlined"
//                                 value={FamilyName}
//                                 onChange={(e) => setFamilyName(e.target.value)}
//                             />
//                             <TextField
//                                 className="custom-textfield"

//                                 margin="dense"
//                                 label="Family Code"
//                                 type="text"
//                                 size="small"
//                                 autoComplete="off"
//                                 fullWidth
//                                 variant="outlined"
//                                 value={FamilyCode}
//                                 onChange={(e) => setFamilyCode(e.target.value)}
//                             />
//                         </div>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={() => setDialogOpen(false)} color="primary">Cancel</Button>
//                         <Button onClick={handleSubmit} color="primary">
//                             {editingFamily !== null ? 'Update' : 'Add'}
//                         </Button>
//                     </DialogActions>
//                 </Dialog>

//                 {/* Confirmation Dialog */}
//                 <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
//                     <DialogTitle className="custom-dialog-title">Confirmation</DialogTitle>
//                     <DialogContent>
//                         {selectedFamily && dialogAction === 'block' && (
//                             <p>
//                                 Are you sure you want to block the Family code "{selectedFamily.name}" (Code: {selectedFamily.code})?
//                             </p>
//                         )}
//                         {selectedFamily && dialogAction === 'unblock' && (
//                             <p>
//                                 Are you sure you want to unblock the Family code "{selectedFamily.name}" (Code: {selectedFamily.code})?
//                             </p>
//                         )}
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={() => handleConfirmDialog(false)} color="primary">Cancel</Button>
//                         <Button onClick={() => handleConfirmDialog(true)} color="primary">Confirm</Button>
//                     </DialogActions>
//                 </Dialog>
//             </Box>
//         </Box>
//     );
// };

// export default FamilyCode;


