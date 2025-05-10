import { jest } from '@jest/globals';
import { ApiSuccessResponse } from '../../../lib/api-response.js';
import { ZodError } from 'zod';

// Mocks
const mockSave = jest.fn();
const mockCheckAuth = jest.fn();

// Mock DonationModel
jest.unstable_mockModule('../../../models/donation.model.js', () => ({
  DonationModel: function (data) {
    return {
      ...data,
      save: mockSave,
    };
  },
}));

// Mock checkAuth
jest.unstable_mockModule('../../../lib/check-auth.js', () => ({
  checkAuth: mockCheckAuth,
}));

// Import after mocking
const { createDonationController } = await import('../../../controllers/donation/create-donation-controller.js');

describe('createDonationController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckAuth.mockResolvedValue({ _id: 'user123' });
    mockSave.mockResolvedValue(); // resolves to undefined after .save()
  });

  const basePayload = {
    equipmentType: 'Wheelchair',
    equipmentName: 'UltraLite 3000',
    equipmentDescription: 'Lightweight and durable',
    yearsOfUse: 2,
    warrantyDetails: 'Valid until 2026',
    defects: 'Minor scratches',
    pointOfContact: 'John Doe, +123456789',
    details: 'Can be folded and stored easily.',
  };

  it('creates a donation with valid input', async () => {
    const req = { body: basePayload };

    const result = await createDonationController(req);

    expect(mockCheckAuth).toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalled();
    expect(result).toBeInstanceOf(ApiSuccessResponse);
    expect(result.message).toBe('Donation created successfully');
    expect(result.statusCode).toBe(201);
    expect(result.data.equipmentName).toBe('UltraLite 3000');
    expect(result.data.userId).toBe('user123');
  });

  it('fails with missing required field', async () => {
    const req = {
      body: {
        ...basePayload,
        equipmentName: '', // required field is empty
      },
    };

    await expect(createDonationController(req)).rejects.toThrow(ZodError);
  });

  it('fails if yearsOfUse is not a positive number', async () => {
    const req = {
      body: {
        ...basePayload,
        yearsOfUse: -3,
      },
    };

    await expect(createDonationController(req)).rejects.toThrow(ZodError);
  });

  it('handles optional fields gracefully', async () => {
    const req = {
      body: {
        ...basePayload,
        warrantyDetails: undefined,
        defects: undefined,
      },
    };

    const result = await createDonationController(req);

    expect(result).toBeInstanceOf(ApiSuccessResponse);
    expect(result.data.userId).toBe('user123');
  });
});
