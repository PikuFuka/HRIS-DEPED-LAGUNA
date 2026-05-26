import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Vacancies from './Vacancies';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import type { User } from '../lib/auth';

// Mock dependencies
vi.mock('../lib/auth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }
}));

const mockVacancies = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    status: 'Published',
    deadline: '2024-12-31',
    itemNo: 'OSEC-123',
    type: 'plantilla',
    bureauService: 'Tech Bureau',
    divisionUnit: 'Software Div'
  },
  {
    id: 2,
    title: 'Junior Consultant',
    status: 'Draft',
    deadline: '2023-11-30',
    itemNo: 'N/A',
    type: 'non-plantilla',
    employmentStatus: 'Contract of Services',
    contractDuration: '6 Months'
  }
];

describe('Vacancies Integration', () => {
  let mockFetch: any;

  const mockUserBase = {
    id: 1,
    username: 'test',
    name: 'Test Applicant',
    role: 'applicant' as any
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock global fetch
    mockFetch = vi.fn().mockImplementation((url, options) => {
      if (url === '/api/vacancies' && !options) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockVacancies),
        });
      }
      
      if (url === '/api/vacancies' && options?.method === 'POST') {
        const newVacancy = JSON.parse(options.body);
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 3, ...newVacancy }),
        });
      }
      
      if (url.match(/^\/api\/vacancies\/\d+$/) && options?.method === 'PUT') {
        const updateData = JSON.parse(options.body);
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: parseInt(url.split('/').pop()), ...updateData }),
        });
      }
      
      if (url.match(/^\/api\/vacancies\/\d+\/status$/) && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      }
      return Promise.reject(new Error(`Unhandled request: ${url}`));
    });

    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function renderComponent(userConfig: Partial<User> = {}) {
    vi.mocked(useAuth).mockReturnValue({
      user: { ...mockUserBase, ...userConfig },
      loading: false,
    } as any);

    return render(
      <MemoryRouter>
        <Vacancies />
      </MemoryRouter>
    );
  }

  // 1. Initial UI Render & Access Control
  it('renders restricted access for unauthorized roles', async () => {
    renderComponent({ role: 'records' as any });
    
    expect(screen.getByText('Access Restricted')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  it('renders vacancies page for authorized role (hrmo)', async () => {
    renderComponent({ role: 'hrmo' as any });
    
    expect(screen.getByText('Plantilla Vacancies')).toBeInTheDocument();
    
    // Wait for the fetch hook to complete
    await waitFor(() => {
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    });
    expect(screen.getByText('OSEC-123')).toBeInTheDocument();
  });

  // 2. User Interactions: Filtering & Search
  it('filters vacancies by search term', async () => {
    const userEventObj = userEvent.setup();
    renderComponent({ role: 'applicant' as any });
    
    await waitFor(() => {
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by position/i);
    await userEventObj.type(searchInput, 'Consultant');

    expect(screen.queryByText('Senior Software Engineer')).not.toBeInTheDocument();
    expect(screen.getByText('Junior Consultant')).toBeInTheDocument();
  });

  // 3. User Interactions: Creation (Modal & Form Submission)
  it('opens create modal, fills form, and submits new vacancy', async () => {
    const userEventObj = userEvent.setup();
    renderComponent({ role: 'hrmo' as any });
    
    // Open modal
    const postBtn = screen.getByText(/Post New Vacancy/i);
    await userEventObj.click(postBtn);
    
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    
    // Fill out form
    const titleInput = screen.getByPlaceholderText(/e\.g\. Administrative Assistant III/i);
    await userEventObj.type(titleInput, 'New Web Developer');
    
    const submissionBtn = screen.getByRole('button', { name: /Confirm & Create Posting/i });
    expect(submissionBtn).toBeEnabled();
    
    await userEventObj.click(submissionBtn);
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/vacancies', expect.objectContaining({
        method: 'POST',
      }));
    });
    
    // Based on how the state updates in Vacancies.tsx, it pushes to the array and renders it locally.
    await waitFor(() => {
      expect(screen.getByText('New Web Developer')).toBeInTheDocument();
    });
  });

  // 4. Checking interactions specific to Applicant
  it('applicant cannot see "Post New Vacancy" or Edit buttons', async () => {
    renderComponent({ role: 'applicant' as any });
    await waitFor(() => {
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    });

    expect(screen.queryByText(/Post New Vacancy/i)).not.toBeInTheDocument();
    // Edit buttons have title="Edit", these shouldn't be rendered for applicants.
    expect(screen.queryByTitle('Edit')).not.toBeInTheDocument();
  });

  // 5. Viewing details modal
  it('opens details modal when clicking on a vacancy', async () => {
    const userEventObj = userEvent.setup();
    renderComponent({ role: 'applicant' as any });
    
    await waitFor(() => {
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    });
    
    const vacancyCard = screen.getByText('Senior Software Engineer').closest('div.bg-white.border-slate-200');
    expect(vacancyCard).not.toBeNull();
    await userEventObj.click(vacancyCard!);
    
    // Inside modal
    await waitFor(() => {
      expect(screen.getByText('System Reference: OSEC-123')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /SUBMIT APPLICATION/i })).toBeInTheDocument();
  });
});
