import React from 'react';
import { CircularProgress, Alert, Typography, Box } from '@mui/material';

interface CommonPageProps {
  isLoading: boolean;
  hasError: boolean;
  errorMsg?: string;
  hasData: boolean;
  noDataMsg?: string;
  children: React.ReactNode;
}

const CommonPage: React.FC<CommonPageProps> = ({ 
  isLoading, 
  hasError, 
  errorMsg = 'Network error, please try again later.', 
  hasData, 
  noDataMsg = 'No data available.', 
  children 
}) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Alert severity="error">{errorMsg}</Alert>
      </Box>
    );
  }

  if (!hasData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">{noDataMsg}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {children}
    </Box>
  );
};

export default CommonPage;

