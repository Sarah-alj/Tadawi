import mongoose, { Schema } from 'mongoose';
import HttpError from '../lib/http-error.js';
import { UserModel } from './user.model.js';
const matchSchema = new Schema(
  {
    user1: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user2: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'chat-only'],
      default: 'pending',
      required: true,
    },
    rejectReason: {
      type: String,
    },
  },
  {
    timestamps: true,

    //* STATIC METHODS START
    statics: {
      //* Create a match
      async createMatch(data) {
        console.log('Creating match with data:', data);
        const existingMatch = await this.findOne({
          $or: [
            { user1: data.user1, user2: data.user2 },
            { user1: data.user2, user2: data.user1 },
          ],
        });

        if (!existingMatch) {
          return await this.create({
            user1: data.user1,
            user2: data.user2,
            status: data.status,
          });
        }

        if (existingMatch.status === 'chat-only') {
          return this.findOneAndUpdate(
            { _id: existingMatch._id },
            { user1: data.user1, user2: data.user2, status: data.status }
          );
        }

        throw new HttpError({
          message: 'Match already exists',
          statusCode: 400,
          name: 'BadRequestError',
        });
      },

      //* Accept a match
      async acceptMatch(data) {
        const match = await this.findById(data.matchId);

        if (!match) {
          throw new HttpError({
            message: 'Match not found',
            statusCode: 404,
            name: 'NotFoundError',
          });
        }

        if (match.user1.toString() === data.userId) {
          throw new HttpError({
            message: "This request is sent by you. You can't accept it. Only the other user can accept it.",
            statusCode: 403,
            name: 'UnauthorizedError',
          });
        }

        if (match.user2.toString() !== data.userId) {
          throw new HttpError({
            message: 'You are not authorized to access this resource',
            statusCode: 403,
            name: 'UnauthorizedError',
          });
        }

        match.status = 'accepted';
        await match.save();
        return match;
      },

      //* Deny a match
      async denyMatch(data) {
        const match = await this.findById(data.matchId);

        console.log('Match found:', match);

        if (!match) {
          throw new HttpError({
            message: 'Match not found',
            statusCode: 404,
            name: 'NotFoundError',
          });
        }

        if (match.user1.toString() === data.userId) {
          throw new HttpError({
            message: "This request is sent by you. You can't reject it. Only the other user can reject it.",
            statusCode: 403,
            name: 'UnauthorizedError',
          });
        }

        if (match.user2.toString() !== data.userId) {
          throw new HttpError({
            message: 'You are not authorized to access this resource',
            statusCode: 403,
            name: 'UnauthorizedError',
          });
        }

        match.status = 'rejected';
        match.rejectReason = data.rejectReason;
        await match.save();
        return match;
      },

      //* Get Contacts For Chat
      async getContactsForChat(userId) {
        const myMatches = await MatchModel.find({
          $or: [{ user1: userId }, { user2: userId }],
          status: { $in: ['accepted', 'chat-only'] },
        });

        const myMatchedUserIdsToMatchIdsMap = new Map();

        myMatches.forEach((match) => {
          if (match.user1.toString() === userId) {
            myMatchedUserIdsToMatchIdsMap.set(match.user2.toString(), { matchId: match.id, status: match.status });
          } else {
            myMatchedUserIdsToMatchIdsMap.set(match.user1.toString(), { matchId: match.id, status: match.status });
          }
        });

        const myMatchedUserIds = Array.from(myMatchedUserIdsToMatchIdsMap.keys());
        const users = await UserModel.find({
          _id: { $in: myMatchedUserIds },
        });

        const contacts = users.map((user) => ({
          userId: user.id,
          name: user.name,
          matchId: myMatchedUserIdsToMatchIdsMap.get(user.id).matchId,
          status: myMatchedUserIdsToMatchIdsMap.get(user.id).status,
        }));

        return contacts;
      },
    },
    //* STATIC METHODS END
  }
);
export const MatchModel = mongoose.model('Match', matchSchema);
