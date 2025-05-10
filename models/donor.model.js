import mongoose, { Schema } from 'mongoose';
import { DonationModel } from './donation.model.js';
import HttpError from '../lib/http-error.js';

const DonorAcquirerSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['donor', 'acquirer', 'both'], required: true },
  },
  {
    timestamps: true,

    //* INSTANCE METHODS
    methods: {
      //* This method is used to create a donation
      async createDonation(data) {
        return DonationModel.create(data);
      },

      //* This method is used to get all my donations
      async viewMyDonations() {
        return DonationModel.find({ userId: this.user._id });
      },

      //* This method is used to get a single donation
      async viewSingleDonation(donationId) {
        const donation = await DonationModel.findOne({ _id: donationId });

        if (!donation) {
          throw new HttpError({
            name: 'NotFound',
            message: 'Donation not found',
            statusCode: 404,
          });
        }

        return donation;
      },

      //* This method is used to delete a donation
      async deleteDonation(donationId) {
        const donation = await DonationModel.findOne({ _id: donationId });

        if (!donation) {
          throw new HttpError({
            name: 'NotFound',
            message: 'Donation not found',
            statusCode: 404,
          });
        }

        if (donation.userId.toString() !== this.user._id.toString()) {
          throw new HttpError({
            name: 'Forbidden',
            message: 'You are not allowed to delete this donation',
            statusCode: 403,
          });
        }

        await DonationModel.deleteOne({ _id: donationId });
        return donation;
      },

      //* This method is used to edit a donation
      async editDonation(donationId, data) {
        const donation = await DonationModel.findById(donationId);

        if (!donation) {
          throw new HttpError({
            name: 'NotFound',
            message: 'Donation not found',
            statusCode: 404,
          });
        }

        if (donation.userId.toString() !== this.user._id.toString()) {
          throw new HttpError({
            name: 'Forbidden',
            message: 'You are not allowed to edit this donation',
            statusCode: 403,
          });
        }

        await DonationModel.findByIdAndUpdate(donationId, data);

        return donation;
      },

      //* This method is used to acquire a donation
      async acquireDonation(donationId) {
        const donation = await DonationModel.findById(donationId);

        if (!donation) {
          throw new HttpError({
            name: 'NotFound',
            message: 'Donation not found',
            statusCode: 404,
          });
        }

        await DonationModel.updateOne({ _id: donationId }, { $set: { isTaken: true } });

        return donation;
      },
    },
  }
);

export const DonorAcquirerModel = mongoose.model('DonorAcquirer', DonorAcquirerSchema);
