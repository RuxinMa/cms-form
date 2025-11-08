import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BasicInfoFields } from './BasicInfoFields';
import { cmsFormSchema } from '../../schemas/cms.schema';
import type { CMSFormData } from '../../types/cms.types';

/**
 * Test wrapper component that provides React Hook Form context
 * This is necessary because BasicInfoFields requires a control prop from useForm
 */
function TestWrapper() {
  const { control } = useForm<CMSFormData>({
    resolver: zodResolver(cmsFormSchema),
    defaultValues: {
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
    },
    mode: 'onBlur',
  });

  return <BasicInfoFields control={control} />;
}

/**
 * Helper function to render BasicInfoFields with form context
 */
function renderBasicInfoFields() {
  return render(<TestWrapper />);
}

describe('BasicInfoFields', () => {
  describe('Rendering', () => {
    it('should render all required fields', () => {
      renderBasicInfoFields();

      // Check if all three fields are present by their labels
      expect(screen.getByText(/^heading$/i)).toBeInTheDocument();
      expect(screen.getByText(/^description$/i)).toBeInTheDocument();
      expect(screen.getByText(/^slug$/i)).toBeInTheDocument();
    });

    it('should display placeholders for each field', () => {
      renderBasicInfoFields();

      expect(screen.getByPlaceholderText(/enter article heading/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter article description/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/url-friendly-slug/i)).toBeInTheDocument();
    });

    it('should mark required fields with required attribute', () => {
      renderBasicInfoFields();

      // Get the actual input elements via placeholder
      const headingInput = screen.getByPlaceholderText(/enter article heading/i);
      const descriptionInput = screen.getByPlaceholderText(/enter article description/i);
      const slugInput = screen.getByPlaceholderText(/url-friendly-slug/i);

      // Check if inputs have required attribute
      expect(headingInput).toBeRequired();
      expect(descriptionInput).toBeRequired();
      expect(slugInput).toBeRequired();
    });

    it('should display character count helper text', () => {
      renderBasicInfoFields();

      expect(screen.getByText(/0\/100 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/0\/500 characters/i)).toBeInTheDocument();
    });

    it('should display slug helper text', () => {
      renderBasicInfoFields();

      expect(
        screen.getByText(/url-friendly identifier \(automatically generated from heading\)/i)
      ).toBeInTheDocument();
    });

    it('should render refresh button for slug field', () => {
      renderBasicInfoFields();

      const refreshButton = screen.getByRole('button', { name: /reset to auto-generate from heading/i });
      expect(refreshButton).toBeInTheDocument();
    });
  });
});

describe('User Interactions', () => {
    it('should update character count when typing in heading field', async () => {
      const user = userEvent.setup();
      renderBasicInfoFields();

      const headingInput = screen.getByPlaceholderText(/enter article heading/i);
      
      // Type in the heading field
      await user.type(headingInput, 'Test Heading');

      // Check if character count updates (12 characters)
      await waitFor(() => {
        expect(screen.getByText(/12\/100 characters/i)).toBeInTheDocument();
      });
    });

    it('should update character count when typing in description field', async () => {
      const user = userEvent.setup();
      renderBasicInfoFields();

      const descriptionInput = screen.getByPlaceholderText(/enter article description/i);
      
      // Type in the description field
      await user.type(descriptionInput, 'Test description');

      // Check if character count updates (16 characters)
      await waitFor(() => {
        expect(screen.getByText(/16\/500 characters/i)).toBeInTheDocument();
      });
    });

    it('should auto-generate slug from heading', async () => {
      const user = userEvent.setup();
      renderBasicInfoFields();

      const headingInput = screen.getByPlaceholderText(/enter article heading/i);
      const slugInput = screen.getByPlaceholderText(/url-friendly-slug/i) as HTMLInputElement;

      // Type in the heading field
      await user.type(headingInput, 'My Test Article');

      // Wait for slug to auto-generate
      await waitFor(() => {
        expect(slugInput.value).toBe('my-test-article');
      });
    });

    it('should not auto-generate slug after manual edit', async () => {
      const user = userEvent.setup();
      renderBasicInfoFields();

      const headingInput = screen.getByPlaceholderText(/enter article heading/i);
      const slugInput = screen.getByPlaceholderText(/url-friendly-slug/i) as HTMLInputElement;

      // First, type in heading to generate slug
      await user.type(headingInput, 'Initial Heading');
      
      await waitFor(() => {
        expect(slugInput.value).toBe('initial-heading');
      });

      // Manually edit the slug
      await user.clear(slugInput);
      await user.type(slugInput, 'custom-slug');

      // Change the heading
      await user.clear(headingInput);
      await user.type(headingInput, 'New Heading');

      // Slug should NOT change (still custom-slug)
      await waitFor(() => {
        expect(slugInput.value).toBe('custom-slug');
      });
    });

    it('should reset slug to auto-generate when refresh button is clicked', async () => {
      const user = userEvent.setup();
      renderBasicInfoFields();

      const headingInput = screen.getByPlaceholderText(/enter article heading/i);
      const slugInput = screen.getByPlaceholderText(/url-friendly-slug/i) as HTMLInputElement;
      const refreshButton = screen.getByRole('button', { name: /reset to auto-generate from heading/i });

      // Type heading
      await user.type(headingInput, 'Original Heading');
      
      await waitFor(() => {
        expect(slugInput.value).toBe('original-heading');
      });

      // Manually edit slug
      await user.clear(slugInput);
      await user.type(slugInput, 'manual-slug');

      // Click refresh button
      await user.click(refreshButton);

      // Slug should reset to auto-generated value
      await waitFor(() => {
        expect(slugInput.value).toBe('original-heading');
      });

      // Now if we change heading, slug should auto-generate again
      await user.clear(headingInput);
      await user.type(headingInput, 'Updated Heading');

      await waitFor(() => {
        expect(slugInput.value).toBe('updated-heading');
      });
    });

    it('should enforce max length on heading field', async () => {
      const user = userEvent.setup();
      renderBasicInfoFields();

      const headingInput = screen.getByPlaceholderText(/enter article heading/i) as HTMLInputElement;
      
      // Try to type more than 100 characters (using paste for speed)
      const longText = 'a'.repeat(150);
      await user.click(headingInput);
      await user.paste(longText);

      // Should be truncated to 100 characters
      await waitFor(() => {
        expect(headingInput.value.length).toBeLessThanOrEqual(100);
      });
    });

    it('should enforce max length on description field', async () => {
      const user = userEvent.setup();
      renderBasicInfoFields();

      const descriptionInput = screen.getByPlaceholderText(/enter article description/i) as HTMLInputElement;
      
      // Try to type more than 500 characters (using paste for speed)
      const longText = 'a'.repeat(600);
      await user.click(descriptionInput);
      await user.paste(longText);

      // Should be truncated to 500 characters
      await waitFor(() => {
        expect(descriptionInput.value.length).toBeLessThanOrEqual(500);
      });
    });
  });