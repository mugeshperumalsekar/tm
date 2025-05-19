// import React, { useState, useEffect, useRef } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem, Box, Snackbar, Button, Typography, Alert, Container, Card } from '@mui/material';
// import { SelectChangeEvent } from '@mui/material/Select';
// import AuthAdminApiService from '../../../data/services/authadminuser/authu-admin-api-service';
// import AppLayout from '../../../layouts/layout/layout';
// import { Form } from 'react-bootstrap';
// import AdmingroupApiService from '../../../data/services/master/AdminGroup/admingroup_api_service';
// import Header from '../../../layouts/header/header';

// interface GroupPayload {
//     id: number;
//     name: string;
// }

// interface AuthAdminPayload {
//     id: number;
//     userName: string;
// }

// interface CategoryPayload {
//     id: number;
//     groupId: number;
//     name: string;
// }

// interface AdminPayload {
//     id: number;
//     groupId: number;
//     categoryId: number;
//     clientId: number;
// }

// interface ClientPayload {
//     id: number;
//     groupId: number;
//     categoryId: number;
//     clientId: number;
//     userId: number;
// }
// interface AdminInputRefType extends HTMLSelectElement { }

// interface ValidationMessageRefType extends HTMLParagraphElement { }

// const Client = () => {
//     const [groups, setGroups] = useState<GroupPayload[]>([]);
//     const [clients, setClients] = useState<AuthAdminPayload[]>([]);
//     const [userNames, setUserNames] = useState<AuthAdminPayload[]>([]);
//     const [categories, setCategories] = useState<CategoryPayload[]>([]);
//     const [adminData, setAdminData] = useState<{ [groupId: number]: { groupName: string, categories: CategoryPayload[] } }>({});
//     const [checkboxStatus, setCheckboxStatus] = useState<{ [key: string]: boolean }>({});
//     const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false);
//     const [errorMessage, setErrorMessage] = useState<string>('');
//     const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false);
//     const [selectedClient, setSelectedClient] = useState<number | ''>('');

//     const groupService = new AdmingroupApiService();
//     const categoryService = new AdmingroupApiService();
//     const authService = new AdmingroupApiService();
//     const adminService = new AdmingroupApiService();
//     const userService = new AuthAdminApiService()
//     const clientService = new AdmingroupApiService();
//     const [adminUserValidationError, setAdminUserValidationError] = useState<string | null>(null);
//     const validationMessageRef = useRef<ValidationMessageRefType>(null);
//     const adminInputRef = useRef<AdminInputRefType>(null);


//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [groupsData, categoriesData, clientsData, userNamesData] = await Promise.all([
//                     groupService.getGroupOptions(),
                    
//                     categoryService.getCategories(),
//                     userService.getadminuser(),
//                     authService.getUserName()
//                 ]);
//                 setGroups(groupsData || []);
//                 setCategories(categoriesData || []);
//                 setClients(clientsData || []);
//                 setUserNames(userNamesData || []);
//                 if (clientsData.length > 0) {
//                     setSelectedClient(clientsData[0].id);
//                 }
//             } catch (error) {
//                 console.error("Error fetching initial data:", error);
//             }
//         };

//         fetchData();
//     }, []);

//     useEffect(() => {
//         if (selectedClient !== '') {
//             fetchAdminData(Number(selectedClient));
//         }
//     }, [selectedClient]);

//     useEffect(() => {
//         const savedCheckboxStatus = localStorage.getItem('checkboxStatus');
//         if (savedCheckboxStatus) {
//             setCheckboxStatus(JSON.parse(savedCheckboxStatus));
//         }
//     }, []);

//     useEffect(() => {
//         localStorage.setItem('checkboxStatus', JSON.stringify(checkboxStatus));
//     }, [checkboxStatus]);

//     const fetchAdminData = async (clientId: number) => {
//         try {
//             const response = await adminService.getClientsAdmin();
//             const groupedData = response.reduce((acc: { [groupId: number]: { groupName: string, categories: CategoryPayload[] } }, admin: AdminPayload) => {
//                 const group = groups.find(g => g.id === admin.groupId);
//                 if (group) {
//                     if (!acc[admin.groupId]) {
//                         acc[admin.groupId] = { groupName: group.name, categories: [] };
//                     }
//                     const category = categories.find(c => c.id === admin.categoryId);
//                     if (category) {
//                         acc[admin.groupId].categories.push(category);
//                         const key = `${admin.groupId}-${admin.categoryId}-${clientId}`;
//                         setCheckboxStatus(prev => ({
//                             ...prev,
//                             [key]: prev[key] !== undefined ? prev[key] : false,
//                         }));
//                     }
//                 }
//                 return acc;
//             }, {});
//             setAdminData(groupedData);
//         } catch (error) {
//             console.error("Error fetching admin data:", error);
//         }
//     };
//     // handleClientChange
//     const handleClientChange = (event: SelectChangeEvent<number | ''>) => {
//         const value = event.target.value;
//         setSelectedClient(value === '' ? '' : Number(value));
//     };

