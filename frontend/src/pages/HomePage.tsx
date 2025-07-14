import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Paper, 
  Box,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SpeedIcon from '@mui/icons-material/Speed';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4, 
          textAlign: 'center',
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          CV Analyzer for QA Engineers
        </Typography>
        <Typography variant="h5" component="p" sx={{ mb: 4 }}>
          Streamline your hiring process with AI-powered CV analysis
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            size="large"
            color="secondary"
            startIcon={<UploadFileIcon />}
            onClick={() => navigate('/upload')}
            sx={{ 
              px: 4, 
              py: 1.5,
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'grey.100',
              }
            }}
          >
            Upload CV
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            startIcon={<ListAltIcon />}
            onClick={() => navigate('/criteria')}
            sx={{ 
              px: 4, 
              py: 1.5,
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: 'grey.100',
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            Set Criteria
          </Button>
        </Box>
      </Paper>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        How It Works
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <UploadFileIcon color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <Typography variant="h5" component="h3" gutterBottom>
                1. Upload CV
              </Typography>
              <Typography variant="body1">
                Upload candidate CVs in PDF, DOCX, or TXT format. Our system will extract all relevant information.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/upload')}>Upload Now</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} component="div">
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <AnalyticsIcon color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <Typography variant="h5" component="h3" gutterBottom>
                2. AI Analysis
              </Typography>
              <Typography variant="body1">
                Our AI analyzes the CV against your criteria for what makes a good QA engineer candidate.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/criteria')}>Set Criteria</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} component="div">
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <CheckCircleOutlineIcon color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <Typography variant="h5" component="h3" gutterBottom>
                3. Get Results
              </Typography>
              <Typography variant="body1">
                Receive a pass/fail determination with confidence level, strengths, and areas for improvement.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: 'grey.100' }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Why Use CV Analyzer?
        </Typography>
        <Typography variant="body1" paragraph>
          As a QA engineer hiring manager, you need to efficiently evaluate candidates against your specific requirements.
          Our AI-powered tool helps you:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeedIcon color="primary" />
              <Typography>Save time by automating initial CV screening</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} component="div">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleOutlineIcon color="primary" />
              <Typography>Ensure consistent evaluation criteria</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} component="div">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AnalyticsIcon color="primary" />
              <Typography>Get detailed insights on candidate strengths and weaknesses</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} component="div">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeedIcon color="primary" />
              <Typography>Focus your time on the most promising candidates</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default HomePage;
