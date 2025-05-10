import mongoose, { Schema } from 'mongoose';
import { PatientModel } from './patient.model.js';
import { PatientMedicalHistoryModel } from './medicalHistory.model.js';
import { DoctorModel } from './doctor.model.js';
import { TrialModel } from './trial.model.js';
import { DonorAcquirerModel } from './donor.model.js';
import HttpError from '../lib/http-error.js';
import bcrypt from 'bcrypt';
import { generateOTP } from '../lib/utils.js';
import { NotificationModel } from './notification.model.js';
import { MessageModel } from './message.model.js';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'] },
    region: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    phoneNumber: { type: String, required: true },
    title: { type: String, required: true },
    nationality: { type: String, required: true },
    otp: { type: String },
    resetPasswordOtp: { type: String },
    userType: {
      type: String,
      enum: ['patient', 'doctor', 'donorAcquirer'],
      required: true,
    },
  },
  {
    timestamps: true,

    //* STATIC METHODS START HERE
    statics: {
      //* This method is used to create a new patient user
      async createPatientUser(data) {
        const { userDetails, patientDetails, medicalHistory } = data;
        const session = await mongoose.startSession();

        try {
          session.startTransaction();
          const user = await new this({
            ...userDetails,
            userType: 'patient',
          }).save({ session });

          const patient = await new PatientModel({
            ...patientDetails,
            user: user._id,
          }).save({ session });

          await new PatientMedicalHistoryModel({
            ...medicalHistory,
            patient: patient._id,
          }).save({ session });

          await session.commitTransaction();

          return user;
        } catch (error) {
          await session.abortTransaction();
          throw error;
        } finally {
          await session.endSession();
        }
      },

      //* This method is used to create a new doctor user
      async createDoctorUser(data) {
        const session = await mongoose.startSession();

        try {
          session.startTransaction();
          const user = await new this({
            ...data.userDetails,
            userType: 'doctor',
          }).save({ session });

          const doctor = await new DoctorModel({
            ...data.doctorDetails,
            user: user._id,
          }).save({ session });

          await new TrialModel({
            ...data.trialDetails,
            conductedBy: doctor._id,
          }).save({ session });

          await session.commitTransaction();

          return user;
        } catch (error) {
          await session.abortTransaction();
          throw error;
        } finally {
          await session.endSession();
        }
      },

      //* This method is used to create a new donor acquirer user
      async createDonorAcquirerUser(data) {
        const session = await mongoose.startSession();

        try {
          session.startTransaction();
          const user = await new this({
            ...data.userDetails,
            userType: 'donorAcquirer',
          }).save({ session });

          await new DonorAcquirerModel({
            ...data.donorAcquirerDetails,
            user: user._id,
          }).save({ session });

          await session.commitTransaction();

          return user;
        } catch (error) {
          await session.abortTransaction();
          throw error;
        } finally {
          await session.endSession();
        }
      },

      //* This method is used to update patient user
      async updatePatientUser(userId, data) {
        const session = await mongoose.startSession();

        try {
          session.startTransaction();
          await UserModel.findOneAndUpdate({ _id: userId }, { ...data.userDetails }, { session });

          const patient = await PatientModel.findOneAndUpdate(
            { user: userId },
            { ...data.patientDetails },
            { session }
          );

          if (!patient) {
            throw new HttpError({
              message: 'Patient not found',
              statusCode: 404,
              name: 'NotFoundError',
            });
          }

          await PatientMedicalHistoryModel.findOneAndUpdate(
            { patient: patient._id },
            { ...data.medicalHistory },
            { new: true, session }
          );

          await session.commitTransaction();
        } catch (error) {
          await session.abortTransaction();
          throw error;
        } finally {
          await session.endSession();
        }
      },

      //* This method is used to update doctor user
      async updateDoctorUser(userId, data) {
        const session = await mongoose.startSession();

        try {
          session.startTransaction();

          await UserModel.findOneAndUpdate({ _id: userId }, { ...data.userDetails }, { session });

          const doctor = await DoctorModel.findOneAndUpdate({ user: userId }, { ...data.doctorDetails }, { session });

          if (!doctor) {
            throw new HttpError({
              message: 'Doctor not found',
              statusCode: 404,
              name: 'NotFoundError',
            });
          }

          await TrialModel.updateMany({ conductedBy: doctor._id }, { ...data.trialDetails }, { session });

          await session.commitTransaction();
        } catch (error) {
          await session.abortTransaction();
          throw error;
        } finally {
          await session.endSession();
        }
      },

      //* This method is used to update donor acquirer user
      async updateDonorAcquirerUser(userId, data) {
        const session = await mongoose.startSession();

        try {
          session.startTransaction();

          await UserModel.findOneAndUpdate({ _id: userId }, { ...data.userDetails }, { session });

          const donorAcquirer = await DonorAcquirerModel.findOneAndUpdate(
            { user: userId },
            { ...data.donorAcquirerDetails },
            { session }
          );

          await session.commitTransaction();
        } catch (error) {
          await session.abortTransaction();
          throw error;
        } finally {
          await session.endSession();
        }
      },

      //* This method is used to login a user
      async loginUser(email, password, userType) {
        const existingUser = await this.findOne({
          email: email,
          userType: userType,
        });

        if (!existingUser) {
          throw new HttpError({
            message: 'Invalid email or password',
            statusCode: 401,
            name: 'UnauthorizedError',
          });
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (!passwordMatch) {
          throw new HttpError({
            message: 'Invalid email or password',
            statusCode: 401,
            name: 'UnauthorizedError',
          });
        }

        const otp = generateOTP();

        await this.updateOne({ _id: existingUser._id }, { otp, resetPasswordOtp: null });

        return {
          otp: otp,
          name: existingUser.name,
          email: existingUser.email,
        };
      },

      //* This method is used to verify the OTP after login
      async verifyOtp(email, otp, userType) {
        const existingUser = await this.findOne({
          email: email,
          userType: userType,
        });

        if (!existingUser) {
          throw new HttpError({
            message: 'Invalid email or otp',
            statusCode: 401,
            name: 'UnauthorizedError',
          });
        }

        if (existingUser.otp !== otp) {
          throw new HttpError({
            message: 'Invalid email or otp',
            statusCode: 401,
            name: 'UnauthorizedError',
          });
        }

        await this.updateOne({ _id: existingUser._id }, { otp: null, resetPasswordOtp: null });

        return existingUser;
      },

      async requestResetPassword(email) {
        const existingUser = await this.findOne({
          email: email,
        });

        if (!existingUser) {
          throw new HttpError({
            message: 'No user found with this email',
            statusCode: 404,
            name: 'UnauthorizedError',
          });
        }

        const resetPasswordOtp = generateOTP();

        await this.updateOne({ _id: existingUser._id }, { resetPasswordOtp });

        return {
          resetPasswordOtp: resetPasswordOtp,
          name: existingUser.name,
          email: existingUser.email,
        };
      },

      //* This method is used to reset the password
      async resetPassword(data) {
        const { email, otp, newPassword } = data;

        const existingUser = await this.findOne({
          email: email,
        });

        if (!existingUser) {
          throw new HttpError({
            message: 'No user found with this email',
            statusCode: 404,
            name: 'UnauthorizedError',
          });
        }

        if (existingUser.resetPasswordOtp !== otp) {
          throw new HttpError({
            message: 'The OTP is invalid',
            statusCode: 403,
            name: 'ForbiddenError',
          });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.updateOne({ _id: existingUser._id }, { password: hashedPassword, resetPasswordOtp: null });

        return existingUser;
      },
    },
    //* STATIC METHODS END HERE

    //* INSTANCE METHODS START HERE
    methods: {
      //* This method is used to get all notifications for a user
      async getAllNotifications() {
        const notifications = await NotificationModel.find({
          user: this._id,
        }).sort({ createdAt: -1 });

        return notifications;
      },

      //* This method deletes all notifications for a user
      async deleteAllNotifications() {
        await NotificationModel.deleteMany({
          user: this._id,
        });
      },

      //* This method sends a message to a different user
      async sendMessage(payload) {
        const message = await MessageModel.create({
          sender: this._id,
          recipient: payload.recipient,
          matchId: payload.matchId,
          type: payload.type,

          content: payload.content,
          document: payload.document,
        });

        return message;
      },

      //* This method is used to get current user's profile
      async getMyProfile() {
        const userId = this._id;

        const userType = this.userType;

        if (userType === 'doctor') {
          const doctorProfile = await DoctorModel.findOne({
            user: userId,
          });

          if (!doctorProfile) {
            throw new HttpError({
              message: 'Doctor profile not found',
              statusCode: 404,
              name: 'NotFound',
            });
          }

          const doctorTrials = await TrialModel.findOne({
            conductedBy: doctorProfile._id,
          });

          if (!doctorTrials) {
            throw new HttpError({
              message: 'Doctor trials not found',
              statusCode: 404,
              name: 'NotFound',
            });
          }

          return {
            user: this,
            doctorProfile,
            doctorTrials,
          };
        }

        if (userType === 'patient') {
          const patientProfile = await PatientModel.findOne({
            user: userId,
          });

          if (!patientProfile) {
            throw new HttpError({
              message: 'Patient profile not found',
              statusCode: 404,
              name: 'NotFound',
            });
          }

          const medicalHistory = await PatientMedicalHistoryModel.findOne({
            patient: patientProfile._id,
          });

          if (!medicalHistory) {
            throw new HttpError({
              message: 'Medical history not found',
              statusCode: 404,
              name: 'NotFound',
            });
          }

          return {
            user: this,
            patientProfile,
            medicalHistory,
          };
        }

        if (userType === 'donorAcquirer') {
          const donorAcquirerProfile = await DonorAcquirerModel.findOne({
            user: userId,
          });

          if (!donorAcquirerProfile) {
            throw new HttpError({
              message: 'Donor/Acquirer profile not found',
              statusCode: 404,
              name: 'NotFound',
            });
          }

          return {
            user: this,
            donorAcquirerProfile,
          };
        }
      },
    },
  }
);

export const UserModel = mongoose.model('User', UserSchema);
