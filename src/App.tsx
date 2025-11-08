import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { CMSForm } from './components/CMSForm';
import { submitCMSContent } from './services/api.service';
import type { CMSFormData, CMSContentData } from './types/cms.types';

// Create MUI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  /**
   * Handle form submission
   * This will call the mock API service
   */
  const handleSubmit = async (data: CMSFormData): Promise<CMSContentData> => {
    console.log('📝 Form submitted with data:', data);
    
    try {
      // Call mock API service
      const response = await submitCMSContent(data);
      
      console.log('✅ Content created successfully!');
      console.log('   ID:', response.id);
      console.log('   Created:', new Date(response.created_at).toLocaleString());
      console.log('   Read time:', response.read_time_minutes, 'minutes');
      
      return response;
    } catch (error) {
      console.error('❌ Submission failed:', error);
      throw error;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CMSForm onSubmit={handleSubmit} />
    </ThemeProvider>
  );
}

export default App;