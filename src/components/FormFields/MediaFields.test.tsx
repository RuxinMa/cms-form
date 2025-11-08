import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MediaFields } from './MediaFields';
import { cmsFormSchema } from '../../schemas/cms.schema';
import type { CMSFormData } from '../../types/cms.types';

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

  return <MediaFields control={control} />;
}

/**
 * Helper function to render MediaFields with form context
 */
function renderMediaFields() {
  return render(<TestWrapper />);
}

describe('MediaFields', () => {
  describe('Rendering', () => {
    it('should render featured image URL field', () => {
      renderMediaFields();

      expect(screen.getByLabelText(/featured image url/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/https:\/\/example.com\/image.jpg/i)).toBeInTheDocument();
    });

    it('should render featured content toggle', () => {
      const { container } = renderMediaFields();

      expect(screen.getByText(/featured content/i)).toBeInTheDocument();
      
      const switchInput = container.querySelector('input[name="is_featured"]');
      expect(switchInput).toBeInTheDocument();
    });

    it('should display helper text for featured image field', () => {
      renderMediaFields();

      expect(screen.getByText(/enter a valid image url or leave empty/i)).toBeInTheDocument();
    });

    it('should display helper text for featured toggle', () => {
      renderMediaFields();

      expect(
        screen.getByText(/mark this content as featured to highlight it on the homepage/i)
      ).toBeInTheDocument();
    });

    it('should have featured toggle unchecked by default', () => {
      const { container } = renderMediaFields();

      const switchInput = container.querySelector('input[name="is_featured"]') as HTMLInputElement;
      expect(switchInput.checked).toBe(false);
    });
  });

  describe('User Interactions', () => {
    it('should allow entering featured image URL', async () => {
      const user = userEvent.setup();
      renderMediaFields();

      const imageUrlInput = screen.getByLabelText(/featured image url/i) as HTMLInputElement;
      
      await user.type(imageUrlInput, 'https://example.com/test-image.jpg');

      await waitFor(() => {
        expect(imageUrlInput.value).toBe('https://example.com/test-image.jpg');
      });
    });

    it('should allow toggling featured content switch', async () => {
      const user = userEvent.setup();
      const { container } = renderMediaFields();

      const switchInput = container.querySelector('input[name="is_featured"]') as HTMLInputElement;
      
      expect(switchInput).toBeTruthy();
      expect(switchInput.checked).toBe(false);

      await user.click(switchInput);

      await waitFor(() => {
        expect(switchInput.checked).toBe(true);
      });

      await user.click(switchInput);

      await waitFor(() => {
        expect(switchInput.checked).toBe(false);
      });
    });

    it('should accept valid image URLs', async () => {
      const user = userEvent.setup();
      renderMediaFields();

      const imageUrlInput = screen.getByLabelText(/featured image url/i);
      
      const validUrls = [
        'https://example.com/image.jpg',
        'https://cdn.example.com/images/photo.png',
        'http://example.org/pic.gif',
      ];

      for (const url of validUrls) {
        await user.clear(imageUrlInput);
        await user.type(imageUrlInput, url);

        await waitFor(() => {
          expect(imageUrlInput).toHaveValue(url);
        });
      }
    });

    it('should allow empty featured image URL', async () => {
      const user = userEvent.setup();
      renderMediaFields();

      const imageUrlInput = screen.getByLabelText(/featured image url/i) as HTMLInputElement;
      
      await user.type(imageUrlInput, 'https://example.com/image.jpg');
      await user.clear(imageUrlInput);

      await waitFor(() => {
        expect(imageUrlInput.value).toBe('');
      });
    });
  });
});