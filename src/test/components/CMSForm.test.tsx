import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CMSForm } from '@/components/CMSForm';
import type { CMSFormData, CMSContentData } from '@/types/cms.types';

/**
 * Valid initial data that passes all schema validations
 */
const validInitialData: CMSFormData = {
  heading: 'Test Heading',
  description: 'Test Description',
  slug: 'test-heading',
  content: 'Test content',
  keywords: ['test'],
  author: 'Test Author',
  status: 'draft',
  category: 'blog',
  featured_image: '',
  is_featured: false,
  tags: ['test'],
  seo_title: '',
  seo_description: '',
};

/**
 * Mock response with server-generated fields
 */
const mockResponse: CMSContentData = {
  ...validInitialData,
  id: 'cms-123',
  created_at: '2025-01-01T10:00:00Z',
  read_time_minutes: 1,
};

/**
 * Mock function to simulate API submission
 */
const mockOnSubmit = vi.fn<(data: CMSFormData) => Promise<CMSContentData>>();

/**
 * Helper function to render CMSForm component
 */
function renderCMSForm(props: { 
  onSubmit?: (data: CMSFormData) => Promise<CMSContentData>;
  initialData?: Partial<CMSFormData>;
} = {}) {
  const defaultProps = {
    onSubmit: mockOnSubmit,
    ...props,
  };

  return render(<CMSForm {...defaultProps} />);
}

