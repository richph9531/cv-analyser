import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';

const CriteriaPage: React.FC = () => {
  const [criteria, setCriteria] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/criteria');
        setCriteria(response.data.criteria || '');
      } catch (error) {
        console.error('Error fetching criteria:', error);
        setError('Failed to load saved criteria. You can still create new criteria.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCriteria();
  }, []);

  const handleSaveCriteria = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      await axios.post('http://localhost:5001/api/criteria', { criteria });
      setSaveSuccess(true);
    } catch (error) {
      console.error('Error saving criteria:', error);
      setError('Failed to save criteria. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const defaultCriteria = `A good QA Engineer candidate should have:

1. Technical Skills:
   - Experience with manual and automated testing
   - Knowledge of testing methodologies (e.g., black box, white box)
   - Familiarity with test management tools
   - Experience with defect tracking systems
   - Basic programming/scripting skills
   - Understanding of API testing

2. Domain Knowledge:
   - Understanding of software development lifecycle
   - Knowledge of agile methodologies
   - Experience in relevant industry sectors

3. Soft Skills:
   - Strong analytical and problem-solving abilities
   - Excellent attention to detail
   - Good communication skills (verbal and written)
   - Team collaboration
   - Time management

4. Education and Certifications:
   - Relevant degree or equivalent experience
   - Industry certifications (ISTQB, etc.)

5. Experience:
   - Minimum of X years in QA/testing roles
   - Experience with similar products/technologies`;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Evaluation Criteria
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="body1" paragraph>
          Define what makes a good QA Engineer candidate. This criteria will be used by the AI to evaluate CVs.
        </Typography>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            )}
            
            {saveSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                <AlertTitle>Success</AlertTitle>
                Criteria saved successfully!
              </Alert>
            )}
            
            <TextField
              label="QA Engineer Evaluation Criteria"
              multiline
              rows={15}
              fullWidth
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              placeholder="Enter your criteria for what makes a good QA Engineer..."
              sx={{ mb: 3 }}
            />
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSaveCriteria}
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            >
              {isSaving ? 'Saving...' : 'Save Criteria'}
            </Button>
          </>
        )}
      </Paper>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InfoIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              How to Write Effective Criteria
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" paragraph>
            Be specific about what you're looking for in candidates. Include:
          </Typography>
          <ul>
            <li>
              <Typography variant="body2">
                Required technical skills and experience levels
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Important soft skills for your team environment
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Domain knowledge relevant to your industry
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Educational requirements or equivalent experience
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Any specific certifications that are valuable
              </Typography>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Example Criteria Template
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TextField
            multiline
            rows={10}
            fullWidth
            value={defaultCriteria}
            InputProps={{ readOnly: true }}
          />
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={() => setCriteria(defaultCriteria)}
          >
            Use This Template
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CriteriaPage;
