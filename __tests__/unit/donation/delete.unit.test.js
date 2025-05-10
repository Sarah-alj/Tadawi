// __tests__/unit/deleteDonation.unit.test.js

import { jest } from '@jest/globals';
import { ApiSuccessResponse } from '../../../lib/api-response.js';
import HttpError from '../../../lib/http-error.js';

// Mocks
const mockFindOne = jest.fn();
const mockDeleteOne = jest.fn();
const mockCheckAuth = jest.fn();
const mockCreateNotification = jest.fn();

jest.unstable_mockModule('../../../models/donation.model.js', () => ({
  DonationModel: {
    findOne: mockFindOne,
    deleteOne: mockDeleteOne,
  },
}));

jest.unstable_mockModule('../../../lib/check-auth.js', () => ({
  checkAuth: mockCheckAuth,
}));

jest.unstable_mockModule('../../../lib/create-notification.js', () => ({
  createNotification: mockCreateNotification,
}));

const { deleteDonationController } = await import('../../../controllers/donation/delete-donation-controller.js');

describe('deleteDonationController', () => {
  const donationId = 'donation123';
  const userId = 'user456';

  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckAuth.mockResolvedValue({ _id: userId });
  });

  it('returns success if donation was already deleted', async () => {
    mockFindOne.mockResolvedValue(null);

    const req = { params: { donationId } };
    const res = await deleteDonationController(req);

    expect(mockFindOne).toHaveBeenCalledWith({ _id: donationId });
    expect(res).toBeInstanceOf(ApiSuccessResponse);
    expect(res.message).toBe('Donation already deleted');
    expect(res.data).toBe(null);
  });

  it('throws 403 if user is not the owner of donation', async () => {
    mockFindOne.mockResolvedValue({ _id: donationId, userId: 'otherUser' });

    const req = { params: { donationId } };

    await expect(deleteDonationController(req)).rejects.toThrow(HttpError);
  });

  it('deletes donation and sends notification if user is owner', async () => {
    mockFindOne.mockResolvedValue({ _id: donationId, userId });
    mockDeleteOne.mockResolvedValue();

    const req = { params: { donationId } };

    const res = await deleteDonationController(req);

    expect(mockDeleteOne).toHaveBeenCalledWith({ _id: donationId });
    expect(mockCreateNotification).toHaveBeenCalledWith({
      receiverId: userId,
      senderId: userId,
      eventType: 'donation-deleted',
    });
    expect(res).toBeInstanceOf(ApiSuccessResponse);
    expect(res.message).toBe('Donation deleted successfully');
    expect(res.statusCode).toBe(200);
  });
});
