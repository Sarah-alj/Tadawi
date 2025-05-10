import { z } from 'zod';
import { LabModel } from '../../models/lab.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import { createNotification } from '../../lib/create-notification.js';
import { DoctorModel } from '../../models/doctor.model.js';
import HttpError from '../../lib/http-error.js';

const requestSchema = z.object({
  patientId: z.string(),
  testType: z.string(),
  labName: z.string(),
  appointmentDateTime: z.string(),
});

/**
 * Create a lab appointment
 * @type {import('../../types.js').RequestController}
 */
export async function createLabAppointment(request) {
  const authUser = await checkAuth(request, 'doctor');

  const requestBody = requestSchema.parse(request.body);

  const doctorProfile = await DoctorModel.findOne({
    user: authUser._id,
  });

  if (!doctorProfile) {
    throw new HttpError({
      message: 'Doctor profile not found',
      statusCode: 404,
      name: 'NotFoundError',
    });
  }

  const labAppointment = await doctorProfile.bookLab(requestBody);

  createNotification({
    receiverId: requestBody.patientId,
    senderId: authUser._id.toString(),
    eventType: 'lab-appointment',
    relatedId: labAppointment._id.toString(),
  });

  return new ApiSuccessResponse({
    data: labAppointment,
  });
}
