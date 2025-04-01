import { UserModel } from '../models/user.model.js';
import HttpError from './http-error.js';

/**
 * @typedef {"doctor" | "patient" | "donorAcquirer"} TUserType
 * @param {import('express').Request} request
 * @param {TUserType | TUserType[]} userType
 */
export async function checkAuth(request, userType) {
  const userId = request.session?.userId;
  if (!userId) {
    throw new HttpError({
      message: 'You must be logged in to access this resource',
      statusCode: 401,
      name: 'Unauthorized',
    });
  }
  const user = await UserModel.findById(userId).select('-password');
  if (!user) {
    throw new HttpError({
      message: 'You must be logged in to access this resource',
      statusCode: 401,
      name: 'Unauthorized',
    });
  }
  if (Array.isArray(userType)) {
    if (!userType.includes(user.userType)) {
      throw new HttpError({
        message: 'You do not have permission to access this resource',
        statusCode: 403,
        name: 'Unauthorized',
      });
    }
    return user;
  }
  if (user.userType !== userType) {
    throw new HttpError({
      message: 'You do not have permission to access this resource',
      statusCode: 403,
      name: 'Unauthorized',
    });
  }
  return user;
}
