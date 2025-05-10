import { jest } from '@jest/globals';
import { ApiSuccessResponse } from '../../../lib/api-response.js';
import { ZodError } from 'zod';
import HttpError from '../../../lib/http-error.js';

// Mocks
const mockFindById = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockCheckAuth = jest.fn();
const mockCreateNotification = jest.fn();

jest.unstable_mockModule('../../../models/donation.model.js', () => ({
  DonationModel: {
    findById: mockFindById,
    findByIdAndUpdate: mockFindByIdAndUpdate,
  },
}));

jest.unstable_mockModule('../../../lib/check-auth.js', () => ({
  checkAuth: mockCheckAuth,
}));

jest.unstable_mockModule('../../../lib/create-notification.js', () => ({
  createNotification: mockCreateNotification,
}));

const { updateDonationController } = await import('../../../controllers/donation/update-donation-controller.js');

describe('updateDonationController', () => {
  const donationId = 'donation123';
  const userId = 'user456';

  const validPayload = {
    equipmentType: 'Walker',
    equipmentName: 'Walker 2000',
    equipmentDescription: 'Helps people walk',
    yearsOfUse: 2,
    warrantyDetails: 'Covered for 1 year',
    defects: 'None',
    pointOfContact: 'John Doe',
    details: 'Used sparingly indoors',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckAuth.mockResolvedValue({ _id: userId });
    mockFindById.mockResolvedValue({ _id: donationId, userId });
    mockFindByIdAndUpdate.mockResolvedValue();
  });

  it('successfully updates a donation', async () => {
    const request = {
      params: { donationId },
      body: validPayload,
    };

    const result = await updateDonationController(request);

    expect(mockCheckAuth).toHaveBeenCalled();
    expect(mockFindById).toHaveBeenCalledWith(donationId);
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(donationId, validPayload);
    expect(mockCreateNotification).toHaveBeenCalledWith({
      receiverId: userId,
      senderId: userId,
      eventType: 'donation-updated',
      relatedId: donationId,
    });
    expect(result).toBeInstanceOf(ApiSuccessResponse);
    expect(result.message).toBe('Donation updated successfully');
    expect(result.statusCode).toBe(200);
    expect(result.data).toBe(null);
  });

  it('throws 404 if donation not found', async () => {
    mockFindById.mockResolvedValue(null);
    const request = {
      params: { donationId },
      body: validPayload,
    };

    await expect(updateDonationController(request)).rejects.toThrow(HttpError);
  });

  it('throws 403 if user is not owner of the donation', async () => {
    mockFindById.mockResolvedValue({ _id: donationId, userId: 'someone-else' });

    const request = {
      params: { donationId },
      body: validPayload,
    };

    await expect(updateDonationController(request)).rejects.toThrow(HttpError);
  });

  it('fails validation if required field is missing', async () => {
    const invalidBody = { ...validPayload, equipmentType: '' };

    const request = {
      params: { donationId },
      body: invalidBody,
    };

    await expect(updateDonationController(request)).rejects.toThrow(ZodError);
  });

  it('fails if yearsOfUse is not positive', async () => {
    const request = {
      params: { donationId },
      body: { ...validPayload, yearsOfUse: 0 },
    };

    await expect(updateDonationController(request)).rejects.toThrow(ZodError);
  });
});
