import { useEffect, useState } from 'react';
import Header from '../../layouts/header/header';
import ScenarioListApiService from '../../data/services/scenarioList/ScenarioList_api_service';
import { ScenarioSearch } from '../../data/services/scenarioList/Scenariolist_payload';
import { TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Box, Dialog, Card, Table, DialogContent, DialogActions, Button, DialogTitle } from '@mui/material';
import Loader from '../loader/loader';

const ScenarioReport = () => {

    const scenarioListApi = new ScenarioListApiService();
    // const [scenario, setScenario] = useState<FetchScenarioPayload[]>([]);
    const [scenario, setScenario] = useState<ScenarioSearch[]>([]);
    const [open, setOpen] = useState(false);
    const [dialogData, setDialogData] = useState<any>(null);
    const [scenariolist, setScenarioList] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchScenario();
    }, []);

    const fetchScenario = async () => {
        try {
            setLoading(true);
            const response = await scenarioListApi.getScenario();
            setScenario(response);
        } catch (error) {
            console.error("Error fetching the fetchScenario:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClickOpen = async (id: any) => {
        try {
            setLoading(true);
            const data = await scenarioListApi.scenarioDetails(id);
            console.log('handleClickOpen data:', data);
            setDialogData(data);
            setOpen(true);
        } catch (error) {
            console.error('Error fetching scenario details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setScenarioList(null);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, mt: 5, p: 2 }}>
                    <h6>Report</h6>
                    <Box >
                        {loading && <Loader />}
                        <TableContainer
                            component={Paper}
                            style={{
                                maxHeight: '430px',
                                overflowY: 'auto',
                                position: 'relative',
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ height: '30px' }}>
                                        <TableCell className='scenariotable' align='left'>S.no</TableCell>
                                        <TableCell className='scenariotable' align='left'>Code</TableCell>
                                        <TableCell className='scenariotable' align='left'>Scenario</TableCell>
                                        <TableCell className='scenariotable' align='left'>ProductType</TableCell>
                                        <TableCell className='scenariotable' align='left'>Frequency</TableCell>
                                        <TableCell className='scenariotable' align='left'>Lookback</TableCell>
                                        <TableCell className='scenariotable' align='left'>MinAmt</TableCell>
                                        <TableCell className='scenariotable' align='left'>MaxAmt</TableCell>
                                        <TableCell className='scenariotable' align='left'>Min%</TableCell>
                                        <TableCell className='scenariotable' align='left'>Max%</TableCell>
                                        <TableCell className='scenariotable' align='left'>MinCount</TableCell>
                                        <TableCell className='scenariotable' align='left'>MaxCount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {scenario.length > 0 ? (
                                        scenario.map((item, index) => (
                                            <TableRow
                                                key={item.id}
                                                sx={{
                                                    height: '20px',
                                                    '& td, & th': {
                                                        padding: '4px',
                                                    },
                                                }}
                                            >
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className='scenariotable' align='left'>{item.sceCode}</TableCell>
                                                <TableCell
                                                    className="scenariotable"
                                                    align="left"
                                                    style={{ cursor: 'pointer', color: 'blue', padding: '4px' }}
                                                    onClick={() => handleClickOpen(item.id)}
                                                >
                                                    {item.scenario}
                                                </TableCell>
                                                <TableCell className='scenariotable' align='left'>{item.productTypeName}</TableCell>
                                                <TableCell className='scenariotable' align='left'>{item.frequencyName}</TableCell>
                                                <TableCell className='scenariotable' align='left'>{item.lookbackName}</TableCell>
                                                <TableCell className='scenariotable' align='left'>{item.minAmt}</TableCell>
                                                <TableCell className='scenariotable' align='left'>{item.maxAmt}</TableCell>
                                                <TableCell className='scenariotable' align='left'>{item.minPercentage}</TableCell>
                                                <TableCell className='scenariotable' align='left'>{item.maxPercentage}</TableCell>
                                                <TableCell className='scenariotable' align='left'>{item.minTransCount}</TableCell>
                                                <TableCell className='scenariotable' align='left'>{item.maxTransCount}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow sx={{ height: '30px' }}>
                                            <TableCell colSpan={12} style={{ textAlign: 'center', padding: '4px' }}>
                                                No data available
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
                            <DialogTitle className="custom-dialog-title">SCENARIO DETAILS</DialogTitle>
                            <DialogContent>
                                {dialogData ? (
                                    <div className="dialog-box">
                                        {/* Grid Container */}
                                        <p><strong className='allheading'>Scenario List:</strong> {dialogData.scenarioList.name}</p>
                                        {/* Scenario Condition */}
                                        <h6 className='allheading'>Product Transaction Type</h6>
                                        <TableContainer component={Card} style={{ maxHeight: '350px', overflow: 'auto' }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="MuiTableCell-head">S.No</TableCell>
                                                        <TableCell className="MuiTableCell-head">Category</TableCell>
                                                        <TableCell className="MuiTableCell-head">Name</TableCell>
                                                        <TableCell className="MuiTableCell-head">Code</TableCell>
                                                        <TableCell className="MuiTableCell-head">Status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {/* Product Transaction Type */}
                                                    <TableRow>
                                                        <TableCell className="small-cell">1</TableCell>
                                                        <TableCell className="small-cell">Product  Type</TableCell>
                                                        <TableCell className="small-cell">{dialogData.productTransType.name}</TableCell>
                                                        <TableCell className="small-cell">{dialogData.productTransType.code}</TableCell>
                                                        <TableCell className="small-cell">{dialogData.productTransType.status}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <br></br>
                                        <h6 className='allheading'>Scenario Mapping Details</h6>
                                        <TableContainer component={Card} style={{ maxHeight: '200px', overflow: 'auto' }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="MuiTableCell-head">S.No</TableCell>
                                                        <TableCell className="MuiTableCell-head">Customer Type</TableCell>
                                                        <TableCell className="MuiTableCell-head">Customer Type Category</TableCell>
                                                        <TableCell className="MuiTableCell-head">Customer Segment</TableCell>
                                                        <TableCell className="MuiTableCell-head">Occupation Type</TableCell>
                                                        <TableCell className="MuiTableCell-head">Customer Risk</TableCell>
                                                        <TableCell className="MuiTableCell-head">Status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dialogData.scenarioMappingDetails?.map((detail: any, index: number) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="small-cell">{index + 1}</TableCell>
                                                            <TableCell className="small-cell">{detail.customerType?.name || 'N/A'}</TableCell>
                                                            <TableCell className="small-cell">{detail.customerType?.customerCategory?.name || 'N/A'}</TableCell>
                                                            <TableCell className="small-cell">{detail.customerSegment?.name || 'N/A'}</TableCell>
                                                            <TableCell className="small-cell">{detail.occupationType?.name || 'N/A'}</TableCell>
                                                            <TableCell className="small-cell">{detail.customerRisk?.name || 'N/A'}</TableCell>
                                                            <TableCell className="small-cell">{detail.status || 'N/A'}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                ) : (
                                    <p>Loading...</p>
                                )}
                            </DialogContent>

                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>

                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default ScenarioReport;