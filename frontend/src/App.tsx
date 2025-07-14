import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

// Import pages
import Header from './components/Header';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import CriteriaPage from './pages/CriteriaPage';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/results/:id" element={<ResultsPage />} />
              <Route path="/criteria" element={<CriteriaPage />} />
            </Routes>
          </Container>
          <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[200] }}>
            <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
              <p>CV Analyzer &copy; {new Date().getFullYear()}</p>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
