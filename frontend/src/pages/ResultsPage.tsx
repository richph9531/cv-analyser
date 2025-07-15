import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Paper, 
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Card,
  CardContent
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import WarningIcon from '@mui/icons-material/Warning';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import config from '../config';

interface CategoryAssessment {
  rating: string;
  assessment: string;
}

interface ResultData {
  id: string;
  original_filename: string;
  timestamp: string;
  result: {
    decision: string;
    confidence: number;
    justification: string[] | string;
    strengths: string[];
    improvement_areas: string[];
    category_assessments?: {
      QUALITY_FOCUSED: CategoryAssessment;
      TESTING_KNOWLEDGE: CategoryAssessment;
      COLLABORATIVE: CategoryAssessment;
      TEST_ARCHITECTURE: CategoryAssessment;
      DEVELOPMENT_SKILLS: CategoryAssessment;
      ADAPTABLE: CategoryAssessment;
      CLIENT_FOCUSED: CategoryAssessment;
      ANALYTICAL: CategoryAssessment;
      COMMUNITY: CategoryAssessment;
    };
  };
}

const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<ResultData | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!id) {
        setError('Invalid result ID');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${config.apiUrl}/api/results/${id}`);
        console.log('Result data:', response.data);
        console.log('Justification type:', typeof response.data.result.justification);
        console.log('Justification value:', response.data.result.justification);
        setResultData(response.data);
      } catch (error) {
        console.error('Error fetching result:', error);
        setError('Failed to fetch analysis result. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading analysis results...
        </Typography>
      </Box>
    );
  }

  if (error || !resultData) {
    return (
      <Box>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error || 'Failed to load results'}
        </Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/upload')}
          sx={{ mt: 2 }}
        >
          Back to Upload
        </Button>
      </Box>
    );
  }

  const { result, original_filename } = resultData;
  const isPassed = result.decision === 'PASS';
  const formattedDate = new Date(resultData.timestamp).toLocaleString();

  return (
    <Box>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/upload')}
        sx={{ mb: 3 }}
      >
        Back to Upload
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        CV Analysis Results
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" color="textSecondary">
          File: {original_filename}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Analyzed on: {formattedDate}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: isPassed ? 'success.light' : 'error.light',
              color: 'white',
              mr: 2
            }}
          >
            {isPassed ? 
              <CheckCircleIcon sx={{ fontSize: 40 }} /> : 
              <CancelIcon sx={{ fontSize: 40 }} />
            }
          </Box>
          <Box>
            <Typography variant="h5">
              {isPassed ? 'PASS' : 'FAIL'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                Confidence:
              </Typography>
              <Chip 
                label={`${result.confidence}%`} 
                color={result.confidence > 75 ? 'success' : result.confidence > 50 ? 'warning' : 'error'}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon color="primary" sx={{ mr: 1 }} />
                Key Strengths
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {result.strengths.map((strength, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={strength} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon color="warning" sx={{ mr: 1 }} />
                Areas for Improvement
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {result.improvement_areas.map((area, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <WarningIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={area} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Justification
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {Array.isArray(result.justification) ? (
          <List>
            {result.justification.map((point, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <StarIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={point} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', pl: 2 }}>
            {result.justification}
          </Typography>
        )}
      </Paper>

      {result.category_assessments && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Detailed Category Assessments
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={3}>
            {Object.entries(result.category_assessments).map(([category, assessment]) => {
              // Convert category name for display (e.g., QUALITY_FOCUSED -> Quality Focused)
              const displayCategory = category.replace(/_/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
              
              // Determine color based on rating
              const ratingColor = assessment.rating.includes('Strong') ? 'success' : 
                                 assessment.rating.includes('Moderate') ? 'info' : 
                                 assessment.rating.includes('Weak') ? 'warning' : 'error';
              
              return (
                <Grid item xs={12} md={6} key={category}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6">{displayCategory}</Typography>
                        <Chip 
                          label={assessment.rating} 
                          color={ratingColor as 'success' | 'info' | 'warning' | 'error'} 
                          size="small" 
                        />
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body2">{assessment.assessment}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/upload')}
        >
          Analyze Another CV
        </Button>
      </Box>
    </Box>
  );
};

export default ResultsPage;
