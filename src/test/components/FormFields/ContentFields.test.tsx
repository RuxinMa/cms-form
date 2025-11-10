import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContentFields } from '@/components/FormFields/ContentFields';
import { cmsFormSchema } from '@/schemas/cms.schema';
import type { CMSFormData } from '@/types/cms.types';

/**
 * Test wrapper component that provides React Hook Form context
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

  return <ContentFields control={control} />;
}

/**
 * Helper function to render ContentFields with form context
 */
function renderContentFields() {
  return render(<TestWrapper />);
}

describe('ContentFields', () => {
  describe('Rendering', () => {
    it('should render all required fields', () => {
      renderContentFields();

      // Use getByText to find labels instead of getByLabelText
      expect(screen.getByText(/^content$/i)).toBeInTheDocument();
      expect(screen.getByText(/^keywords$/i)).toBeInTheDocument();
      expect(screen.getByText(/^author$/i)).toBeInTheDocument();
    });

    it('should display placeholders for each field', () => {
      renderContentFields();

      expect(screen.getByPlaceholderText(/enter article content/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/type and press enter to add keywords/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter author name/i)).toBeInTheDocument();
    });

    it('should mark required fields', () => {
      renderContentFields();

      const contentInput = screen.getByPlaceholderText(/enter article content/i);
      const authorInput = screen.getByPlaceholderText(/enter author name/i);

      expect(contentInput).toBeRequired();
      expect(authorInput).toBeRequired();
    });

    it('should display character count for content field', () => {
      renderContentFields();

      expect(screen.getByText(/0\/5000 characters/i)).toBeInTheDocument();
    });

    it('should display keyword count helper text', () => {
      renderContentFields();

      expect(screen.getByText(/0 keyword\(s\) added/i)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should update character count when typing in content field', async () => {
      const user = userEvent.setup();
      renderContentFields();

      const contentInput = screen.getByPlaceholderText(/enter article content/i);
      
      await user.type(contentInput, 'Test content');

      await waitFor(() => {
        expect(screen.getByText(/12\/5000 characters/i)).toBeInTheDocument();
      });
    });

    it('should add keywords when typing and pressing Enter', async () => {
      const user = userEvent.setup();
      renderContentFields();

      const keywordsInput = screen.getByPlaceholderText(/type and press enter to add keywords/i);
      
      // Type keyword and press Enter
      await user.type(keywordsInput, 'react{Enter}');
      
      await waitFor(() => {
        expect(screen.getByText('react')).toBeInTheDocument();
        expect(screen.getByText(/1 keyword\(s\) added/i)).toBeInTheDocument();
      });
    });

    it('should add multiple keywords', async () => {
      const user = userEvent.setup();
      renderContentFields();

      const keywordsInput = screen.getByPlaceholderText(/type and press enter to add keywords/i);
      
      // Add multiple keywords
      await user.type(keywordsInput, 'react{Enter}');
      await user.type(keywordsInput, 'typescript{Enter}');
      await user.type(keywordsInput, 'testing{Enter}');
      
      await waitFor(() => {
        expect(screen.getByText('react')).toBeInTheDocument();
        expect(screen.getByText('typescript')).toBeInTheDocument();
        expect(screen.getByText('testing')).toBeInTheDocument();
        expect(screen.getByText(/3 keyword\(s\) added/i)).toBeInTheDocument();
      });
    });

    it('should update author field when typing', async () => {
      const user = userEvent.setup();
      renderContentFields();

      const authorInput = screen.getByPlaceholderText(/enter author name/i) as HTMLInputElement;
      
      await user.type(authorInput, 'John Doe');

      await waitFor(() => {
        expect(authorInput.value).toBe('John Doe');
      });
    });

    it('should enforce max length on content field', async () => {
      const user = userEvent.setup();
      renderContentFields();

      const contentInput = screen.getByPlaceholderText(/enter article content/i) as HTMLInputElement;
      
      // Try to paste more than 5000 characters
      const longText = 'a'.repeat(5500);
      await user.click(contentInput);
      await user.paste(longText);

      await waitFor(() => {
        expect(contentInput.value.length).toBeLessThanOrEqual(5000);
      });
    });
  });
});