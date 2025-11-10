import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SEOFields } from '@/components/FormFields/SEOFields';
import { cmsFormSchema } from '@/schemas/cms.schema';
import type { CMSFormData } from '@/types/cms.types';

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
      tags: [],
      seo_title: '',
      seo_description: '',
    },
    mode: 'onBlur',
  });

  return <SEOFields control={control} />;
}

function renderSEOFields() {
  return render(<TestWrapper />);
}

describe('SEOFields', () => {
  describe('Rendering', () => {
    it('should render all SEO fields', () => {
      renderSEOFields();

      expect(screen.getByPlaceholderText(/enter seo title for search engines/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter meta description for search engines/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/type and press enter to add tags/i)).toBeInTheDocument();
    });

    it('should display placeholders for each field', () => {
      renderSEOFields();

      expect(screen.getByPlaceholderText(/enter seo title for search engines/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter meta description for search engines/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/type and press enter to add tags/i)).toBeInTheDocument();
    });

    it('should mark tags field as required', () => {
      renderSEOFields();

      const tagsInput = screen.getByPlaceholderText(/type and press enter to add tags/i);
      expect(tagsInput).toBeRequired();
    });

    it('should display character count for seo title', () => {
      renderSEOFields();

      expect(screen.getByText(/0\/60 characters/i)).toBeInTheDocument();
    });

    it('should display character count for seo description', () => {
      renderSEOFields();

      expect(screen.getByText(/0\/160 characters/i)).toBeInTheDocument();
    });

    it('should display helper text indicating fields are optional', () => {
      renderSEOFields();

      expect(screen.getByText(/optional.*leave empty to use article heading/i)).toBeInTheDocument();
      expect(screen.getByText(/optional.*leave empty to use article description/i)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should update character count when typing in seo title', async () => {
      const user = userEvent.setup();
      renderSEOFields();

      const seoTitleInput = screen.getByPlaceholderText(/enter seo title for search engines/i);
      
      await user.type(seoTitleInput, 'Test SEO Title');

      await waitFor(() => {
        expect(screen.getByText(/14\/60 characters/i)).toBeInTheDocument();
      });
    });

    it('should update character count when typing in seo description', async () => {
      const user = userEvent.setup();
      renderSEOFields();

      const seoDescInput = screen.getByPlaceholderText(/enter meta description for search engines/i);
      
      await user.type(seoDescInput, 'Test SEO description');

      await waitFor(() => {
        expect(screen.getByText(/20\/160 characters/i)).toBeInTheDocument();
      });
    });

    it('should add tags when typing and pressing Enter', async () => {
      const user = userEvent.setup();
      renderSEOFields();

      const tagsInput = screen.getByPlaceholderText(/type and press enter to add tags/i);
      
      await user.type(tagsInput, 'javascript{Enter}');
      
      await waitFor(() => {
        expect(screen.getByText('javascript')).toBeInTheDocument();
      });
    });

    it('should add multiple tags', async () => {
      const user = userEvent.setup();
      renderSEOFields();

      const tagsInput = screen.getByPlaceholderText(/type and press enter to add tags/i);
      
      await user.type(tagsInput, 'react{Enter}');
      await user.type(tagsInput, 'typescript{Enter}');
      await user.type(tagsInput, 'frontend{Enter}');
      
      await waitFor(() => {
        expect(screen.getByText('react')).toBeInTheDocument();
        expect(screen.getByText('typescript')).toBeInTheDocument();
        expect(screen.getByText('frontend')).toBeInTheDocument();
      });
    });

    it('should not add duplicate tags', async () => {
      const user = userEvent.setup();
      renderSEOFields();

      const tagsInput = screen.getByPlaceholderText(/type and press enter to add tags/i);
      
      await user.type(tagsInput, 'react{Enter}');
      await user.type(tagsInput, 'react{Enter}');
      
      await waitFor(() => {
        const reactChips = screen.getAllByText('react');
        expect(reactChips).toHaveLength(1);
      });
    });

    it('should allow empty seo title and description', async () => {
      const user = userEvent.setup();
      renderSEOFields();

      const seoTitleInput = screen.getByPlaceholderText(/enter seo title for search engines/i) as HTMLInputElement;
      const seoDescInput = screen.getByPlaceholderText(/enter meta description for search engines/i) as HTMLInputElement;
      
      expect(seoTitleInput.value).toBe('');
      expect(seoDescInput.value).toBe('');

      await user.type(seoTitleInput, 'Test Title');
      await user.clear(seoTitleInput);

      await waitFor(() => {
        expect(seoTitleInput.value).toBe('');
      });
    });
  });
});