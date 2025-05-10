// This must be at the top
import { jest } from '@jest/globals';

// Mock modules before importing the module under test
const mockCheckAuth = jest.fn();
const mockFind = jest.fn(() => ({
  populate: jest.fn(),
}));

// Mock LabModel and checkAuth using unstable_mockModule
jest.unstable_mockModule('../../../models/lab.model.js', () => ({
  LabModel: {
    find: mockFind,
  },
}));

jest.unstable_mockModule('../../../lib/check-auth.js', () => ({
  checkAuth: mockCheckAuth,
}));

// Now import the module under test AFTER mocking
const { getAllLabs } = await import('../../../controllers/lab/get-all-labs.js');
const { ApiSuccessResponse } = await import('../../../lib/api-response.js');
const { default: HttpError } = await import('../../../lib/http-error.js');

describe('getAllLabs (ESM)', () => {
  const mockRequest = {};

  afterEach(() => {
    mockCheckAuth.mockReset();
    mockFind.mockReset();
  });

  it('returns labs for doctor', async () => {
    const userId = 'doctor123';
    const fakeLabs = [{ _id: '1', patient: { name: 'Test' } }];
    mockCheckAuth.mockResolvedValue({ userType: 'doctor', _id: userId });
    const mockPopulate = jest.fn().mockResolvedValue(fakeLabs);
    mockFind.mockReturnValue({ populate: mockPopulate });

    const res = await getAllLabs(mockRequest);

    expect(mockCheckAuth).toHaveBeenCalled();
    expect(mockFind).toHaveBeenCalledWith({ doctor: userId });
    expect(res).toBeInstanceOf(ApiSuccessResponse);
    expect(res.data).toEqual(fakeLabs);
  });

  it('throws 403 for patient', async () => {
    mockCheckAuth.mockResolvedValue({ userType: 'patient', _id: 'p1' });

    await expect(getAllLabs(mockRequest)).rejects.toThrow(HttpError);
    await expect(getAllLabs(mockRequest)).rejects.toMatchObject({
      statusCode: 403,
      message: 'Unauthorized access',
      name: 'ForbiddenError',
    });
  });
});