describe('CMSForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnSubmit.mockResolvedValue(mockResponse);
  });

  describe('Rendering', () => {
    it('should render form title and description', () => {
      renderCMSForm();

      expect(screen.getByText(/create cms content/i)).toBeInTheDocument();
      expect(screen.getByText(/fill in the form below/i)).toBeInTheDocument();
    });

    it('should render all form sections', () => {
      renderCMSForm();

      expect(screen.getByRole('heading', { name: /basic information/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /^content$/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /metadata/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /media/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /seo & tags/i })).toBeInTheDocument();
    });

    it('should render all BasicInfoFields', () => {
      renderCMSForm();

      expect(screen.getByPlaceholderText(/enter article heading/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter article description/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/url-friendly-slug/i)).toBeInTheDocument();
    });

    it('should render all ContentFields', () => {
      renderCMSForm();

      expect(screen.getByPlaceholderText(/enter article content/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/type and press enter to add keywords/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter author name/i)).toBeInTheDocument();
    });

    it('should render all MetadataFields', () => {
      renderCMSForm();

      // Status and Category selects (dates are auto-generated now)
      expect(screen.getByText(/^status$/i)).toBeInTheDocument();
      expect(screen.getByText(/^category$/i)).toBeInTheDocument();
      
      // Check for auto-generation info message
      expect(screen.getByText(/creation date, update date, and reading time will be automatically generated/i)).toBeInTheDocument();
    });

    it('should render all MediaFields', () => {
      renderCMSForm();

      expect(screen.getByLabelText(/featured image url/i)).toBeInTheDocument();
      expect(screen.getByText(/featured content/i)).toBeInTheDocument();
    });

    it('should render all SEOFields', () => {
      renderCMSForm();

      expect(screen.getByPlaceholderText(/enter seo title for search engines/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter meta description for search engines/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/type and press enter to add tags/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      renderCMSForm();

      const submitButton = screen.getByRole('button', { name: /save content/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });

    it('should not show success or error messages initially', () => {
      renderCMSForm();

      expect(screen.queryByText(/content saved successfully/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data from all sections', async () => {
      const user = userEvent.setup();
      
      renderCMSForm({ initialData: validInitialData });

      const headingInput = screen.getByPlaceholderText(/enter article heading/i);
      await user.clear(headingInput);
      await user.type(headingInput, 'Updated Heading');

      const authorInput = screen.getByPlaceholderText(/enter author name/i);
      await user.clear(authorInput);
      await user.type(authorInput, 'Updated Author');

      await waitFor(() => {
        const slugInput = screen.getByPlaceholderText(/url-friendly-slug/i) as HTMLInputElement;
        expect(slugInput.value).toBe('updated-heading');
      });

      const submitButton = screen.getByRole('button', { name: /save content/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });

      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData.heading).toBe('Updated Heading');
      expect(submittedData.slug).toBe('updated-heading');
      expect(submittedData.author).toBe('Updated Author');
      expect(submittedData.content).toBe('Test content');
      expect(submittedData.status).toBe('draft');
    });

    it('should display success message after successful submission', async () => {
      const user = userEvent.setup();
      
      renderCMSForm({ initialData: validInitialData });

      await user.click(screen.getByRole('button', { name: /save content/i }));

      await waitFor(() => {
        expect(screen.getByText(/content saved successfully/i)).toBeInTheDocument();
      });
    });

    it('should hide success message after 3 seconds', async () => {
      const user = userEvent.setup();
      
      renderCMSForm({ initialData: validInitialData });

      await user.click(screen.getByRole('button', { name: /save content/i }));

      await waitFor(() => {
        expect(screen.getByText(/content saved successfully/i)).toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(screen.queryByText(/content saved successfully/i)).not.toBeInTheDocument();
        },
        { timeout: 4000 }
      );
    });

    it('should display error message when submission fails', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Failed to save content';
      mockOnSubmit.mockRejectedValue(new Error(errorMessage));
      
      renderCMSForm({ initialData: validInitialData });

      await user.click(screen.getByRole('button', { name: /save content/i }));

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should show loading state and disable button during submission', async () => {
      const user = userEvent.setup();
      
      mockOnSubmit.mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockResponse), 200);
        });
      });
      
      renderCMSForm({ initialData: validInitialData });

      const submitButton = screen.getByRole('button', { name: /save content/i });
      expect(submitButton).not.toBeDisabled();

      const clickPromise = user.click(submitButton);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const savingButton = buttons.find(btn => btn.textContent?.includes('Saving'));
        expect(savingButton).toBeDefined();
        expect(savingButton).toBeDisabled();
      }, { timeout: 1000 });

      await clickPromise;
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /save content/i });
        expect(saveButton).not.toBeDisabled();
      });
    });

    it('should call onSubmit only once when button is clicked', async () => {
      const user = userEvent.setup();
      
      renderCMSForm({ initialData: validInitialData });

      await user.click(screen.getByRole('button', { name: /save content/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Initial Data', () => {
    it('should populate all form fields with initialData when provided', () => {
      const fullInitialData: CMSFormData = {
        heading: 'Existing Article',
        description: 'Existing description',
        slug: 'existing-article',
        content: 'Existing content',
        author: 'John Doe',
        keywords: ['react', 'testing'],
        status: 'published',
        category: 'news',
        featured_image: 'https://example.com/image.jpg',
        is_featured: true,
        tags: ['tech', 'development'],
        seo_title: 'SEO Title',
        seo_description: 'SEO Description',
      };

      const { container } = renderCMSForm({ initialData: fullInitialData });

      expect(screen.getByPlaceholderText(/enter article heading/i)).toHaveValue('Existing Article');
      expect(screen.getByPlaceholderText(/enter article description/i)).toHaveValue('Existing description');
      expect(screen.getByPlaceholderText(/url-friendly-slug/i)).toHaveValue('existing-article');

      expect(screen.getByPlaceholderText(/enter article content/i)).toHaveValue('Existing content');
      expect(screen.getByPlaceholderText(/enter author name/i)).toHaveValue('John Doe');

      expect(screen.getByLabelText(/featured image url/i)).toHaveValue('https://example.com/image.jpg');
      const switchInput = container.querySelector('input[name="is_featured"]') as HTMLInputElement;
      expect(switchInput.checked).toBe(true);

      expect(screen.getByPlaceholderText(/enter seo title for search engines/i)).toHaveValue('SEO Title');
      expect(screen.getByPlaceholderText(/enter meta description for search engines/i)).toHaveValue('SEO Description');
    });

    it('should use default values when no initialData is provided', () => {
      renderCMSForm();

      expect(screen.getByPlaceholderText(/enter article heading/i)).toHaveValue('');
      expect(screen.getByPlaceholderText(/enter article description/i)).toHaveValue('');
      expect(screen.getByPlaceholderText(/url-friendly-slug/i)).toHaveValue('');
    });
  });

  describe('Form Validation', () => {
    it('should display validation errors for empty required fields', async () => {
      const user = userEvent.setup();
      renderCMSForm();

      const submitButton = screen.getByRole('button', { name: /save content/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/form has validation errors/i)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should not submit form when validation fails', async () => {
      const user = userEvent.setup();
      renderCMSForm();

      await user.click(screen.getByRole('button', { name: /save content/i }));

      await new Promise(resolve => setTimeout(resolve, 500));
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should validate data across all form sections', async () => {
      const user = userEvent.setup();
      
      const partialData: Partial<CMSFormData> = {
        heading: 'Test',
        description: 'Test',
        slug: 'test',
      };

      renderCMSForm({ initialData: partialData });

      await user.click(screen.getByRole('button', { name: /save content/i }));

      await waitFor(() => {
        expect(screen.getByText(/form has validation errors/i)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});