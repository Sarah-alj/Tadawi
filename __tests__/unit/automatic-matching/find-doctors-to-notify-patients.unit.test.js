import { findDoctorsToNotifyAboutPatient } from '../../../controllers/signup/signup-controller';

describe('findDoctorsToNotifyAboutPatient', () => {
  const doctors = [
    { name: 'Dr. Smith', specialization: 'Cardiology' },
    { name: 'Dr. Jones', specialization: 'Pulmonary' },
    { name: 'Dr. Lee', specialization: 'Endocrinology' },
    { name: 'Dr. Adams', specialization: 'Cardiovascular Medicine' },
  ];

  it('should return doctors matching the disease name', () => {
    const disease = { name: 'Cardio', type: 'Heart' };
    const result = findDoctorsToNotifyAboutPatient(disease, doctors);
    expect(result).toEqual([
      { name: 'Dr. Smith', specialization: 'Cardiology' },
      { name: 'Dr. Adams', specialization: 'Cardiovascular Medicine' },
    ]);
  });

  it('should return doctors matching the disease type', () => {
    const disease = { name: 'Wheezing', type: 'Pulmonary' };
    const result = findDoctorsToNotifyAboutPatient(disease, doctors);
    expect(result).toEqual([{ name: 'Dr. Jones', specialization: 'Pulmonary' }]);
  });

  it('should return empty array if no doctors match', () => {
    const disease = { name: 'Dermatitis', type: 'Skin' };
    const result = findDoctorsToNotifyAboutPatient(disease, doctors);
    expect(result).toEqual([]);
  });
});
