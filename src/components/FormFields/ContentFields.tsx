import { Controller, type Control } from 'react-hook-form';
import { 
  TextField, 
  Box, 
  Chip,
  Autocomplete
} from '@mui/material';
import type { CMSFormData } from '../../types/cms.types';

export interface ContentFieldsProps {
  control: Control<CMSFormData>;
}

/**
 * Content Fields Section
 * 
 * Contains:
 * - content: Main article content (max 5000 characters)
 * - keywords: Array of keywords (at least 1 required)
 * - author: Article author name
 */
export function ContentFields({ control }: ContentFieldsProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Content Field */}
      <Controller
        name="content"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Content"
            placeholder="Enter article content"
            required
            fullWidth
            multiline
            rows={8}
            error={!!fieldState.error}
            helperText={
              fieldState.error?.message || 
              `${field.value?.length || 0}/5000 characters`
            }
            inputProps={{
              maxLength: 5000,
            }}
          />
        )}
      />

      {/* Keywords Field */}
      <Controller
        name="keywords"
        control={control}
        render={({ field, fieldState }) => (
          <Autocomplete
            {...field}
            multiple
            freeSolo
            options={[]}
            value={field.value || []}
            onChange={(_, newValue) => {
              field.onChange(newValue);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Keywords"
                placeholder="Type and press Enter to add keywords"
                required
                error={!!fieldState.error}
                helperText={
                  fieldState.error?.message || 
                  `${field.value?.length || 0} keyword(s) added`
                }
              />
            )}
          />
        )}
      />

      {/* Author Field */}
      <Controller
        name="author"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Author"
            placeholder="Enter author name"
            required
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </Box>
  );
}