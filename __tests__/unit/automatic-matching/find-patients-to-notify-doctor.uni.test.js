import { findPatientsToNotifyDoctors } from '../../../controllers/signup/signup-controller';

describe('findPatientsToNotifyDoctors', () => {
  const patients = [
    { name: 'Alice', diseaseName: 'Cardiomyopathy', diseaseType: 'Heart Disease' },
    { name: 'Bob', diseaseName: 'Asthma', diseaseType: 'Respiratory' },
    { name: 'Charlie', diseaseName: 'Hypertension', diseaseType: 'Cardiovascular' },
    { name: 'David', diseaseName: 'Diabetes', diseaseType: 'Endocrine' },
  ];

  it('should return matching patients based on specialization', () => {
    const result = findPatientsToNotifyDoctors('Cardio', patients);
    expect(result).toEqual([
      { name: 'Alice', diseaseName: 'Cardiomyopathy', diseaseType: 'Heart Disease' },
      { name: 'Charlie', diseaseName: 'Hypertension', diseaseType: 'Cardiovascular' },
    ]);
  });

  it('should return empty array if no match', () => {
    const result = findPatientsToNotifyDoctors('Dermatology', patients);
    expect(result).toEqual([]);
  });

  it('should match if specialization is included in disease name or type', () => {
    const result = findPatientsToNotifyDoctors('Hypertension', patients);
    expect(result).toEqual([{ name: 'Charlie', diseaseName: 'Hypertension', diseaseType: 'Cardiovascular' }]);
  });
});
