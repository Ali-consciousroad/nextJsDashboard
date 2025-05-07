import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateInvoice } from '@/app/lib/actions';
import { sql } from '@/app/lib/db';

// Mock the database
vi.mock('@/app/lib/db', () => ({
  sql: vi.fn(),
}));

// Mock Next.js functions
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Invoice Edit Functionality', () => {
  const mockInvoiceId = '123e4567-e89b-12d3-a456-426614174000';
  const mockFormData = new FormData();
  
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Setup mock form data
    mockFormData.set('customerId', 'customer-123');
    mockFormData.set('amount', '100.50');
    mockFormData.set('status', 'paid');
  });

  it('should successfully update an invoice', async () => {
    // Mock successful database update
    (sql as any).mockResolvedValueOnce([{ id: mockInvoiceId }]);

    // Call the update function
    await updateInvoice(mockInvoiceId, mockFormData);

    // Verify database was called with correct parameters
    expect(sql).toHaveBeenCalledWith(expect.stringContaining('UPDATE invoices'));
    expect(sql).toHaveBeenCalledWith(
      expect.stringContaining('SET customer_id = $1, amount = $2, status = $3')
    );
  });

  it('should handle non-existent invoice', async () => {
    // Mock empty result
    (sql as any).mockResolvedValueOnce([]);

    const result = await updateInvoice(mockInvoiceId, mockFormData);

    // Verify error response
    expect(result).toHaveProperty('message', 'Invoice not found.');
  });

  it('should handle validation errors', async () => {
    // Setup invalid form data
    const invalidFormData = new FormData();
    invalidFormData.set('customerId', ''); // Empty customer ID
    invalidFormData.set('amount', '-100'); // Negative amount
    invalidFormData.set('status', 'invalid'); // Invalid status

    const result = await updateInvoice(mockInvoiceId, invalidFormData);

    // Verify validation error response
    expect(result).toHaveProperty('errors');
    expect(result).toHaveProperty('message', 'Missing Fields. Failed to Update Invoice.');
  });

  it('should handle database errors', async () => {
    // Mock database error
    (sql as any).mockRejectedValueOnce(new Error('Database connection failed'));

    const result = await updateInvoice(mockInvoiceId, mockFormData);

    // Verify error handling
    expect(result).toHaveProperty('message', 'Database Error: Failed to Update Invoice.');
  });

  it('should convert amount to cents before saving', async () => {
    // Mock successful database update
    (sql as any).mockResolvedValueOnce([{ id: mockInvoiceId }]);

    // Call with amount in dollars
    await updateInvoice(mockInvoiceId, mockFormData);

    // Verify amount was converted to cents
    expect(sql).toHaveBeenCalledWith(
      expect.stringContaining('amount = $2'),
      expect.anything(),
      expect.any(Number),
      expect.anything()
    );
  });
}); 