import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Typography, Alert, CircularProgress, Paper } from '@mui/material';
import { cmsFormSchema } from '../schemas/cms.schema';
import type { CMSFormData, CMSContentData } from '../types/cms.types';
import { BasicInfoFields } from './FormFields/BasicInfoFields';
import { ContentFields } from './FormFields/ContentFields';
import { MetadataFields } from './FormFields/MetadataFields';
import { MediaFields } from './FormFields/MediaFields';
import { SEOFields } from './FormFields/SEOFields';

export interface CMSFormProps {
  onSubmit: (data: CMSFormData) => Promise<CMSContentData>;
  initialData?: Partial<CMSFormData>;
}

/**
 * Default values for the form
 * Used when no initialData is provided
 */
const defaultFormValues: Partial<CMSFormData> = {
  heading: '',
  description: '',
  slug: '',
  content: '',
  keywords: [],
  author: '',
  status: 'draft',
  category: 'blog',
  featured_image: '',
  is_featured: false,
  tags: [],
  seo_title: '',
  seo_description: '',
};

/**
 * Main CMS Form Component
 * 
 * This component orchestrates the entire form:
 * - Manages form state using React Hook Form
 * - Handles validation with Zod schema
 * - Manages UI state (loading, errors, success)
 * - Distributes control to child FormFields components
 */
export function CMSForm({ onSubmit, initialData }: CMSFormProps) {
  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CMSFormData>({
    resolver: zodResolver(cmsFormSchema),
    defaultValues: { ...defaultFormValues, ...initialData },
    mode: 'onBlur', // Validate on blur for better UX
  });

  // UI state management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedContent, setSubmittedContent] = useState<CMSContentData | null>(null);

  /**
   * Handle form submission
   * @param data - Validated form data from React Hook Form
   */
  const onSubmitHandler = async (data: CMSFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setSubmittedContent(null);

    try {
      const response = await onSubmit(data);
      
      // Store the response for display
      setSubmittedContent(response);
      
      // Log server-generated fields
      console.log('✅ Content created successfully:', {
        id: response.id,
        created_at: response.created_at,
        read_time_minutes: response.read_time_minutes,
      });
      
      setSubmitSuccess(true);
      reset(defaultFormValues); // Reset form to default values
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: '0 auto',
        padding: 3,
      }}
    >
      {/* Form Header */}
      <Typography variant="h4" component="h1" gutterBottom>
        Create CMS Content
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Fill in the form below to create new content for your CMS
      </Typography>

      {/* Success Message */}
      {submitSuccess && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          Content saved successfully!
        </Alert>
      )}

      {/* Error Message */}
      {submitError && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {submitError}
        </Alert>
      )}

      {/* Submitted Content Info */}
      {submittedContent && (
        <Paper 
          sx={{ 
            padding: 2, 
            marginBottom: 2, 
            bgcolor: '#f1f8e9',
            border: '1px solid',
            borderColor: 'success.main'
          }}
        >
          <Typography variant="h6" gutterBottom color="success.main">
            ✅ Content Created Successfully
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2">
              <strong>ID:</strong> {submittedContent.id}
            </Typography>
            <Typography variant="body2">
              <strong>Created:</strong> {new Date(submittedContent.created_at).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              <strong>Read Time:</strong> {submittedContent.read_time_minutes} minute(s)
            </Typography>
            {submittedContent.updated_at && (
              <Typography variant="body2">
                <strong>Last Updated:</strong> {new Date(submittedContent.updated_at).toLocaleString()}
              </Typography>
            )}
          </Box>
        </Paper>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmitHandler)} noValidate>
        {/* Basic Information Section */}
        <Paper sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
          <BasicInfoFields control={control} />
        </Paper>

        {/* Content Section */}
        <Paper sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Content
          </Typography>
          <ContentFields control={control} />
        </Paper>

        {/* Metadata Section */}
        <Paper sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Metadata
          </Typography>
          <MetadataFields control={control} />
        </Paper>

        {/* Media Section */}
        <Paper sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Media
          </Typography>
          <MediaFields control={control} />
        </Paper>

        {/* SEO Section */}
        <Paper sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            SEO & Tags
          </Typography>
          <SEOFields control={control} />
        </Paper>

        {/* Submit Button */}
        <Box sx={{ marginTop: 4 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Saving...' : 'Save Content'}
          </Button>
        </Box>

        {/* Debug Info (Remove in production) */}
        {Object.keys(errors).length > 0 && (
          <Alert severity="warning" sx={{ marginTop: 2 }}>
            <Typography variant="body2" fontWeight="bold">
              Form has validation errors:
            </Typography>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>
                  <Typography variant="caption">
                    {field}: {error.message}
                  </Typography>
                </li>
              ))}
            </ul>
          </Alert>
        )}
      </form>
    </Box>
  );
}