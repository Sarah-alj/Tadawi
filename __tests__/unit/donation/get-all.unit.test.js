import { jest } from '@jest/globals';
import { ApiSuccessResponse } from '../../../lib/api-response.js';

const mockFind = jest.fn();
const mockCheckAuth = jest.fn();

// Mock DonationModel
jest.unstable_mockModule('../../../models/donation.model.js', () => ({
  DonationModel: {
    find: mockFind,
  },
}));

// Mock checkAuth
jest.unstable_mockModule('../../../lib/check-auth.js', () => ({
  checkAuth: mockCheckAuth,
}));

// Import controller after mocks
const { getAllDonationsController } = await import('../../../controllers/donation/get-all-donation-controller.js');

describe('getAllDonationsController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckAuth.mockResolvedValue({ _id: 'user123' });
  });

  it('fetches all donations when type=all and is-taken=all', async () => {
    const fakeDonations = [{ id: 1 }, { id: 2 }];
    mockFind.mockResolvedValue(fakeDonations);

    const req = {
      query: { type: 'all', 'is-taken': 'all' },
    };

    const result = await getAllDonationsController(req);

    expect(mockFind).toHaveBeenCalledWith({});
    expect(result).toBeInstanceOf(ApiSuccessResponse);
    expect(result.data).toEqual(fakeDonations);
  });

  it('fetches donations by the current user', async () => {
    const fakeDonations = [{ id: 3 }];
    mockFind.mockResolvedValue(fakeDonations);

    const req = {
      query: { type: 'by-me', 'is-taken': 'all' },
    };

    const result = await getAllDonationsController(req);

    expect(mockFind).toHaveBeenCalledWith({ userId: 'user123' });
    expect(result.data).toEqual(fakeDonations);
  });

  it('fetches donations not by the current user and not taken', async () => {
    const fakeDonations = [{ id: 4 }];
    mockFind.mockResolvedValue(fakeDonations);

    const req = {
      query: { type: 'not-by-me', 'is-taken': 'false' },
    };

    const result = await getAllDonationsController(req);

    expect(mockFind).toHaveBeenCalledWith({
      userId: { $ne: 'user123' },
      isTaken: false,
    });
    expect(result.data).toEqual(fakeDonations);
  });

  it('throws validation error on invalid query', async () => {
    const req = {
      query: { type: 'invalid', 'is-taken': 'false' },
    };

    await expect(getAllDonationsController(req)).rejects.toThrow(/Invalid enum value/);
  });
});