//     const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, groupId: number, categoryId: number, clientId: number) => {
//         const key = `${groupId}-${categoryId}-${clientId}`;
//         const newStatus = e.target.checked;

//         setCheckboxStatus(prev => ({
//             ...prev,
//             [key]: newStatus,
//         }));
//     };

//     const handleSave = async (e: React.FormEvent) => {
//         e.preventDefault();
//         // if (!selectedClient) {
//         //     setAdminUserValidationError("Please Select User and Give Permission.");
//         //     if (adminInputRef.current) {
//         //       adminInputRef.current.focus();
//         //     }
//         //     return;
//         //   }



//         try {
//             if (selectedClient === '') {
//                 setAdminUserValidationError("Please Select User and Give Permission.");
//                 if (adminInputRef.current) {
//                     adminInputRef.current.focus();
//                 }
//                 setErrorMessage("Please choose a client.");
//                 setIsErrorOpen(true);
//                 return;
//             }

//             const updatedAdminData: ClientPayload[] = Object.entries(checkboxStatus)
//                 .filter(([key, isChecked]) => isChecked)
//                 .map(([key]) => {
//                     const [groupId, categoryId] = key.split('-').map(Number);
//                     return { id: 0, groupId, categoryId, clientId: Number(selectedClient), userId: 1 };
//                 });

//             if (updatedAdminData.length === 0) {
//                 setErrorMessage("No permissions selected. Please check atleast one box.");
//                 setIsErrorOpen(true);
//                 return;
//             }
//             await Promise.all(updatedAdminData.map(payload => clientService.createClient(payload)));
//             setAdminUserValidationError(null);
//             setIsSuccessOpen(true);
//         } catch (error) {
//             console.error("Error saving admin:", error);
//             setErrorMessage('Save failed. Please try again.');
//             setIsErrorOpen(true);
//         }
//     };

//     const showErrorMessage = (message: string) => {
//         setErrorMessage(message);
//         setIsErrorOpen(true);
//     };


//     return (
//         <>
//             <Box sx={{ display: 'flex' }}>
//                 <Header />
//                 <Box component="main" sx={{ flexGrow: 1, m: 7 }}>
//                     <Card style={{
//                         boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
//                         padding: '1%'
//                     }}>

//                         <h6 className='allheading' >CLIENT ACCESS</h6>
//                         <Box mb={4}>
//                             <FormControl style={{ width: '300px' }} variant="outlined" margin="dense">
//                                 <InputLabel htmlFor="client" className='check'>Client</InputLabel>
//                                 <Select
//                                     label="Client"
//                                     value={selectedClient}
//                                     onChange={handleClientChange}
//                                     variant="outlined"
//                                     size="small"
//                                     className='check'
//                                     MenuProps={{
//                                         PaperProps: {
//                                             style: {
//                                                 maxHeight: 200,
//                                                 width: 300,
//                                             },
//                                         },
//                                     }}
//                                 >
//                                     <MenuItem value="" className='check'>Select Client</MenuItem>

