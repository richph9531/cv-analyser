import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Box,
  TextField,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  Card,
  CardContent,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import config from '../config';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`criteria-tabpanel-${index}`}
      aria-labelledby={`criteria-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CriteriaPage: React.FC = () => {
  const [criteria, setCriteria] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/criteria`);
        setCriteria(response.data.criteria || '');
      } catch (error) {
        console.error('Error fetching criteria:', error);
        setError('Failed to load criteria.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCriteria();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const wdgllText = `What good looks like in a QA Engineer:

QUALITY FOCUSED: Shift left mentality, risk mitigation, testability across SDLC, test methodology knowledge

TESTING KNOWLEDGE: Wide range of testing skills, non-functional testing concerns, requirements definition

COLLABORATIVE: Team-focused, sees testing as team activity, knowledge sharing, mediation

TEST ARCHITECTURE: Tool selection, architecture discussions, CI/CD appreciation, pipeline design

DEVELOPMENT SKILLS: Multiple languages, clean code, production/test code contributions, debugging

ADAPTABLE: Pragmatic, self-organizing, not a quality gateway, independent work

CLIENT FOCUSED: Empathy, value delivery, holistic awareness, diplomacy

ANALYTICAL: Inquisitive, detail-oriented, well-organized, continuous learning

COMMUNITY: Knowledge sharing, seeking advice, coaching/mentoring`;

  const wdgllDetailed = `Has a shift left mentality, focusing on risk mitigation by identifying potential defects early in the process. Is quality-focused, considering testability across all phases of the software development life cycle. Deep knowledge of test methodologies and can apply that knowledge appropriately in a wide array of contexts. [QUALITY FOCUSED]
        
Has a wide range of testing skills, knows when and where to apply them, and when to take a different approach. Has a deep appreciation for a wide range of non-functional testing concerns. Can collaborate and support the team to define non-functional requirements and enable implementation. [TESTING KNOWLEDGE]

Is team focused and seeks to enable them to deliver quality products / services. Sees testing as a team activity and can facilitate and coordinate these tasks. Not only shares knowledge but receives it. Acts as a catalyst for mediation and collaboration within the team. [COLLABORATIVE]

Can call upon a wide range of testing tools, is framework agnostic and has the ability to decide on the right tool for the use case. Can contribute to discussions regarding application architecture and understand the implications of those decisions on quality. Has an appreciation for the benefits of continuous delivery and continuous integration. Can contribute to the implementation and design of high quality pipelines. [TEST ARCHITECTURE, TOOLING AND PIPELINE]

Has experience with multiple languages and can adopt new ones quickly. Understands modern coding practices and appreciates clean code. Has experience contributing to production and test code bases. Has debugging and diagnostic experience. Works with the team getting involved in collaborative programming. [DEVELOPMENT SKILLS]

Is pragmatic, adaptable, self organizing and knows how much to test and when to stop. Does not become a quality gateway. Enabling the team's needs with their expertise and seeking help when required. Able to work independently and asynchronously of others. [ADAPTABLE]

Helps clients navigate the journey towards their goals. Shows empathy for the client's current position and the journey that they have taken. They understand the why and know how to deliver value. They have a holistic awareness of the clients needs to enable them to deliver the right solution. Demonstrates diplomacy and actively seeks to help the client. [CLIENT FOCUSED]

Has an analytical mindset and is naturally inquisitive. Pays attention to detail and demonstrates the ability to zoom out to the holistic view. Is well organized and consistent. Has a passion for continual learning and is able to pick up on new technologies, frameworks and domains quickly. [ANALYTICAL]

Actively shares concepts such as ways of working, new tools and techniques with the team, the client and the wider network. Seeks advice when needed. Continually looking for opportunities to coach/mentor others and gets involved in facilitating or creating communities. [COMMUNITY]`;

  const evaluationRules = `BALANCED EVALUATION INSTRUCTIONS:
- Be thorough and critical in your evaluation, but also fair and realistic
- For a candidate to PASS, they must meet ALL of the following criteria WITHOUT EXCEPTION:
  1. NO areas assessed as "Weak evidence" or "No evidence" - ANY WEAK OR NO EVIDENCE MEANS AUTOMATIC FAIL
  2. Each of the 9 categories must have at least "Moderate evidence"
  3. At least FOUR categories must be rated as "Strong evidence"
  4. "TESTING_KNOWLEDGE" and "QUALITY_FOCUSED" MUST be among the categories with "Strong evidence"
- Look for both explicit evidence and reasonable inferences based on related experience
- Specific examples and achievements are valuable, but recognize that CVs are limited in space
- Generic statements should be evaluated in context of the overall CV and experience level
- Consider both the breadth and depth of experience appropriate to their career stage
- Look for indicators of impact and results, even if not explicitly quantified
- Confidence scores should be assigned as follows:
  * 90-100%: Exceptional evidence in 6+ categories with measurable achievements
  * 80-89%: Strong evidence in 5+ categories with specific examples
  * 70-79%: Strong evidence in exactly 4 categories including the required ones
  * Below 70%: Automatic FAIL`;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        CV Evaluation System
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="body1" paragraph>
          This page provides information about how the CV Analyzer evaluates candidates against our QA Engineer criteria.
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="criteria tabs">
            <Tab label="Screening Criteria" />
            <Tab label="What Does Good Look Like" />
            <Tab label="Evaluation Rules" />
          </Tabs>
        </Box>
        
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
            
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Current Screening Criteria
              </Typography>
              <TextField
                multiline
                rows={15}
                fullWidth
                value={criteria}
                InputProps={{ readOnly: true }}
                sx={{ mb: 3 }}
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                What Does Good Look Like (WDGLL)
              </Typography>
              
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Summary View</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    multiline
                    rows={12}
                    fullWidth
                    value={wdgllText}
                    InputProps={{ readOnly: true }}
                  />
                </AccordionDetails>
              </Accordion>
              
              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Detailed View</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    multiline
                    rows={20}
                    fullWidth
                    value={wdgllDetailed}
                    InputProps={{ readOnly: true }}
                  />
                </AccordionDetails>
              </Accordion>
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Evaluation Rules
              </Typography>
              <TextField
                multiline
                rows={15}
                fullWidth
                value={evaluationRules}
                InputProps={{ readOnly: true }}
                sx={{ mb: 3 }}
              />
              
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <InfoIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Automatic Fail Conditions
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" paragraph>
                    A candidate will automatically fail if any of these conditions are met:
                  </Typography>
                  <ul>
                    <li>
                      <Typography variant="body2">
                        Any category has "Weak evidence" or "No evidence"
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        Less than four categories have "Strong evidence"
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        Either "TESTING_KNOWLEDGE" or "QUALITY_FOCUSED" lacks "Strong evidence"
                      </Typography>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabPanel>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default CriteriaPage;
