import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem, Box, Snackbar, Button } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Header from '../../layouts/header/header';
import { useNavigate } from "react-router-dom";
import { Card, Form } from 'react-bootstrap';
import AuthAdminApiService from '../../data/services/authadminuser/authu-admin-api-service';
import AdminUserRightsApiService from '../../data/services/adminuserrights/athu-adminuserrights-api-service';
import { AdminUserRightsPayload } from '../../data/services/adminuserrights/athu-adminuserrights-payload';
import AuthConfigModuleModuleDetApiService from '../../data/services/configmodulemoduledet/authu-configmodulemoduledet-api-service';

interface AdminUser {
  id: string;
  userName: string;
  fullName: string;
}

interface ConfigModuleModuleDet {
  id: string;
  modid: number;
  moddetid: number;
  modname: string;
  moddetname: string;
}

interface UserAccess {
  id: number;
  uid: number;
  modId: number;
  modDetId: number;
  entUid: number;
  status: string;
}

interface AdminInputRefType extends HTMLSelectElement { }
interface ValidationMessageRefType extends HTMLParagraphElement { }

const AdminUserrights = () => {

  const [adminusers, setAdminusers] = useState<AdminUser[]>([]);
  const [selectedadminuser, setSelectedadminuser] = useState('');
  const [selectedModIds, setSelectedModIds] = useState<string[]>([]);
  const [selectedModDetIds, setSelectedModDetIds] = useState<string[]>([]);
  const [configModuleModuleDet, setConfigModuleModuleDet] = useState<ConfigModuleModuleDet[]>([]);
  const authService = new AuthAdminApiService();
  const AdminUserRightsService = new AdminUserRightsApiService();
  const authConfigModuleModuleDetService = new AuthConfigModuleModuleDetApiService();
  const [adminUserValidationError, setAdminUserValidationError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [userAccess, setUserAccess] = useState<UserAccess[]>([]);
  const adminInputRef = useRef<AdminInputRefType>(null);
  const validationMessageRef = useRef<ValidationMessageRefType>(null);
  const [filteredUserAccess, setFilteredUserAccess] = useState<UserAccess[]>([]);
  const [checkboxStatus, setCheckboxStatus] = useState<{ [key: string]: boolean }>({});
  const [filteredCheckboxStatus, setFilteredCheckboxStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchAdminusers();
    fetchConfigModuleModuleDet();
    fetchUserAccess();
  }, []);

  useEffect(() => {
  }, [selectedModIds, selectedModDetIds]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (selectedadminuser) {
      const selectedUser = adminusers.find(user => user.fullName === selectedadminuser);
      if (selectedUser) {
        fetchUserAccess();
      } else {
        console.error("Selected admin user not found.");
      }
    }
  }, [selectedadminuser, adminusers]);

  const fetchAdminusers = async () => {
    try {
      let adminusers: AdminUser[] = await authService.getadminuser();
      adminusers = adminusers.map((adminuser: AdminUser) => ({
        ...adminuser,
      }));
      setAdminusers(adminusers);
    } catch (error) {
      console.error("Error fetching admin users:", error);
    }
  };

  const fetchUserAccess = async () => {
    try {
      const UserAccess = await AdminUserRightsService.getUserAccess();
      const selectedUser = adminusers.find(user => user.fullName === selectedadminuser);
      if (selectedUser) {
        const filteredAccess = UserAccess.filter((access: { uid: string, status: string }) => access.uid === selectedUser.id.toString() && access.status === "ACTIVE");
        setFilteredUserAccess(filteredAccess);
        setUserAccess(UserAccess);
      } else {
        console.error("Selected admin user not found.");
      }
    } catch (error) {
      console.error("Error fetching User Access:", error);
    }
  };

  const fetchConfigModuleModuleDet = async () => {
    try {
      const response = await authConfigModuleModuleDetService.getConfigModuleModuleDet();
      setConfigModuleModuleDet(response);
      return response;
    } catch (error) {
      console.error("Error fetching config modules:", error);
    }
  };

  const modIdSet = new Set<number>();
  let snCount = 0;

  const handleCheckboxChange = async (id: string | null, modId: string, modDetId: string, checked: boolean): Promise<void> => {
    setCheckboxStatus(prevCheckboxStatus => {
      const updatedCheckboxStatus = { ...prevCheckboxStatus, [`${modId}-${modDetId}`]: checked };
      if (!checked && id) {
        setFilteredUserAccess(prevAccess => prevAccess.filter(access =>
          !(access.modId === Number(modId) && access.modDetId === Number(modDetId))
        ));
        AdminUserRightsService.blockUser(id)
          .then(() => {
            console.log(`User has been blocked.`);
          })
          .catch((error: any) => {
            console.error(`Error blocking user access for modId ${modId}:`, error);
          });
      }
      return updatedCheckboxStatus;
    });
    setAdminUserValidationError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedadminuser) {
        setAdminUserValidationError("Please Select User and Give Permission.");
        if (adminInputRef.current) {
          adminInputRef.current.focus();
        }
        return;
      }
      const selectedUser = adminusers.find((user) => user.fullName === selectedadminuser);
      if (!selectedUser) {
        return;
      }
      const payload: AdminUserRightsPayload[] = selectedModIds.map((modId, index) => ({
        id: selectedUser.id,
        modId: modId + '',
        uid: selectedUser.id,
        entUid: '1',
        modDetId: selectedModDetIds[index] + '',
        valid: 'True',
        fullName: selectedUser.fullName || '',
      }));
      const selectedPermissions = Object.keys(checkboxStatus)
        .filter(key => checkboxStatus[key])
        .map(key => key.split('-'))
        .map(([modId, modDetId]) => ({
          id: selectedUser.id,
          modId,
          uid: selectedUser.id,
          entUid: '1',
          modDetId,
          valid: 'True',
          fullName: selectedUser.fullName || '',

        }));
      payload.push(...selectedPermissions);
      const response = await AdminUserRightsService.saveAdminUserRights(payload);
      setAdminUserValidationError(null);
      setSaveSuccess(true);
      setSnackbarSeverity('success');
      setSnackbarMessage('Save successful!');
      setSnackbarOpen(true);
      window.location.reload();
    } catch (error) {
      console.error("Error saving AdminUserRights:", error);
      setSaveSuccess(false);
      setSnackbarSeverity('error');
      setSnackbarMessage('Save failed. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const isCheckboxChecked = (modId: number, modDetId: number): { checked: boolean, id: string | null } => {
    const foundAccess = filteredUserAccess.find(access =>
      access.modId === modId && access.modDetId === modDetId
    );
    return {
      checked: !!foundAccess,
      id: foundAccess ? foundAccess.id.toString() : null
    };
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4, caretColor: 'transparent' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h6 className='allheading'>USER PERMISSION</h6>
          </Box>

          <FormControl className="custom-textfield .MuiInputBase-root" fullWidth variant="outlined" margin="dense" style={{ width: '30%' }}>
            <InputLabel className="custom-textfield .MuiInputBase-root" htmlFor="adminuser">Admin User</InputLabel>
            <Select className="custom-textfield .MuiInputBase-root"
              label="adminuser"
              value={selectedadminuser}
              onChange={(e) => {
                const selectedfullName = e.target.value as string;
                setSelectedadminuser(selectedfullName);
                setAdminUserValidationError(null);
                const selectedUser = adminusers.find(user => user.fullName === selectedfullName);
                if (selectedUser) {
                  console.log("Selected Admin User:", selectedUser);
                  fetchUserAccess();
                } else {
                  console.error("Selected admin user not found.");
                }
              }}
              name="adminuser"
              variant="outlined"
              size="small"
              inputRef={adminInputRef}
              required
            >
              <MenuItem className="custom-menu-item" value="">Select Admin User</MenuItem>
              {adminusers.map((adminuser) => (
                <MenuItem className="custom-menu-item" key={adminuser.id} value={adminuser.fullName}>
                  {adminuser.fullName}
                </MenuItem>
              ))}
            </Select>
            {adminUserValidationError && (
              <Form.Text ref={validationMessageRef} className="text-danger">{adminUserValidationError}</Form.Text>
            )}
          </FormControl>

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
                  <TableCell className="MuiTableCell-head">S.No</TableCell>
                  <TableCell className="MuiTableCell-head"> Group</TableCell>
                  <TableCell className="MuiTableCell-head"> SubGroup </TableCell>
                  <TableCell className="MuiTableCell-head">Permission</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {configModuleModuleDet.length > 0 ? (
                  configModuleModuleDet.map((moduleDet, index) => {
                    const isFirstInGroup =
                      index === 0 || moduleDet.modname !== configModuleModuleDet[index - 1].modname;
                    const groupSize = configModuleModuleDet.filter((m) => m.modname === moduleDet.modname).length;
                    const isNewModId = !modIdSet.has(moduleDet.modid);
                    if (isNewModId) {
                      snCount += 1;
                      modIdSet.add(moduleDet.modid);
                    }
                    return (
                      <TableRow key={moduleDet.modid ? moduleDet.moddetid.toString() : ''}>
                        {isFirstInGroup ? (<TableCell rowSpan={groupSize} style={{ borderRight: '1px solid #ddd' }}> {snCount}</TableCell>) : null}
                        {isFirstInGroup ? (<TableCell rowSpan={groupSize} style={{ borderRight: '1px solid #ddd' }}>{moduleDet.modname}</TableCell>) : null}
                        <TableCell className="small-cell">{moduleDet.moddetname}</TableCell>
                        <TableCell className="small-cell">
                          <input
                            type="checkbox"
                            checked={isCheckboxChecked(moduleDet.modid, moduleDet.moddetid).checked || checkboxStatus[`${moduleDet.modid}-${moduleDet.moddetid}`]}
                            onChange={(e) =>
                              handleCheckboxChange(
                                isCheckboxChecked(moduleDet.modid, moduleDet.moddetid).id,
                                moduleDet.modid.toString(),
                                moduleDet.moddetid.toString(),
                                e.target.checked
                              )
                            }
                            style={{ width: '15px', height: '15px', fontSize: '16px' }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>Loading...</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <br></br>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </div>
        </Box>

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <MuiAlert
            elevation={6}
            variant="filled"
            severity={snackbarSeverity}
            onClose={handleSnackbarClose}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>

      </Box>
    </>
  )

};

export default AdminUserrights;