import { jest } from '@jest/globals';
import mongoose from 'mongoose';

// Mocks
const mockCheckAuth = jest.fn();
const mockFindOne = jest.fn();
const mockSave = jest.fn();
const mockCreateNotification = jest.fn();

jest.unstable_mockModule('../../../models/user.model.js', () => ({
  UserModel: { findOne: mockFindOne },
}));

jest.unstable_mockModule('../../../models/lab.model.js', () => ({
  LabModel: function (data) {
    return {
      ...data,
      save: mockSave,
      _id: new mongoose.Types.ObjectId(),
    };
  },
}));

jest.unstable_mockModule('../../../lib/check-auth.js', () => ({
  checkAuth: mockCheckAuth,
}));

jest.unstable_mockModule('../../../lib/create-notification.js', () => ({
  createNotification: mockCreateNotification,
}));

const { createLabAppointment } = await import('../../../controllers/lab/create-lab-appointment.js');
const { default: HttpError } = await import('../../../lib/http-error.js');
const { ApiSuccessResponse } = await import('../../../lib/api-response.js');

describe('createLabAppointment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const validBody = {
    labName: 'Medicare Labs',
    testType: 'Blood Test',
    appointmentDateTime: new Date().toISOString(),
    patientId: new mongoose.Types.ObjectId().toString(),
  };

  const mockRequest = {
    body: validBody,
  };

  const mockDoctor = {
    _id: new mongoose.Types.ObjectId(),
    userType: 'doctor',
  };

  it('creates an appointment and sends notification', async () => {
    mockCheckAuth.mockResolvedValue(mockDoctor);
    mockFindOne.mockResolvedValue({ _id: validBody.patientId });

    const res = await createLabAppointment(mockRequest);

    expect(mockCheckAuth).toHaveBeenCalled();
    expect(mockFindOne).toHaveBeenCalledWith({ _id: validBody.patientId });
    expect(mockSave).toHaveBeenCalled();
    expect(mockCreateNotification).toHaveBeenCalledWith({
      receiverId: validBody.patientId,
      senderId: mockDoctor._id.toString(),
      eventType: 'lab-appointment',
      relatedId: expect.any(String),
    });
    expect(res).toBeInstanceOf(ApiSuccessResponse);
    expect(res.statusCode).toBe(201);
  });

  it('throws 404 if patient not found', async () => {
    mockCheckAuth.mockResolvedValue(mockDoctor);
    mockFindOne.mockResolvedValue(null);

    await expect(createLabAppointment(mockRequest)).rejects.toThrow(HttpError);
    await expect(createLabAppointment(mockRequest)).rejects.toMatchObject({
      statusCode: 404,
      name: 'NotFoundError',
    });
  });

  it('throws Zod error if body is invalid', async () => {
    const invalidRequest = {
      body: {
        ...validBody,
        appointmentDateTime: 'invalid-date',
      },
    };

    mockCheckAuth.mockResolvedValue(mockDoctor);

    await expect(createLabAppointment(invalidRequest)).rejects.toThrow(/Invalid date format/);
  });
});
