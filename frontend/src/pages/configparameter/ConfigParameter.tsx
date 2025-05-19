import React, { useEffect, useState } from "react";
import { Select, MenuItem, FormControl, InputLabel, Table, Box, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Typography } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import ConfigparamenterApiService from '../../data/services/configparameter/configparamenter_api_service';
import Header from '../../layouts/header/header';
import { Snackbar, Alert } from '@mui/material';

interface Scenario {
    id: number;
    name: string;
    code: number;
};

interface Type {
    id: number;
    name: string;
    code: number;
};

interface ExistingMapping {
    id: number;
    scenario_list_id: number;
    transtypeId: number;
};

const ScenarioParamMapping: React.FC = () => {

    const [scenarioList, setScenarioList] = useState<Scenario[]>([]);
    const [typeList, setTypeList] = useState<Type[]>([]);
    const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
    const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [existingMappings, setExistingMappings] = useState<ExistingMapping[] | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const configparamenter = new ConfigparamenterApiService();

    useEffect(() => {
        const fetchScenarioList = async () => {
            try {
                const response = await configparamenter.getScenarioList();
                setScenarioList(response);
            } catch (error) {
                console.error("Error fetching scenarios:", error);
            }
        };
        fetchScenarioList();
    }, []);

    useEffect(() => {
        const fetchTypeList = async () => {
            try {
                const response = await configparamenter.getType();
                setTypeList(response);
            } catch (error) {
                console.error("Error fetching type data:", error);
            }
        };
        fetchTypeList();
    }, []);

    const handleScenarioChange = (event: SelectChangeEvent<number>) => {
        setSelectedScenario(event.target.value as number);
    };

    const handleTypeToggle = (id: number) => {
        setSelectedTypes((prev) =>
            prev.includes(id) ? prev.filter((typeId) => typeId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTypes(event.target.checked ? typeList.map((type) => type.id) : []);
    };

    const handleSubmit = async () => {
        if (!selectedScenario || selectedTypes.length === 0) {
            alert("Please select a scenario and atleast one type.");
            return;
        }
        try {
            const existingMapping = await configparamenter.getExistingMapping(selectedScenario, selectedTypes);
            if (existingMapping.length > 0) {
                setExistingMappings(existingMapping);
                setOpenDialog(true);
            } else {
                await submitMapping();
            }
        } catch (error) {
            console.error("Error checking existing mapping:", error);
        }
    };

    const submitMapping = async (existingMapping: ExistingMapping[] | null = null) => {
        try {
            if (selectedScenario === null || selectedTypes.length === 0) {
                alert("Please select a valid scenario and atleast one type.");
                return;
            }
            const payload = [{
                scenario_list_id: selectedScenario,
                transtypeIds: selectedTypes,
                uid: 1,
                euid: 1,
            }];
            const response = await configparamenter.CreateandUpdateScenarioParamMapping(selectedScenario, selectedTypes, payload);
            setOpenDialog(false);
            setSuccessMessage('ScenarioParameterMapping inserted successfully!');
            setOpenSnackbar(true);
            setSelectedScenario(null);
            setSelectedTypes([]);
        } catch (error) {
            console.error("Error updating/creating mapping:", error);
            setErrorMessage('Error saving data.');
            setOpenSnackbar(true);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
                <div>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h6 className='allheading'> CONFIG PARAMETER </h6>
                    </Box>
                    <Box sx={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <FormControl className="custom-textfield .MuiInputBase-root" sx={{ width: '30%' }}>
                                <InputLabel className="custom-textfield .MuiInputBase-root" htmlFor="Scenario-List">Scenario List</InputLabel>
                                <Select
                                    size='small'
                                    className="custom-textfield .MuiInputBase-root"
                                    labelId="config-parameter-select-label"
                                    value={selectedScenario ?? ""}
                                    onChange={handleScenarioChange}
                                    label="Select Parameter"
                                >
                                    {scenarioList.map((scenario) => (
                                        <MenuItem className="custom-menu-item" key={scenario.id} value={scenario.id}>
                                            {scenario.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </Box>
                    {/* <TableContainer
                        component={Paper}
                        style={{
                            maxHeight: '300px',
                            overflowY: 'auto',
                            position: 'relative',
                            maxWidth: '100%',
                            minWidth: '300px',
                        }}
                    >
                        <Table size="small" sx={{ borderCollapse: 'collapse' }}>
                            <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <TableRow sx={{ height: '24px' }}>
                                    <TableCell className="MuiTableCell-heads" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox
                                            indeterminate={selectedTypes.length > 0 && selectedTypes.length < typeList.length}
                                            checked={selectedTypes.length === typeList.length}
                                            onChange={handleSelectAll}
                                            sx={{ transform: 'scale(0.8)', marginRight: '18px' }}
                                        />
                                        S.No
                                    </TableCell>
                                    <TableCell className="MuiTableCell-heads">Name</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {typeList.map((type, index) => (
                                    <TableRow key={type.id} sx={{ height: '30px' }}>
                                        <TableCell className="smallTableBody" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Checkbox
                                                checked={selectedTypes.includes(type.id)}
                                                onChange={() => handleTypeToggle(type.id)}
                                                sx={{ transform: 'scale(0.8)', marginRight: '18px' }}
                                            />
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="smallTableBody">{type.name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer> */}
                    <TableContainer
                        component={Paper}
                        sx={{
                            maxHeight: '300px',
                            overflowY: 'auto',
                            position: 'relative',
                            maxWidth: '100%',
                            minWidth: '300px',
                        }}
                    >
                        <Table size="small" sx={{ borderCollapse: 'collapse' }}>
                            <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <TableRow sx={{ height: '24px', backgroundColor: '#f5f5f5' }}>
                                    <TableCell
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0px 8px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        <Checkbox
                                            indeterminate={selectedTypes.length > 0 && selectedTypes.length < typeList.length}
                                            checked={selectedTypes.length === typeList.length}
                                            onChange={handleSelectAll}
                                            sx={{ transform: 'scale(0.8)', marginRight: '10px' }}
                                        />
                                        S.No
                                    </TableCell>
                                    <TableCell sx={{ padding: '0px 8px', fontWeight: 'bold' }}>Name</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {typeList.map((type, index) => (
                                    <TableRow
                                        key={type.id}
                                        sx={{
                                            height: '24px',
                                            '&:nth-of-type(odd)': { backgroundColor: '#fafafa' }
                                        }}
                                    >
                                        <TableCell
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '0px 8px'
                                            }}
                                        >
                                            <Checkbox
                                                checked={selectedTypes.includes(type.id)}
                                                onChange={() => handleTypeToggle(type.id)}
                                                sx={{ transform: 'scale(0.8)', marginRight: '10px' }}
                                            />
                                            {index + 1}
                                        </TableCell>
                                        <TableCell sx={{ padding: '0px 8px' }}>{type.name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <br></br>
                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Box>
                </div>
            </Box>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle className="custom-dialog-title">Update Existing Mapping</DialogTitle>
                <DialogContent>
                    <Typography className='confirmation-text'>
                        The data is  already exists. Would you like to update the existing mapping?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
                    <Button onClick={() => submitMapping(existingMappings)} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {successMessage ? (
                    <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                        {successMessage}
                    </Alert>
                ) : (
                    <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
                        {errorMessage}
                    </Alert>
                )}
            </Snackbar>
        </Box>
    );
};

export default ScenarioParamMapping;