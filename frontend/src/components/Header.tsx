import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box 
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ListAltIcon from '@mui/icons-material/ListAlt';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <DescriptionIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CV Analyzer
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            startIcon={<DescriptionIcon />}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/upload"
            startIcon={<UploadFileIcon />}
          >
            Upload CV
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/criteria"
            startIcon={<ListAltIcon />}
          >
            Criteria
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
