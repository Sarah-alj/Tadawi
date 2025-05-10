import { DiseaseTypeModel } from '../models/disease-type.model.js';
import { DoctorModel } from '../models/doctor.model.js';
import { PatientMedicalHistoryModel } from '../models/medicalHistory.model.js';
import { NotificationModel } from '../models/notification.model.js';
import { PatientModel } from '../models/patient.model.js';
import { UserModel } from '../models/user.model.js';

export class AutoMatchEngine {
  /**
   * Handle Post Doctor Registration
   * @typedef {{userDetails: {name: string}, doctorDetails: {specialization: string}}} DoctorData
   * @typedef {{userId: string, name: string, diseaseName: string, diseaseType: string, medicalHistory: string | null | undefined, medicinalHistory: string | null | undefined}} PatientProfile
   * @param {string} doctorId - The ID of the doctor to get suggestions for.
   * @returns {Promise<void>}
   */
  static async handlePostDoctorRegistration(doctorId) {
    try {
      const patientUsers = await UserModel.find({ userType: 'patient' });

      const doctorProfile = await DoctorModel.findOne({ user: doctorId });
      const doctorUser = await UserModel.findById(doctorId);
      if (!doctorProfile || !doctorUser) return;

      /** @type {PatientProfile[]} */
      const patientProfiles = [];

      await Promise.all(
        patientUsers.map(async (patientUser) => {
          const patient = await PatientModel.findOne({ user: patientUser._id });
          if (!patient) return;

          const medicalHistory = await PatientMedicalHistoryModel.findOne({ patient: patient._id });
          if (!medicalHistory) return;

          const disease = await DiseaseTypeModel.findById(medicalHistory.disease);
          if (!disease) return;

          patientProfiles.push({
            userId: patientUser._id.toString(),
            name: patientUser.name,
            diseaseName: disease.name,
            diseaseType: disease.type,
            medicalHistory: medicalHistory.medicalHistory,
            medicinalHistory: medicalHistory.medicinalHistory,
          });
        })
      );

      const matchedPatients = this.findPatientsToNotifyDoctors(doctorProfile.specialization, patientProfiles);

      // send notification to patients for matched doctor
      const meaningfulMessage = `New potential trial match: Doctor ${doctorUser.name} with specialization ${doctorProfile.specialization}.`;
      await NotificationModel.create(
        matchedPatients.map((patient) => ({
          user: patient.userId,
          message: meaningfulMessage,
          eventType: 'automatch',
        }))
      );
      // send notification to doctor for matched patients
      const notifications = matchedPatients.map((patient) => ({
        user: doctorId,
        message: `Potential trial match found: Patient ${patient.name} with ${patient.diseaseName} (${
          patient.diseaseType
        }). ${patient.medicalHistory ? `Medical History: ${patient.medicalHistory}.` : ''} ${
          patient.medicinalHistory ? `Medicinal History: ${patient.medicinalHistory}` : ''
        }`.trim(),
        eventType: 'automatch',
        metadata: {
          patientId: patient.userId,
          diseaseName: patient.diseaseName,
          diseaseType: patient.diseaseType,
        },
      }));

      console.log('NOTIFICATIONS1:', notifications);

      await NotificationModel.create(notifications);
    } catch (error) {
      console.error('Error in getSuggesstionsForDoctor:', error);
    }
  }

  /**
   * Handle Post Patient Registration
   * @typedef {{userDetails: {name: string}, medicalHistory: {diseaseId: string, medicalHistory: string, medicinalHistory: string}}} PatientData
   * @typedef {{userId: string, name: string, specialization: string}} DoctorProfile
   * @param {string} patientId - The ID of the patient to get suggestions for.
   * @returns {Promise<void>}
   */
  static async handlePostPatientRegistration(patientId) {
    try {
      const patientUser = await UserModel.findById(patientId);
      const patientProfile = await PatientModel.findOne({ user: patientId });

      if (!patientUser || !patientProfile) return;

      const patientMedicalHistory = await PatientMedicalHistoryModel.findOne({ patient: patientProfile._id });

      if (!patientMedicalHistory) {
        console.log('Patient or medical history not found');
        return;
      }

      const disease = await DiseaseTypeModel.findById(patientMedicalHistory.disease);
      if (!disease) {
        console.log('Disease not found');
        return;
      }

      const doctorUsers = await UserModel.find({ userType: 'doctor' });

      /** @type {DoctorProfile[]} */
      const doctorProfiles = [];
      await Promise.all(
        doctorUsers.map(async (doctorUser) => {
          const doctor = await DoctorModel.findOne({ user: doctorUser._id });
          if (!doctor) return;

          doctorProfiles.push({
            userId: doctorUser._id.toString(),
            name: doctorUser.name,
            specialization: doctor.specialization,
          });
        })
      );

      const matchedDoctors = this.findDoctorsToNotifyAboutPatient(
        { name: disease.name, type: disease.type },
        doctorProfiles
      );

      // send notification to doctors for matched patient
      const meaningfulMessage = `New potential trial match: Patient ${patientUser.name} with ${disease.name} (${disease.type}). Medical History: ${patientMedicalHistory.medicalHistory}. Medicinal History: ${patientMedicalHistory.medicinalHistory}`;
      await NotificationModel.create(
        matchedDoctors.map((doctor) => ({
          user: doctor.userId,
          message: meaningfulMessage,
          eventType: 'automatch',
        }))
      );

      // send notification to patient for matched doctors
      const notifications = matchedDoctors.map((doctor) => ({
        user: patientId,
        message: `Doctor ${doctor.name} with specialization ${doctor.specialization} may be a potential match for your case.`,
        eventType: 'automatch',
      }));

      console.log('NOTIFICATIONS2:', notifications);

      await NotificationModel.create(notifications);
    } catch (error) {
      console.error('Error in getSuggesstionsForPatient:', error);
    }
  }

  /**
   * Helper Function To Find Patients To Notify About Doctor
   * @param {string} specialization
   * @param {PatientProfile[]} patientProfiles
   * @return {PatientProfile[]}
   */
  static findPatientsToNotifyDoctors(specialization, patientProfiles) {
    const specializationNormalized = specialization.toLowerCase();

    return patientProfiles.filter((patient) => {
      const diseaseNameNormalized = patient.diseaseName.toLowerCase();
      const diseaseTypeNormalized = patient.diseaseType.toLowerCase();
      return (
        specializationNormalized.includes(diseaseNameNormalized) ||
        specializationNormalized.includes(diseaseTypeNormalized) ||
        diseaseNameNormalized.includes(specializationNormalized) ||
        diseaseTypeNormalized.includes(specializationNormalized)
      );
    });
  }

  /**
   * Find doctors to notify
   * @param {{name: string, type: string}} disease
   * @param {DoctorProfile[]} doctorProfiles
   */
  static findDoctorsToNotifyAboutPatient(disease, doctorProfiles) {
    const diseaseNameNormalized = disease.name.toLowerCase();
    const diseaseTypeNormalized = disease.type.toLowerCase();

    return doctorProfiles.filter((doctor) => {
      const doctorSpecializationNormalized = doctor.specialization.toLowerCase();
      return (
        doctorSpecializationNormalized.includes(diseaseNameNormalized) ||
        doctorSpecializationNormalized.includes(diseaseTypeNormalized) ||
        diseaseNameNormalized.includes(doctorSpecializationNormalized) ||
        diseaseTypeNormalized.includes(doctorSpecializationNormalized)
      );
    });
  }
}
