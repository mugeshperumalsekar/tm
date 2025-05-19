import React, { useEffect, useState } from 'react';
import { AppBar as MuiAppBar, Toolbar, CssBaseline, Drawer as MuiDrawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Divider, Tooltip, IconButton } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Dashboard as DashboardIcon, CloudUpload as CloudUploadIcon, CloudDownload as CloudDownloadIcon, School as SchoolIcon, Security as SecurityIcon, Payments as PaymentsIcon, FiberManualRecord as FiberManualRecordIcon, Person as PersonIcon } from '@mui/icons-material';
import { AccountBalance as AccountIcon, AttachMoney as TransactionIcon, HourglassTop, Person as CustomerIcon } from '@mui/icons-material';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from './navigation';
import { RiFlowChart } from "react-icons/ri";

const drawerWidth = 245;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(6)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  height: 50,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Header = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [isMastersDropdownOpen, setIsMastersDropdownOpen] = useState(false);
  const [selectedMasters, setSelectedMasters] = useState([]);
  const [adminData, setAdminData] = useState<{ name: any; code: any; link: any }[]>([]);
  const [pendingData, setPendingData] = useState<{ name: any; code: any; link: any }[]>([]);
  const [mastersList, setMastersList] = useState<{ name: any; code: any; link: any }[]>([]);
  const [transactionmastersList, setTransactionMastersList] = useState<{ name: any; code: any; link: any }[]>([]);
  const [levelmastersList, setLevelMastersList] = useState<{ name: any; code: any; link: any }[]>([]);
  const [accountList, setAccountMastersList] = useState<{ name: any; code: any; link: any }[]>([]);
  const [selectedtransactionMasters, setSelectedtransactionMasters] = useState([]);
  const [activePath, setActivePath] = useState(location.pathname);
  const [isCustomerMasterOpen, setIsCustomerMasterOpen] = useState(false);
  const [isTransactionMasterOpen, setIsTransactionMasterOpen] = useState(false);
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [isLevelMasterOpen, setIsLevelMasterOpen] = useState(false);
  const [isAccountMasterOpen, setIsAccountMasterOpen] = useState(false);
  const [accessmastersList, setAccessMastersList] = useState<{ name: any; code: any; link: any }[]>([]);

  const toggleMenu = (menu: React.SetStateAction<null>) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getFromLocalStorage = (key: string) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  };

  const handleMastersSelect = (Masters: any) => {
    setSelectedMasters(Masters);
    navigate(Masters.link);
  };

  const handletransactionSelect = (Masters: any) => {
    setSelectedtransactionMasters(Masters);
    navigate(Masters.link);
  };

  const handleAdminUserrightsClick = () => {
    navigate('/adminuserrights');
  };

  const handlePendingDataClick = () => {
    navigate('/taskAssign');
  };

  const handleLevelFlowClick = () => {
    navigate('/levelflow');
  };

  const handleAdminDataClick = () => {
    navigate('/admin');
  };

  const removeDuplicates = (list: any[]) => {
    const uniqueList = list.filter((item, index, self) =>
      index === self.findIndex((t) => t.name === item.name)
    );
    return uniqueList;
  };

  useEffect(() => {
    const accessPermissionData = location.state?.accessPermissionData;
    if (Array.isArray(accessPermissionData)) {
      const mastersData = accessPermissionData.filter((item) => item.header === '3');
      const transctionmastersData = accessPermissionData.filter((item) => item.header === '4');
      const accountsData = accessPermissionData.filter((item) => item.header === '5');
      const levelmastersData = accessPermissionData.filter((item) => item.header === '6');
      const adminData = accessPermissionData.filter((item) => item.header === '2');
      setAdminData(adminData);

      const mappedMastersList: { name: any; code: any; link: any }[] = mastersData.map((master) => ({
        name: master.name,
        code: master.code,
        link: master.link,
      }));

      const transctionmastersList: { name: any; code: any; link: any }[] = transctionmastersData.map((master) => ({
        name: master.name,
        code: master.code,
        link: master.link,
      }));

      const levelmastersList: { name: any; code: any; link: any }[] = levelmastersData.map((master) => ({
        name: master.name,
        code: master.code,
        link: master.link,
      }));

      const accountList: { name: any; code: any; link: any }[] = accountsData.map((master) => ({
        name: master.name,
        code: master.code,
        link: master.link,
      }));

      const uniqueMastersList = removeDuplicates(mappedMastersList);
      setMastersList(uniqueMastersList);

      const uniqueMasterstransactionList = removeDuplicates(transctionmastersList);
      setTransactionMastersList(uniqueMasterstransactionList);

      const uniqueaccessList = removeDuplicates(accessmastersList);
      setAccessMastersList(uniqueaccessList);

      const uniqueMasterslevelList = removeDuplicates(levelmastersList);
      setLevelMastersList(uniqueMasterslevelList);

      const uniqueMastersaccountList = removeDuplicates(accountList);
      setAccountMastersList(uniqueMastersaccountList);

      saveToLocalStorage('mastersList', uniqueMastersList);
      saveToLocalStorage('transactionmastersList', uniqueMasterstransactionList);
      saveToLocalStorage('levelmastersList', uniqueMasterslevelList);
      saveToLocalStorage('accountList', uniqueMastersaccountList);
      saveToLocalStorage('adminData', adminData);

    } else {
      const storedMastersList = getFromLocalStorage('mastersList');
      const storedMasterstransactionList = getFromLocalStorage('transactionmastersList');
      const storedaccessList = getFromLocalStorage('accessList');
      const storedMasterslevelList = getFromLocalStorage('levelmastersList');
      const storedAdminList = getFromLocalStorage('adminData');
      const storedMastersaccountList = getFromLocalStorage('accountList');

      setMastersList(storedMastersList || []);
      setTransactionMastersList(storedMasterstransactionList || []);
      setAccessMastersList(storedaccessList || []);
      setLevelMastersList(storedMasterslevelList || []);
      setAccountMastersList(storedMastersaccountList || []);
      setAdminData(storedAdminList || []);
    }
  }, [location.state]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
    if (open) {
      setOpen(false);
    }
  };

  const handleExcelUploadClick = () => {
    navigate('/ExcelUpload');
  };

  const handleExcelFileView = () => {
    navigate(`/ExcelFileView`);
  };
  const handleConfigParameter = () => {
    navigate(`/ConfigParameter`);
  };


  const handlePieChartView = () => {
    navigate(`/PieChartView`);
  };

  const handleMastersDropdownToggle = () => {
    setIsMastersDropdownOpen(!isMastersDropdownOpen);
  };

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const handleCustomerMasterToggle = () => {
    setIsCustomerMasterOpen(!isCustomerMasterOpen);
  };

  const handleTransactionMasterToggle = () => {
    setIsTransactionMasterOpen(!isTransactionMasterOpen);
  };

  const handleAccessToggle = () => {
    setIsAccessOpen(!isAccessOpen);
  };

  const handleLevelSearchMasterToggle = () => {
    setIsLevelMasterOpen(!isLevelMasterOpen);
  };

  const handleAccountMasterToggle = () => {
    setIsAccountMasterOpen(!isAccountMasterOpen);
  };

  const handleCustomerDetailsClick = () => {
    navigate('/CustomerDetails/customerId/accountId/hitId');
  };

  const isSearchRoute = () => {
    return [
      '/levelflow',
    ].includes(location.pathname);
  };

  const handleCaseManager = () => {
    navigate(`/CaseManager`);
  };

  const handleScenarioList = () => {
    navigate(`/ScenarioList`);
  };

  const handleScenarioConfig = () => {
    navigate(`/ScenarioConfig`);
  };

  const handleScenarioGeneration = () => {
    navigate(`/ScenarioGeneration`);
  };

  const handleScenarionReport = () => {
    navigate(`/Report`);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar open={open}>
        <Toolbar>
          <Tooltip title="Menu">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Navigation />
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <h4 className='allheading' style={{ color: '#1976d2' }}>
            Transaction
          </h4>
          <IconButton onClick={() => { setOpen(!open) }}>
            {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        {/* Dashboard */}
        <List style={{ padding: '0px' }}>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={handleDashboardClick}>
            <Tooltip title="Dashboard" placement="right" arrow>
              <ListItemButton
                sx={{
                  minHeight: 40,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: activePath === '/dashboard' ? '#d3d3d3' : 'transparent',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <DashboardIcon style={{ fontSize: '16px' }} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>

        {/* Alert Manager */}
        <List style={{ padding: '0px' }}>
          <ListItem disablePadding onClick={handlePendingDataClick}>
            <Tooltip title="Alert Manager" placement="right" arrow>
              <ListItemButton sx={{
                minHeight: 40,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5, backgroundColor: activePath === '/taskAssign' ? '#d3d3d3' : 'transparent',
              }}>
                <ListItemIcon sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}>
                  <HourglassTop style={{ fontSize: '16px' }} />
                </ListItemIcon>
                <ListItemText primary="Alert Manager" className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>

        {/* Level Flow */}
        <List style={{ padding: '0px' }}>
          <ListItem disablePadding onClick={handleLevelFlowClick}>
            <Tooltip title="Work Flow" placement="right" arrow>
              <ListItemButton sx={{
                minHeight: 40,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5, backgroundColor: activePath === '/levelflow' ? '#d3d3d3' : 'transparent',
              }}>
                <ListItemIcon sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}>
                  <RiFlowChart style={{ fontSize: '16px' }} />
                </ListItemIcon>
                <ListItemText primary="Work Flow" className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>

        {/* Masters Heading with Dropdown */}
        {mastersList.length > 0 && (

          <List style={{ padding: '0px' }}>
            <ListItem disablePadding onClick={handleMastersDropdownToggle}>
              <Tooltip title="SetUp" placement="right" arrow>
                <ListItemButton sx={{
                  minHeight: 40,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: activePath.startsWith('/Masters') ? '#d3d3d3' : 'transparent',
                }}>
                  <ListItemIcon sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}>
                    <SchoolIcon style={{ fontSize: '16px' }} />
                  </ListItemIcon>
                  <ListItemText primary="SetUp" className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                  {isMastersDropdownOpen}
                </ListItemButton>
              </Tooltip>
            </ListItem>

            {/* Masters Submenu */}

            <Collapse in={isMastersDropdownOpen} timeout="auto" unmountOnExit>

              {/*Customer Master*/}
              {mastersList.length > 0 && (
                <>
                  <ListItem disablePadding onClick={handleCustomerMasterToggle}>
                    <Tooltip title="Customer" placement="right" arrow>
                      <ListItemButton sx={{
                        minHeight: 40,
                        justifyContent: open ? 'inherit' : 'center',
                        px: 3.5,
                        backgroundColor: activePath.startsWith('/Masters') ? '#d3d3d3' : 'transparent',
                      }}>
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 2 : 'auto',
                            justifyContent: 'center',
                          }}
                        >
                          <CustomerIcon style={{ fontSize: '16px' }} />
                        </ListItemIcon>
                        <ListItemText primary="Customer" className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                        {isCustomerMasterOpen ? <ExpandLess style={{ fontSize: '16px' }} /> : <ExpandMore style={{ fontSize: '16px' }} />}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                  <Collapse in={isCustomerMasterOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {mastersList.map((customer) => (
                        <ListItem
                          key={customer.code}
                          disablePadding
                          onClick={() => handleMastersSelect(customer)}>
                          <Tooltip title={customer.name} placement="right" arrow>
                            <ListItemButton sx={{
                              minHeight: 40,
                              justifyContent: open ? 'initial' : 'center',
                              px: 4.5,
                              backgroundColor: activePath.startsWith('/Masters') ? '#d3d3d3' : 'transparent',
                            }}>
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 2 : 'auto',
                                  justifyContent: 'center'
                                }}>
                                <FiberManualRecordIcon style={{ fontSize: '10px' }} />
                              </ListItemIcon>
                              <ListItemText primary={customer.name} className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                            </ListItemButton>
                          </Tooltip>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              )}

              {/* Transaction Master */}
              {transactionmastersList.length > 0 && (
                <>
                  <ListItem disablePadding onClick={handleTransactionMasterToggle}>
                    <Tooltip title="Transaction" placement="right" arrow>
                      <ListItemButton sx={{
                        minHeight: 40,
                        justifyContent: open ? 'initial' : 'center',
                        px: 3.5,
                        backgroundColor: activePath.startsWith('/Masters') ? '#d3d3d3' : 'transparent',
                      }}>
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 2 : 'auto',
                            justifyContent: 'center',
                          }}
                        >
                          <TransactionIcon style={{ fontSize: '16px' }} />
                        </ListItemIcon>
                        <ListItemText primary="Transaction" className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                        {isTransactionMasterOpen ? <ExpandLess style={{ fontSize: '16px' }} /> : <ExpandMore style={{ fontSize: '16px' }} />}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>

                  <Collapse in={isTransactionMasterOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {transactionmastersList.map((master) => (
                        <ListItem
                          key={master.code}
                          disablePadding
                          onClick={() => handleMastersSelect(master)}
                        >
                          <Tooltip title={master.name} placement="right" arrow>
                            <ListItemButton sx={{
                              minHeight: 40,
                              justifyContent: open ? 'initial' : 'center',
                              px: 4.5,
                              backgroundColor: activePath.startsWith('/Masters') ? '#d3d3d3' : 'transparent',
                            }}>
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 2 : 'auto',
                                  justifyContent: 'center',
                                }}
                              >
                                <FiberManualRecordIcon style={{ fontSize: '10px' }} />
                              </ListItemIcon>
                              <ListItemText primary={master.name} className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                            </ListItemButton>
                          </Tooltip>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              )}

              {/* Level Search */}
              {levelmastersList.length > 0 && (
                <>
                  {/* <ListItem disablePadding onClick={handleLevelSearchMasterToggle}>
                <Tooltip title="CustomerDetails" placement="right" arrow>
                <ListItemButton sx={{
                      minHeight: 40,
                      justifyContent: open ? 'initial' : 'center',
                      px: 3.5,
                      backgroundColor: activePath.startsWith('/Masters') ? '#d3d3d3' : 'transparent', 
                    }}>
                        <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <LevelSearchIcon  style={{ fontSize: '16px' }} />
                    </ListItemIcon>
                  <ListItemText primary="CustomerDetails"  className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`}/>
                  {isLevelMasterOpen ? <ExpandLess style={{ fontSize: '16px' }}/> : <ExpandMore style={{ fontSize: '16px' }}/>}
                </ListItemButton>
                </Tooltip>
              </ListItem> */}

                  <Collapse in={isLevelMasterOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {levelmastersList.map((master) => (
                        <ListItem
                          key={master.code}
                          disablePadding
                          onClick={() => handleMastersSelect(master)}
                        >
                          <Tooltip title={master.name} placement="right" arrow>
                            <ListItemButton sx={{
                              minHeight: 40,
                              justifyContent: open ? 'initial' : 'center',
                              px: 4.5,
                              backgroundColor: activePath.startsWith('/Masters') ? '#d3d3d3' : 'transparent',
                            }}>
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 2 : 'auto',
                                  justifyContent: 'center',
                                }}
                              >
                                <FiberManualRecordIcon style={{ fontSize: '10px' }} />
                              </ListItemIcon>
                              <ListItemText primary={master.name} className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                            </ListItemButton>
                          </Tooltip>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              )}

              {/* Account Master */}
              <ListItem disablePadding onClick={handleAccountMasterToggle}>
                <ListItemButton sx={{
                  minHeight: 40,
                  justifyContent: open ? 'initial' : 'center',
                  px: 3.5,
                  backgroundColor: activePath.startsWith('/Masters') ? '#d3d3d3' : 'transparent',
                }}>
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <AccountIcon style={{ fontSize: '16px' }} />
                  </ListItemIcon>
                  <ListItemText primary="Account " className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                  {isAccountMasterOpen ? <ExpandLess style={{ fontSize: '16px' }} /> : <ExpandMore style={{ fontSize: '16px' }} />}
                </ListItemButton>
              </ListItem>

              {/* Customer Master */}
              <Collapse in={isAccountMasterOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {accountList.map((master) => (
                    <ListItem
                      key={master.code}
                      disablePadding
                      onClick={() => handleMastersSelect(master)}
                    >
                      <Tooltip title={master.name} placement="right" arrow>
                        <ListItemButton sx={{
                          minHeight: 40,
                          justifyContent: open ? 'initial' : 'center',
                          px: 4.5,
                          backgroundColor: activePath.startsWith('/Masters') ? '#d3d3d3' : 'transparent',
                        }}>
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 2 : 'auto',
                              justifyContent: 'center',
                            }}
                          >
                            <FiberManualRecordIcon style={{ fontSize: '10px' }} />
                          </ListItemIcon>
                          <ListItemText primary={master.name} className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                        </ListItemButton>
                      </Tooltip>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Collapse>
          </List>
        )}

        {/* Admin User Rights */}
        {adminData.length > 0 && (
          <List style={{ padding: '0px' }}>
            <ListItem disablePadding onClick={handleAdminUserrightsClick}>
              <Tooltip title="User Permission" placement="right" arrow>
                <ListItemButton sx={{
                  minHeight: 40,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5, backgroundColor: activePath === '/adminuserrights' ? '#d3d3d3' : 'transparent',

                }}>
                  <ListItemIcon sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}>
                    <SecurityIcon style={{ fontSize: '16px' }} />
                  </ListItemIcon>
                  <ListItemText primary="User Permission" className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </List>
        )}

        {/* Case Manager */}
        <List style={{ padding: '0px' }}>
          <ListItem disablePadding onClick={handleCaseManager}>
            <Tooltip title="Case Manager" placement="right" arrow>
              <ListItemButton sx={{
                minHeight: 40,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5, backgroundColor: activePath === '/CaseManager' ? '#d3d3d3' : 'transaparent',
              }}>
                <ListItemIcon sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}>
                  <PersonIcon style={{ fontSize: '16px' }} />
                </ListItemIcon>
                <ListItemText primary="Case Manager" className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>

        {/* ScenarioList */}
        {/* <List style={{ padding: '0px' }}>
          <ListItem disablePadding onClick={handleScenarioList}>
            <Tooltip title="Scenario List" placement="right" arrow>
              <ListItemButton sx={{
                minHeight: 40,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5, backgroundColor: activePath === '/CustomerDetails' ? '#d3d3d3' : 'transaparent',
              }}>
                <ListItemIcon sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}>
                  <PaymentsIcon style={{ fontSize: '16px' }} />
                </ListItemIcon>
                <ListItemText primary="Scenario List" className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List> */}

        {/* Scenario Config */}
        {/* <List style={{ padding: '0px' }}>
          <ListItem disablePadding onClick={handleScenarioConfig}>
            <Tooltip title="Scenario Config" placement="right" arrow>
              <ListItemButton sx={{
                minHeight: 40,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5, backgroundColor: activePath === '/CustomerDetails' ? '#d3d3d3' : 'transaparent',
              }}>
                <ListItemIcon sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}>
                  <PaymentsIcon style={{ fontSize: '16px' }} />
                </ListItemIcon>
                <ListItemText primary="Scenario Config" className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List> */}

        {/* Scenario Generation */}
        <List style={{ padding: '0px' }}>
          <ListItem disablePadding onClick={handleScenarioGeneration}>
            <Tooltip title="Scenario Generation" placement="right" arrow>
              <ListItemButton sx={{
                minHeight: 40,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5, backgroundColor: activePath === '/ScenarioGeneration' ? '#d3d3d3' : 'transaparent',
              }}>
                <ListItemIcon sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}>
                  <PaymentsIcon style={{ fontSize: '16px' }} />
                </ListItemIcon>
                <ListItemText primary="Scenario Generation" className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>

        {/* Report */}
        <List style={{ padding: '0px' }}>
          <ListItem disablePadding onClick={handleScenarionReport}>
            <Tooltip title="Report" placement="right" arrow>
              <ListItemButton sx={{
                minHeight: 40,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5, backgroundColor: activePath === '/Report' ? '#d3d3d3' : 'transaparent',
              }}>
                <ListItemIcon sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}>
                  <PaymentsIcon style={{ fontSize: '16px' }} />
                </ListItemIcon>
                <ListItemText primary="Report" className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>

        {/* Excel Upload */}
        <List style={{ padding: '0px' }}>
          <ListItem disablePadding onClick={handleExcelUploadClick}>
            <Tooltip title="ExcelUpload" placement="right" arrow>
              <ListItemButton
                sx={{
                  minHeight: 40,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: activePath === '/ExcelUpload' ? '#d3d3d3' : 'transparent',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <CloudUploadIcon style={{ fontSize: '16px' }} />
                </ListItemIcon>
                <ListItemText primary="ExcelUpload" className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>

        {/* ExcelFile View */}
        <List style={{ padding: '0px' }}>
          <ListItem disablePadding onClick={handleExcelFileView}>
            <Tooltip title="ExcelFileView" placement="right" arrow>
              <ListItemButton
                sx={{
                  minHeight: 40,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: activePath === '/ExcelFileView' ? '#d3d3d3' : 'transparent',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <CloudDownloadIcon style={{ fontSize: '16px' }} />
                </ListItemIcon>
                <ListItemText primary="ExcelFileView" className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>

        {/* ConfigParameter View */}
        <List style={{ padding: '0px' }}>
          <ListItem disablePadding onClick={handleConfigParameter}>
            <Tooltip title="ConfigParameter" placement="right" arrow>
              <ListItemButton
                sx={{
                  minHeight: 40,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: activePath === '/ConfigParameter' ? '#d3d3d3' : 'transparent',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <PaymentsIcon style={{ fontSize: '16px' }} />
                </ListItemIcon>
                <ListItemText primary="ConfigParameter" className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>

        {/* PieChart View */}
        {/* <List style={{ padding: '0px' }}>
          <ListItem disablePadding onClick={handlePieChartView}>
            <Tooltip title="Graphical Report" placement="right" arrow>
              <ListItemButton
                sx={{
                  minHeight: 40,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: activePath === '/PieChartView' ? '#d3d3d3' : 'transparent',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <CloudDownloadIcon style={{ fontSize: '16px' }} />
                </ListItemIcon>
                <ListItemText primary="Graphical Report" className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List> */}

      </Drawer>
    </Box>
  );

};

export default Header;