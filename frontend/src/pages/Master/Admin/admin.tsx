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

const Admin = () => {

  const [groups, setGroups] = useState<GroupPayload[]>([]);
  const [clients, setClients] = useState<AuthAdminPayload[]>([]);
  const [checkboxStatus, setCheckboxStatus] = useState<{ [key: string]: boolean }>({});
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [filteredUserAccess, setFilteredUserAccess] = useState<AdminPayload[]>([]);
  const groupService = new AuthConfigModuleModuleDetApiService();
  const authService = new AuthAdminApiService();
  const adminService = new AdmingroupApiService();

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
      const response = await authService.getadminuser();
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
    key: group.moddetid,
    serialNo: index + 1,
    group: group.modname,
    subgroup: group.moddetname,
    groupId: group.modid,
    categoryId: group.moddetid,
    rowSpan: 1,
  }));

  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
        <Card style={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <h6 className='allheading'>ADMIN ACCESS</h6>
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

export default Admin;