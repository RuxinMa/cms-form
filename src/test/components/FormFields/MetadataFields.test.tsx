import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MetadataFields } from '../../../components/FormFields/MetadataFields';
import { cmsFormSchema } from '../../../schemas/cms.schema';
import type { CMSFormData } from '../../../types/cms.types';

/**
 * Test wrapper component that provides React Hook Form context
 */
function TestWrapper() {
  const { control } = useForm<CMSFormData>({
    resolver: zodResolver(cmsFormSchema),
    defaultValues: {
      heading: 'Test',
      description: 'Test',
      slug: 'test',
      content: 'Test',
      keywords: ['test'],
      author: 'Test',
      status: 'draft',
      category: 'blog',
      featured_image: '',
      is_featured: false,
      tags: ['test'],
      seo_title: '',
      seo_description: '',
    },
    mode: 'onBlur',
  });

  return <MetadataFields control={control} />;
}

/**
 * Helper function to render MetadataFields with form context
 */
function renderMetadataFields() {
  return render(<TestWrapper />);
}

describe('MetadataFields', () => {
  describe('Rendering', () => {
    it('should render all metadata fields', () => {
      renderMetadataFields();

      // Only Status and Category fields now
      expect(screen.getByText(/^status$/i)).toBeInTheDocument();
      expect(screen.getByText(/^category$/i)).toBeInTheDocument();
      
      // Check for info message about auto-generated fields
      expect(screen.getByText(/creation date, update date, and reading time will be automatically generated/i)).toBeInTheDocument();
    });

    it('should display info message about auto-generated fields', () => {
      renderMetadataFields();

      expect(screen.getByText(/creation date, update date, and reading time will be automatically generated/i)).toBeInTheDocument();
    });

    it('should display helper text for status field', () => {
      renderMetadataFields();

      expect(screen.getByText(/select the publication status of this content/i)).toBeInTheDocument();
    });

    it('should display helper text for category field', () => {
      renderMetadataFields();

      expect(screen.getByText(/choose the content category/i)).toBeInTheDocument();
    });

    it('should have default values for select fields', () => {
      renderMetadataFields();

      // Check default text is displayed
      expect(screen.getByText(/draft/i)).toBeInTheDocument();
      expect(screen.getByText(/blog/i)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should allow selecting different status options', async () => {
      const user = userEvent.setup();
      renderMetadataFields();

      // Find the Status select by its button role (MUI Select renders as button)
      const statusButton = screen.getByRole('combobox', { name: /status/i });
      await user.click(statusButton);

      // Wait for listbox to appear and select 'published'
      const publishedOption = await screen.findByRole('option', { name: /published/i });
      await user.click(publishedOption);

      // Verify selection by checking displayed text
      await waitFor(() => {
        expect(screen.getByRole('combobox', { name: /status/i })).toHaveTextContent('Published');
      });
    });

    it('should allow selecting different category options', async () => {
      const user = userEvent.setup();
      renderMetadataFields();

      // Find the Category select
      const categoryButton = screen.getByRole('combobox', { name: /category/i });
      await user.click(categoryButton);

      // Select 'news'
      const newsOption = await screen.findByRole('option', { name: /^news$/i });
      await user.click(newsOption);

      // Verify selection
      await waitFor(() => {
        expect(screen.getByRole('combobox', { name: /category/i })).toHaveTextContent('News');
      });
    });

    it('should display all status options in dropdown', async () => {
      const user = userEvent.setup();
      renderMetadataFields();

      const statusButton = screen.getByRole('combobox', { name: /status/i });
      await user.click(statusButton);

      // Check all options are available
      await waitFor(() => {
        expect(screen.getByRole('option', { name: /^draft$/i })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: /^published$/i })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: /^archived$/i })).toBeInTheDocument();
      });
    });

    it('should display all category options in dropdown', async () => {
      const user = userEvent.setup();
      renderMetadataFields();

      const categoryButton = screen.getByRole('combobox', { name: /category/i });
      await user.click(categoryButton);

      // Check all options are available
      await waitFor(() => {
        expect(screen.getByRole('option', { name: /^news$/i })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: /^blog$/i })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: /^press$/i })).toBeInTheDocument();
      });
    });
  });
});