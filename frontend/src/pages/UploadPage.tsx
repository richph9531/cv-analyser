import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Paper, 
  Box,
  TextField,
  CircularProgress,
  Alert,
  AlertTitle
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [criteria, setCriteria] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only PDF, DOCX, and TXT files are supported');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Add criteria if provided
      if (criteria.trim()) {
        formData.append('criteria', criteria);
      }

      const response = await axios.post('http://localhost:5001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Navigate to results page
      navigate(`/results/${response.data.id}`);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to upload file. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Upload CV for Analysis
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="body1" paragraph>
          Upload a candidate's CV in PDF, DOCX, or TXT format. Our AI will analyze it against your criteria for what makes a good QA engineer.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
        
        <Box 
          sx={{ 
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            mb: 3,
            backgroundColor: '#f9f9f9',
            cursor: 'pointer'
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
          />
          <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Drag & Drop CV Here
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            or
          </Typography>
          <Button variant="outlined" color="primary">
            Browse Files
          </Button>
          
          {selectedFile && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Selected file: <strong>{selectedFile.name}</strong>
              </Typography>
            </Box>
          )}
        </Box>
        
        <TextField
          label="Custom Criteria (Optional)"
          multiline
          rows={4}
          fullWidth
          placeholder="Enter specific criteria for evaluating QA Engineers. If left empty, we'll use your saved criteria or our default criteria."
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
          sx={{ mb: 3 }}
        />
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
        >
          {isUploading ? 'Uploading...' : 'Upload and Analyze'}
        </Button>
      </Paper>
      
      <Paper sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          Tips for Best Results
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">
              Make sure the CV is in a readable format (PDF, DOCX, or TXT)
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              For more accurate analysis, define your criteria for what makes a good QA Engineer
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              The analysis typically takes 10-20 seconds depending on the CV length
            </Typography>
          </li>
        </ul>
      </Paper>
    </Box>
  );
};

export default UploadPage;
