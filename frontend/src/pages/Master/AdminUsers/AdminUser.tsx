import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Table, TableHead, TableRow, Checkbox, TableCell, TableBody, IconButton, TableContainer, Card,
    Box, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, Badge, Paper, Typography, FormControlLabel } from '@mui/material';
import { Edit, } from '@mui/icons-material';
import AdminUserApiService from '../../../data/services/master/AdminUser/adminuser_api_serivice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheckCircle, faPhone, faEnvelope, faUsers, faUser, faBirthdayCake } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { ReactElement, JSXElementConstructor, ReactNode } from 'react';
import { InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Loading from '../../../loading/Loading';
import Header from '../../../layouts/header/header';

interface AdminUser {
    id: string;
    fullName: string;
    userName: string;
    email: string;
    dob: string;
    genderId: string;
    phoneNo: string;
    validFrm: string;
    validTo: string;
    maritalStatusId: string;
    adminGroup: string;
    password: string;
    superUser: boolean;
    uid: string;
    status: string;
}

const AdminUserComponent: React.FC = () => {
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAdminUser, setEditingAdminUser] = useState<AdminUser | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isSuperUser, setIsSuperUser] = useState(false);
    const [viewingAdminUser, setViewingAdminUser] = useState<AdminUser | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    const adminUserService = new AdminUserApiService();

    useEffect(() => {
        fetchAdminUsers();
    }, []);

    const fetchAdminUsers = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await adminUserService.getAdminUserOptions();
            setAdminUsers(response);
        } catch (error) {
            setHasError(true);
            setErrorMessage('Error fetching admin users.');
            console.error('Error fetching admin users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddOrUpdate = async () => {
        if (!editingAdminUser) return;

        const payload = {
            fullName: editingAdminUser.fullName,
            userName:editingAdminUser.userName,
            email: editingAdminUser.email   ,
            dob: editingAdminUser.dob,
            phoneNo: editingAdminUser.phoneNo,
            genderId: editingAdminUser.genderId,
            validFrm: editingAdminUser.validFrm,
            validTo: editingAdminUser.validTo,
            maritalStatusId: editingAdminUser.maritalStatusId,
            adminGroup: editingAdminUser.adminGroup,
            superUser: editingAdminUser.superUser ? 'true' : 'false',

            uid: editingAdminUser.uid,
            password: editingAdminUser.password, 
        };

        if (editingAdminUser.password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            return;
        }

        try {
            if (editingAdminUser.id) {
                await adminUserService.updateAdminUser(editingAdminUser.id, payload);
                setSuccessMessage('Admin user updated successfully!');
            } else {
                await adminUserService.doMasterAdminUser(payload);
                setSuccessMessage('Admin user added successfully!');
            }
            setDialogOpen(false);
            fetchAdminUsers();
            clearForm();
        } catch (error) {
            setErrorMessage('Error saving admin user.');
        } finally {
            setOpenSnackbar(true);
        }
    };

    const clearForm = () => {
        setEditingAdminUser(null);
        setPassword('');
        setConfirmPassword('');
        setConfirmPasswordError('');
    };
    const openDialog = () => {
        setEditingAdminUser(null);

        setDialogOpen(true);
    };

    const handleEdit = (adminUser: AdminUser) => {
        setEditingAdminUser(adminUser);

        setDialogOpen(true);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
        setSuccessMessage('');
        setErrorMessage('');
    };
    const handleView = (adminUser: AdminUser) => {
        setViewingAdminUser(adminUser);
        setViewDialogOpen(true);
    };
    const backendColumns = ['User Name', 'Full Name', 'Dob', 'Phone Number', 'Email Id', 'Admin Group', 'Status', 'Super User'];

    const getColumnIcon = (columnName: string) => {
        switch (columnName) {
            case 'User Name':
                return <FontAwesomeIcon icon={faUser}  className="custom-icon" />;
            case 'Full Name':
                return <FontAwesomeIcon icon={faUser}  className="custom-icon" />;
            case 'Dob':
                return <FontAwesomeIcon icon={faBirthdayCake}  className="custom-icon" />;
            case 'Phone Number':
                return <FontAwesomeIcon icon={faPhone} className="custom-icon"  />;
            case 'Email Id':
                return <FontAwesomeIcon icon={faEnvelope} className="custom-icon"  />;
            case 'Admin Group':
                return <FontAwesomeIcon icon={faUsers} className="custom-icon"  />;
            case 'Status':
                return <FontAwesomeIcon icon={faCheckCircle} className="custom-icon"  />;
            case 'Super User':
                return <FontAwesomeIcon icon={faStar} className="custom-icon" />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined) => {
        switch (status) {
            case 'ACTIVE':
                return (
                    <Badge className="custom-badge"
                        color="success"
                        badgeContent={status}
                    />
                );
            case 'DELETE':
                return (
                    <Badge className="custom-badge"
                        color="error"
                        badgeContent={status}
                        sx={{ bgcolor: 'error.main', color: 'error.contrastText', borderRadius: '999px', py: '2px', px: '8px',  }}
                    />
                );
            default:
                return (
                    <Badge className="custom-badge"
                        color="info"
                        badgeContent={status}
                    />
                );
        }
    };

    const renderColumnValue = (columnName: string) => {
        if (!viewingAdminUser) return 'Not Available';

        switch (columnName) {
            case 'User Name':
            case 'Full Name':
                return viewingAdminUser.fullName || 'Not Available';
            case 'Dob':
                return viewingAdminUser.dob ? format(new Date(viewingAdminUser.dob), 'dd-MMM-yyyy') : 'Not Available';
            case 'Phone Number':
                return viewingAdminUser.phoneNo || 'Not Available';
            case 'Email Id':
                return viewingAdminUser.email || 'Not Available';
            case 'Admin Group':
                return viewingAdminUser.adminGroup || 'Not Available';
            case 'Status':
                return viewingAdminUser.status ? getStatusBadge(viewingAdminUser.status) : 'Not Available';
            case 'Super User':
                return viewingAdminUser.superUser ? 'Yes' : 'No';
            default:
                return null;
        }
    };

    const renderTableRows = () => {
        return backendColumns.map((columnName, index) => (
            <TableRow key={columnName} style={{ height: '30px' }}>
                <TableCell className="custom-column-header">
                    <div style={{ display: 'flex', alignItems: 'center', lineHeight: '1' }}>
                        <span style={{ marginRight: '10px' }}>{getColumnIcon(columnName)}</span>
                        <Typography className='confirmation-text'variant="body1" fontWeight="bold" style={{ marginLeft: '3px', lineHeight: '1' }}>
                            {columnName}
                        </Typography>
                    </div>
                </TableCell>
                <TableCell>
                    <div style={{ marginLeft: '20px' }}>
                        {renderColumnValue(columnName)}
                    </div>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h6 className='allheading'>Admin user</h6>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            className='MuiButton-root'
                            variant="contained"
                            color="primary"
                            onClick={openDialog}
                        >
                            Add New
                        </Button>

                    </div>

                </Box>
                <Loading isLoading={isLoading} hasError={hasError} hasData={adminUsers.length > 0}>
                    {adminUsers.length === 0 ? (
                        <Typography className='confirmation-text' variant="body1" color="textSecondary">
                            No active adminUsers available. Please add a new channel.
                        </Typography>
                    ) : (
                        <>
                            <TableContainer component={Card} style={{ maxHeight: '450px', overflow: 'auto' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align='center'>S.No</TableCell>
                                            <TableCell align='center'>Full Name</TableCell>
                                            <TableCell align='center'>User Name</TableCell>
                                            <TableCell align='center'>Email</TableCell>
                                            <TableCell align='center'>DOB</TableCell>
                                            <TableCell align='center'>Status</TableCell>
                                            <TableCell align='center'>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {adminUsers.map((adminUser, index: number) => (
                                            <TableRow key={adminUser.id}>
                                                <TableCell align='center'>{index + 1}</TableCell>
                                                <TableCell align='center'>{adminUser.fullName}</TableCell>
                                                <TableCell align='center'>{adminUser.userName}</TableCell>
                                                <TableCell align='center'>{adminUser.email}</TableCell>
                                                <TableCell align='center'>{format(new Date(adminUser.dob), 'dd-MMM-yyyy')}</TableCell>
                                                <TableCell align='center'>{getStatusBadge (adminUser.status)}</TableCell>
                                                <TableCell align='center'>
                                                    <IconButton onClick={() => handleEdit(adminUser)}>
                                                        <Edit style={{ fontSize: '16px', color: "#1968dd" }} />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleView(adminUser)} >
                                                        <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
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

                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
                    maxWidth="md">
                    <DialogTitle className="custom-dialog-title">{editingAdminUser?.id ? 'Edit Admin User' : 'Add Admin User'}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: '2', flexWrap: 'wrap', gap: '3%' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>

                                <TextField className="custom-textfield .MuiInputBase-root"
                                    label="Full Name"
                                    value={editingAdminUser?.fullName || ''}
                                    onChange={(e) => setEditingAdminUser({ ...editingAdminUser!, fullName: e.target.value })}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField className="custom-textfield .MuiInputBase-root"
                                    label="User Name"
                                    value={editingAdminUser?.userName || ''}
                                    onChange={(e) => setEditingAdminUser({ ...editingAdminUser!, userName: e.target.value })}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                />
                            </div>


                            <TextField className="custom-textfield .MuiInputBase-root"
                                label="Email"
                                value={editingAdminUser?.email || ''}
                                onChange={(e) => setEditingAdminUser({ ...editingAdminUser!, email: e.target.value })}
                                size="small"
                                fullWidth
                                margin="normal"
                            />
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <TextField className="custom-textfield .MuiInputBase-root"
                                    label="Phone Number"
                                    value={editingAdminUser?.phoneNo || ''}
                                    onChange={(e) => setEditingAdminUser({ ...editingAdminUser!, phoneNo: e.target.value })}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                />

                                <TextField className="custom-textfield .MuiInputBase-root"
                                    label="Date of Birth"
                                    type="date"
                                    value={editingAdminUser?.dob || ''}
                                    onChange={(e) => setEditingAdminUser({ ...editingAdminUser!, dob: e.target.value })}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>


                                <TextField className="custom-textfield .MuiInputBase-root"
                                    label="Valid From"
                                    type="date"
                                    value={editingAdminUser?.validFrm || ''}
                                    onChange={(e) => setEditingAdminUser({ ...editingAdminUser!, validFrm: e.target.value })}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                />

                                <TextField className="custom-textfield .MuiInputBase-root"
                                    label="Valid To"
                                    type="date"
                                    value={editingAdminUser?.validTo || ''}
                                    onChange={(e) => setEditingAdminUser({ ...editingAdminUser!, validTo: e.target.value })}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </div>


                            <div style={{ display: 'flex', gap: '16px' }}>

                                <TextField className="custom-textfield .MuiInputBase-root"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}

                                    value={editingAdminUser?.password || ''}
                                    onChange={(e) => setEditingAdminUser({ ...editingAdminUser!, password: e.target.value })}


                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                    {showPassword ? <VisibilityOff style={{ fontSize: '16px', color: "#1968dd" }} /> : <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField className="custom-textfield .MuiInputBase-root"
                                    label="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword} 
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setConfirmPasswordError(e.target.value !== editingAdminUser?.password ? "Passwords do not match" : '');
                                    }}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    error={!!confirmPasswordError}
                                    helperText={confirmPasswordError}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                    {showConfirmPassword ? <VisibilityOff style={{ fontSize: '16px', color: "#1968dd" }} /> : <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={editingAdminUser?.superUser || false}
                                        onChange={(e) => setEditingAdminUser({
                                            ...editingAdminUser!,
                                            superUser: e.target.checked // Use checked instead of value
                                        })}
                                        name="isSuperUser"
                                        size="small"
                                    />
                                }
                                // label="Super User"
                                label="Super User"
                                classes={{ label: 'custom-label' }}
                            />
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddOrUpdate} variant="contained" color="primary">
                            {editingAdminUser?.id ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} fullWidth
                    maxWidth="md">
                    <DialogTitle className="custom-dialog-title">View Admin User</DialogTitle>
                    <DialogContent>
                        <div >
                            <TableContainer component={Paper}>
                                <Table >
                                    <TableBody>{renderTableRows()}</TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setViewDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    {successMessage || errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminUserComponent;
