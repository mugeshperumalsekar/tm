import { Component, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Table, TableContainer, TableCell, TableHead, TableRow } from '@mui/material';
import CaseDetail from '../CaseDetail/caseDetail';
import MoneyFlow from '../MoneyFlow/MoneyFlow';
import Relations from '../Relation/Relations';
import Cases from '../Cases/Cases';
import Alert from '../Alert/Alert';
import PieChartView from '../pieChart/pieChartView';

const CustomerDetail = () => {

    const [selectedTab, setSelectedTab] = useState<number | null>(0);
    const navigate = useNavigate();

    const handleTabClick = (index: number) => {
        setSelectedTab(index);
    };

    const tabs = [
        { label: 'General', component: <CaseDetail /> },
        { label: 'Alert Details', component: <Alert /> },
        { label: 'Transaction Summary', component: <MoneyFlow /> },
        { label: 'History', component: <Cases /> },
        { label: 'Relation', component: <Relations /> },
        { label: 'Graphical Report', component: <PieChartView /> },
    ];

    return (

        <Box sx={{ display: 'flex' }}>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: 'rgb(220 220 220 / 12%)' }}>
                                {tabs.map((tab, index) => (
                                    <TableCell
                                        key={index}
                                        onClick={() => handleTabClick(index)}
                                        sx={{
                                            border: '1px solid gray',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            backgroundColor: selectedTab === index ? 'white' : 'inherit',
                                            borderBottom: selectedTab === index ? 'none' : '1px solid gray',
                                        }}
                                    >
                                        {tab.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
                {selectedTab !== null && tabs[selectedTab].component && (
                    <Box sx={{ mt: 4 }}>
                        {tabs[selectedTab].component}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default CustomerDetail;