//                                     {userNames.map((user) => (
//                                         <MenuItem key={user.id} value={user.id}>
//                                             {user.userName}
//                                         </MenuItem>
//                                     ))}
//                                     {adminUserValidationError && (
//                                         <Form.Text ref={validationMessageRef} className="text-danger">{adminUserValidationError}</Form.Text>
//                                     )}
//                                 </Select>
//                             </FormControl>
//                         </Box>
//                         <TableContainer style={{ maxHeight: '400px', overflowY: 'auto' }}>
//                             <Table size="small" >
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white', width: '10%' }}>S.No</TableCell>
//                                         <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white', width: '10%' }}>Group</TableCell>
//                                         <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white', width: '10%' }}>Category</TableCell>
//                                         <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white', width: '10%' }}>Permissions</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {Object.entries(adminData).length > 0 ? (
//                                         Object.entries(adminData).map(([groupId, groupData], index) => (
//                                             <React.Fragment key={groupId}>
//                                                 {groupData.categories.map((category, subIndex) => (
//                                                     <TableRow key={`${groupId}-${category.id}`}>
//                                                         {subIndex === 0 && (
//                                                             <TableCell rowSpan={groupData.categories.length} style={{ borderRight: '1px solid #ddd' }}>
//                                                                 {index + 1}
//                                                             </TableCell>
//                                                         )}
//                                                         {subIndex === 0 && (
//                                                             <TableCell rowSpan={groupData.categories.length} style={{ borderRight: '1px solid #ddd' }}>
//                                                                 {groupData.groupName}
//                                                             </TableCell>
//                                                         )}
//                                                         <TableCell style={{ borderRight: '1px solid #ddd' }}>{category.name}</TableCell>
//                                                         <TableCell>
//                                                             <input
//                                                                 type="checkbox"
//                                                                 checked={checkboxStatus[`${groupId}-${category.id}-${selectedClient}`] || false}
//                                                                 onChange={(e) => handleCheckboxChange(e, Number(groupId), category.id, Number(selectedClient))}
//                                                                 style={{ width: '20px', height: '20px' }}
//                                                             />
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ))}
//                                             </React.Fragment>
//                                         ))
                                        
//                                     ) : (
//                                         <TableRow>
//                                             <TableCell colSpan={4} align="center">
//                                                 No Data Available
//                                             </TableCell>
//                                         </TableRow>
//                                     )}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                         <Box mt={4} display="flex" justifyContent="flex-end">
//                             <Button variant="contained" color="primary" onClick={handleSave}>
//                                 Save
//                             </Button>
//                         </Box>
//                         {/* </Card> */}
//                     </Card>

//                     <Snackbar open={isSuccessOpen} autoHideDuration={6000} onClose={() => setIsSuccessOpen(false)}>
//                         <Alert onClose={() => setIsSuccessOpen(false)} severity="success">
//                             Data saved successfully!
//                         </Alert>
//                     </Snackbar>

//                     <Snackbar open={isErrorOpen} autoHideDuration={6000} onClose={() => setIsErrorOpen(false)}>
//                         <Alert onClose={() => setIsErrorOpen(false)} severity="error">
//                             {errorMessage}
//                         </Alert>
//                     </Snackbar>
//                 </Box>

//             </Box>



//         </>
//     );
// };

// export default Client;
import { useState, useEffect } from 'react';
import { Card, Form, Select, Button, Table, Checkbox, message } from 'antd';
import AuthAdminApiService from '../../../data/services/authadminuser/authu-admin-api-service';
import AdmingroupApiService from '../../../data/services/master/AdminGroup/admingroup_api_service';
import Header from '../../../layouts/header/header';
import { Box } from '@mui/material';
import AuthConfigModuleModuleDetApiService from '../../../data/services/configmodulemoduledet/authu-configmodulemoduledet-api-service';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

const { Option } = Select;

interface GroupPayload {
  modid: number;
  moddetid: number;
  modname: string;
  moddetname: string;
}

interface AuthAdminPayload {
  id: number;
  userName: string;
}

interface CategoryPayload {
  id: number;
  groupId: number;
  name: string;
}

interface AdminPayload {
  id: number;
  groupId: number;
  categoryId: number;
  clientId: number;
}

