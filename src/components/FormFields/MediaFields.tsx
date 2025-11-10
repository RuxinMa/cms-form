import { Controller, type Control } from 'react-hook-form';
import { 
  TextField, 
  Box,
  FormControlLabel,
  Switch,
  Typography
} from '@mui/material';
import type { CMSFormData } from '@/types/cms.types';

export interface MediaFieldsProps {
  control: Control<CMSFormData>;
}

/**
 * Media Fields Section
 * 
 * Contains:
 * - featured_image: URL to featured image
 * - is_featured: Toggle to mark content as featured
 */
export function MediaFields({ control }: MediaFieldsProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Featured Image Field */}
      <Controller
        name="featured_image"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Featured Image URL"
            placeholder="https://example.com/image.jpg"
            fullWidth
            error={!!fieldState.error}
            helperText={
              fieldState.error?.message || 
              'Enter a valid image URL or leave empty'
            }
            type="url"
          />
        )}
      />

      {/* Is Featured Toggle */}
      <Controller
        name="is_featured"
        control={control}
        render={({ field }) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  name={field.name}
                />
              }
              label="Featured Content"
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
              Mark this content as featured to highlight it on the homepage
            </Typography>
          </Box>
        )}
      />
    </Box>
  );
}