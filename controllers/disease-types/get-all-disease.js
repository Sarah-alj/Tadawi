import { DiseaseTypeModel } from '../../models/disease-type.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';

/**
 * Get all diseases
 * @type {import('../../types.js').RequestController}
 */
export async function getAllDiseases(request) {
  const diseases = await DiseaseTypeModel.aggregate([
    {
      $sort: {
        name: 1,
      },
    },
    {
      $group: {
        _id: '$type',
        diseases: {
          $push: {
            id: '$_id',
            name: '$name',
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        type: '$_id',
        diseases: {
          $sortArray: {
            input: '$diseases',
            sortBy: { name: 1 },
          },
        },
      },
    },
  ]);

  return new ApiSuccessResponse({
    statusCode: 200,
    data: diseases,
    message: 'Disease types fetched successfully',
  });
}
