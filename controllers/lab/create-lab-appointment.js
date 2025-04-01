import { z } from 'zod';
import { LabModel } from '../../models/lab.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import { createNotification } from '../../lib/create-notification.js';
import HttpError from '../../lib/http-error.js';

const requestSchema = z.object({
  appointmentDate: z.string(),
  appointmentTime: z.string(),
  patientId: z.string(),
  testType: z.string(),
  labName: z.string(),
  timezoneOffset: z.number(),
});

/**
 * Create a lab appointment
 * @type {import('../../types.js').RequestController}
 */
export async function createLabAppointment(request) {
  const authUser = await checkAuth(request, 'doctor');

  const requestBody = requestSchema.parse(request.body);

  const bookingDateTime = getBookingDateTime(
    requestBody.appointmentDate,
    requestBody.appointmentTime,
    requestBody.timezoneOffset
  );

  const labAppointment = new LabModel({
    labName: requestBody.labName,
    testType: requestBody.testType,
    bookingDateTime,
    doctor: authUser._id,
    patient: requestBody.patientId,
  });

  await labAppointment.save();

  createNotification({
    receiverId: requestBody.patientId,
    senderId: authUser._id.toString(),
    eventType: 'lab-appointment',
    relatedId: labAppointment._id.toString(),
  });

  createNotification({
    receiverId: authUser._id.toString(),
    senderId: requestBody.patientId,
    eventType: 'lab-appointment',
    relatedId: labAppointment._id.toString(),
  });

  return new ApiSuccessResponse({
    data: labAppointment,
  });
}

/**
 * Get the booking date and time
 * @param {string} appointmentDate
 * @param {string} appointmentTime
 * @param {number} timezoneOffset
 * @returns {Date}
 */
function getBookingDateTime(appointmentDate, appointmentTime, timezoneOffset) {
  const bookingDateTime = new Date(appointmentDate);
  const utcOffset = bookingDateTime.getTimezoneOffset();
  const time = appointmentTime.split(' ');
  if (!time[0] || !time[1])
    throw new HttpError({
      message: 'Invalid time format',
      statusCode: 400,
      name: 'Bad Request',
    });
  const timeParts = time[0].split(':');
  if (!timeParts[0] || !timeParts[1]) {
    throw new HttpError({
      message: 'Invalid time format',
      statusCode: 400,
      name: 'Bad Request',
    });
  }
  let hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);
  const ampm = time[1].toUpperCase();
  if (isNaN(hours) || isNaN(minutes)) {
    throw new HttpError({
      message: 'Invalid time format',
      statusCode: 400,
      name: 'Bad Request',
    });
  }
  if (ampm !== 'AM' && ampm !== 'PM') {
    throw new HttpError({
      message: 'Invalid time format',
      statusCode: 400,
      name: 'Bad Request',
    });
  }
  if (ampm === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (ampm === 'AM' && hours === 12) {
    hours = 0;
  }
  bookingDateTime.setHours(hours);
  bookingDateTime.setMinutes(minutes);
  bookingDateTime.setSeconds(0);
  bookingDateTime.setMilliseconds(0);
  const offset = utcOffset + timezoneOffset;
  bookingDateTime.setMinutes(bookingDateTime.getMinutes() + offset);
  return bookingDateTime;
}