const Client = () => {
  const [groups, setGroups] = useState<GroupPayload[]>([]);
  const [clients, setClients] = useState<AuthAdminPayload[]>([]);
  const [checkboxStatus, setCheckboxStatus] = useState<{ [key: string]: boolean }>({});
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [filteredUserAccess, setFilteredUserAccess] = useState<AdminPayload[]>([]);

  const groupService = new AuthConfigModuleModuleDetApiService();
  const authService = new AuthAdminApiService();
  const adminService = new AdmingroupApiService();
  const userService = new AdmingroupApiService();
  useEffect(() => {
    fetchGroups();
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClientId !== null) {
      fetchUserAccess();
    }
  }, [selectedClientId]);

  const showMessage = (messageText: string, type: 'success' | 'error') => {
    message[type](messageText);
  };

  const fetchGroups = async () => {
    try {
      const response = await groupService.getConfigModuleModuleDet();
      console.log("Fetched Groups Data:", response);
      setGroups(response.map((item: any) => ({
        modid: item.modid,
        moddetid: item.moddetid,
        modname: item.modname,
        moddetname: item.moddetname,
      })));
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await userService.getUserName();
      setClients(response || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchUserAccess = async () => {
    try {
      const response = await adminService.getAdmins();
      setFilteredUserAccess(response || []);
      updateCheckboxStatus(response || []);
    } catch (error) {
      console.error("Error fetching user access:", error);
    }
  };

  const updateCheckboxStatus = (userAccess: AdminPayload[]) => {
    const status: { [key: string]: boolean } = {};
    userAccess.forEach(access => {
      if (access.clientId === selectedClientId) {
        const key = `${access.groupId}-${access.categoryId}`;
        status[key] = true;
      }
    });
    setCheckboxStatus(status);
  };

  const handleCheckboxChange = async (e: CheckboxChangeEvent, groupId: number, categoryId: number | null) => {
    const key = `${groupId}-${categoryId}`;
    const newStatus = e.target.checked;

    setCheckboxStatus(prev => ({
      ...prev,
      [key]: newStatus,
    }));

    const updatedAccess = filteredUserAccess.filter(access => !(access.groupId === groupId && access.categoryId === categoryId));

    if (newStatus) {
      updatedAccess.push({
        id: 0,
        groupId,
        categoryId: categoryId || 0,
        clientId: selectedClientId || 0,
      });
    } else {
      const accessToDelete = filteredUserAccess.find(access => access.groupId === groupId && access.categoryId === categoryId);
      if (accessToDelete) {
        try {
          await adminService.blockAdmin(accessToDelete.id);
        } catch (error) {
          console.error("Error blocking user:", error);
        }
      }
    }

    setFilteredUserAccess(updatedAccess);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClientId) {
      showMessage("Please ensure the Client is selected.", 'error');
      return;
    }

    const payloads: AdminPayload[] = filteredUserAccess
      .filter(access => checkboxStatus[`${access.groupId}-${access.categoryId}`])
      .map(access => ({
        id: 0,
        groupId: access.groupId,
        categoryId: access.categoryId,
        clientId: selectedClientId!,
      }));

    if (payloads.length === 0) {
      showMessage("No permissions selected. Please select atleast one permission.", 'error');
      return;
    }

    try {
      await Promise.all(payloads.map(payload => adminService.createAdmin(payload)));
      showMessage('Permissions saved successfully.', 'success');
    } catch (error) {
      console.error("Error saving permissions:", error);
      showMessage('Save failed. Please try again.', 'error');
    }
  };

  const handleClientChange = (value: number) => {
    setSelectedClientId(value);
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'serialNo',
      key: 'serialNo',
      render: (text: any, record: { rowSpan: any }, index: number) => ({
        children: record.rowSpan > 0 ? index + 1 : null,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
    },
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
      render: (text: any, record: { rowSpan: any; groupId: number }) => ({
        children: text,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
    },
    {
      title: 'SubGroup',
      dataIndex: 'subgroup',
      key: 'subgroup',
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (text: any, record: { groupId: number; categoryId: number }) => (
        <Checkbox
          checked={checkboxStatus[`${record.groupId}-${record.categoryId}`] || false}
          onChange={(e) => handleCheckboxChange(e, record.groupId, record.categoryId)}
        />
      ),
    },
  ];

  const dataSource = groups.map((group, index) => ({
    key: group.moddetid,  // Ensure unique keys for each row
    serialNo: index + 1,
    group: group.modname,
    subgroup: group.moddetname,
    groupId: group.modid,
    categoryId: group.moddetid,
    rowSpan: 1,  // You can update row span logic here if needed
  }));

  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
        <Card style={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <h6 className='allheading'>CLIENT ACCESS</h6>
          <Form layout="vertical" style={{ marginBottom: '20px', width: '30%' }}>
            <Select
              placeholder="Select Admin"
              value={selectedClientId ?? undefined}
              onChange={handleClientChange}
              allowClear
              style={{ width: '100%' }}
              className='check'
            >
              {clients.map(client => (
                <Option key={client.id} value={client.id}>
                  {client.userName}
                </Option>
              ))}
            </Select>
          </Form>

          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            bordered
            style={{ marginBottom: '20px' }}
          />

          <Button
            type="primary"
            onClick={handleSave}
            style={{
              backgroundColor: '#1890ff',
              borderColor: '#1890ff',
              justifyContent: 'flex-end'
            }}
          >
            Save
          </Button>
        </Card>
      </Box>
    </Box>
  );
};

export default Client;
