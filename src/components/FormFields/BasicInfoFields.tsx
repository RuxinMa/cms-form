/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from 'react';
import { Controller, type Control, useWatch } from 'react-hook-form';
import { TextField, Box, IconButton, Tooltip } from '@mui/material';
import type { CMSFormData } from '@/types/cms.types';
import { generateSlug } from '@/utils/generateSlug';
import RefreshIcon from '@mui/icons-material/Refresh';

export interface BasicInfoFieldsProps {
  control: Control<CMSFormData>;
}

/**
 * Basic Information Fields Section
 * 
 * Contains:
 * - heading: Article title (max 100 characters)
 * - description: Article summary (max 500 characters)
 * - slug: URL-friendly identifier (auto-generated from heading)
 */
export function BasicInfoFields({ control }: BasicInfoFieldsProps) {
  // Track if slug has been manually edited
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  
  // Watch heading field for auto-generating slug
  const headingValue = useWatch({
    control,
    name: 'heading',
    defaultValue: '',
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Heading Field */}
      <Controller
        name="heading"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Heading"
            placeholder="Enter article heading"
            required
            fullWidth
            error={!!fieldState.error}
            helperText={
              fieldState.error?.message || 
              `${field.value?.length || 0}/100 characters`
            }
            inputProps={{
              maxLength: 100,
            }}
          />
        )}
      />

      {/* Description Field */}
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Description"
            placeholder="Enter article description"
            required
            fullWidth
            multiline
            rows={4}
            error={!!fieldState.error}
            helperText={
              fieldState.error?.message || 
              `${field.value?.length || 0}/500 characters`
            }
            inputProps={{
              maxLength: 500,
            }}
          />
        )}
      />

      {/* Slug Field with Auto-generation */}
      <Controller
        name="slug"
        control={control}
        render={({ field, fieldState }) => {
          // Auto-generate slug from heading if not manually edited
          useEffect(() => {
            if (!isSlugManuallyEdited && headingValue) {
              const autoSlug = generateSlug(headingValue);
              if (autoSlug !== field.value) {
                field.onChange(autoSlug);
              }
            }
          }, [headingValue, isSlugManuallyEdited, field]);

          return (
            <TextField
              {...field}
              label="Slug"
              placeholder="url-friendly-slug"
              required
              fullWidth
              error={!!fieldState.error}
              helperText={
                fieldState.error?.message || 
                'URL-friendly identifier (automatically generated from heading)'
              }
              onChange={(e) => {
                field.onChange(e);
                // Mark as manually edited when user types
                setIsSlugManuallyEdited(true);
              }}
              InputProps={{
                endAdornment: (
                  <Tooltip title="Reset to auto-generate from heading">
                    <IconButton
                      size="small"
                      onClick={() => {
                        const autoSlug = generateSlug(headingValue);
                        field.onChange(autoSlug);
                        setIsSlugManuallyEdited(false);
                      }}
                      edge="end"
                    >
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ),
              }}
            />
          );
        }}
      />
    </Box>
  );
}