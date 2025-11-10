import { Controller, type Control } from 'react-hook-form';
import { TextField, Box, Chip } from '@mui/material';
import { useState } from 'react';
import type { CMSFormData } from '@/types/cms.types';

export interface SEOFieldsProps {
  control: Control<CMSFormData>;
}

/**
 * SEO Fields Section
 * 
 * Contains:
 * - seo_title: Optional SEO-optimized title for search engines (max 60 chars)
 * - seo_description: Optional SEO meta description (max 160 chars)
 * - tags: Content tags for categorization
 * 
 * Note: If SEO fields are left empty, the system will automatically use
 * the article's heading and description as defaults.
 */
export function SEOFields({ control }: SEOFieldsProps) {
  const [tagInput, setTagInput] = useState('');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* SEO Title Field */}
      <Controller
        name="seo_title"
        control={control}
        render={({ field, fieldState }) => (
          <Box>
            <TextField
              {...field}
              label="SEO Title"
              placeholder="Enter SEO title for search engines"
              fullWidth
              error={!!fieldState.error}
              helperText={
                fieldState.error?.message || 
                `Optional. Leave empty to use article heading. ${field.value.length}/60 characters. Best SEO: 50-60 chars.`
              }
            />
          </Box>
        )}
      />

      {/* SEO Description Field */}
      <Controller
        name="seo_description"
        control={control}
        render={({ field, fieldState }) => (
          <Box>
            <TextField
              {...field}
              label="SEO Description"
              placeholder="Enter meta description for search engines"
              multiline
              rows={3}
              fullWidth
              error={!!fieldState.error}
              helperText={
                fieldState.error?.message || 
                `Optional. Leave empty to use article description. ${field.value.length}/160 characters. Best SEO: 120-160 chars.`
              }
            />
          </Box>
        )}
      />

      {/* Tags Field */}
      <Controller
        name="tags"
        control={control}
        render={({ field, fieldState }) => (
          <Box>
            <TextField
              label="Tags"
              placeholder="Type and press Enter to add tags"
              fullWidth
              required
              error={!!fieldState.error}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  e.preventDefault();
                  const newTag = tagInput.trim();
                  if (!field.value.includes(newTag)) {
                    field.onChange([...field.value, newTag]);
                  }
                  setTagInput('');
                }
              }}
              helperText={
                fieldState.error?.message || 
                'Press Enter to add tags. Tags help categorize and organize content.'
              }
            />
            {/* Display current tags as chips */}
            {field.value.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 1 }}>
                {field.value.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => {
                      const newTags = field.value.filter((_, i) => i !== index);
                      field.onChange(newTags);
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
      />
    </Box>
  );
}