import path from 'path';

import { checkAuth } from '../lib/check-auth.js';
import HttpError from '../lib/http-error.js';
import { getPublicPath } from '../lib/utils.js';

const doctorTopLevelPages = [
  '/Home/HomePage-Dr.html',
  '/About-us/About-usPostDr.html',
  '/HelpPage/Help-Dr.html',
  '/PatientsTabPage/PatientTabPage.html',
  '/MatchesPage/DrMatches.html',
  '/LabPage/Lab.html',
  '/NotificationsPage/DR-NotifPage.html',
  '/Chatbox/Dr-Chatbox.html',
];

const patientTopLevelPages = [
  '/Home/HomePage-Patient.html',
  '/About-us/About-usPostPatient.html',
  '/HelpPage/Help-Patient.html',
  '/EditProfile/EditProfile-Patient.html',
  '/ClinicalTrialPage/CTpage.html',
  '/MatchesPage/PatientMatchesPage.html',
  '/NotificationsPage/P-NotifPage.html',
  '/Chatbox/Patient-Chatbox.html',
];

const donorTopLevelPages = [
  '/Home/HomePage-Donor.html',
  '/About-us/About-usPostDonor.html',
  '/DonationsPgae/DonationsPage.html',
  '/HelpPage/Help-Donor.html',
  '/DonationsPgae/NewDonation.html',
  '/DonationsPgae/MyDonations.html',
  '/NotificationsPage/Donor-NotifPage.html',
  '/EditProfile/EditProfile-Donor.html',
];

const DOCTOR_HOME_PAGE = '/Home/HomePage-Dr.html';
const PATIENT_HOME_PAGE = '/Home/HomePage-Patient.html';
const DONOR_HOME_PAGE = '/Home/HomePage-Donor.html';
const HOME_PAGE = '/Home/HomePage.html';

const PATIENT_LOGIN_PAGE = '/Login-OTP/P-Login.html';
const DOCTOR_LOGIN_PAGE = '/Login-OTP/Dr-Login.html';
const DONOR_LOGIN_PAGE = '/Login-OTP/Dn-Login.html';

const DOCTOR_USER_TYPE = 'doctor';
const PATIENT_USER_TYPE = 'patient';
const DONOR_USER_TYPE = 'donorAcquirer';

/**
 * Protect HTML pages
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
export async function protectHtmlPages(request, response, next) {
  const requestedUrl = request.originalUrl;

  const time = new Date().toLocaleTimeString();

  if (requestedUrl === '/') {
    console.log('home page');

    try {
      const authUser = await checkAuth(request, [DOCTOR_USER_TYPE, PATIENT_USER_TYPE, DONOR_USER_TYPE]);

      if (authUser.userType === DOCTOR_USER_TYPE) {
        return response.redirect(DOCTOR_HOME_PAGE);
      } else if (authUser.userType === PATIENT_USER_TYPE) {
        return response.redirect(PATIENT_HOME_PAGE);
      } else if (authUser.userType === DONOR_USER_TYPE) {
        return response.redirect(DONOR_HOME_PAGE);
      } else {
        return response.redirect(HOME_PAGE);
      }
    } catch (error) {
      request.session.destroy((error) => {
        //TODO: handle error
      });

      return response.redirect(HOME_PAGE);
    }
  }

  const isDoctorTopLevelPage = checkInArray(doctorTopLevelPages, requestedUrl);
  const isPatientTopLevelPage = checkInArray(patientTopLevelPages, requestedUrl);
  const isDonorTopLevelPage = checkInArray(donorTopLevelPages, requestedUrl);

  if (isDoctorTopLevelPage || isPatientTopLevelPage || isDonorTopLevelPage) {
    response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.setHeader('Pragma', 'no-cache');
    response.setHeader('Expires', '0');
  }

  if (isDoctorTopLevelPage) {
    console.log(`${time} - in doctor's top level page`);
    try {
      await checkAuth(request, DOCTOR_USER_TYPE);
      return response.sendFile(path.join(getPublicPath(), requestedUrl));
    } catch (error) {
      if (error instanceof HttpError && error.statusCode === 403) {
        console.log('DOES NOT HAVE PERMISSION');
      }

      request.session.destroy((error) => {
        //TODO: handle error
      });
      return response.redirect(DOCTOR_LOGIN_PAGE);
    }
  }

  if (isPatientTopLevelPage) {
    console.log(`${time} - in patient's top level page`);
    try {
      await checkAuth(request, PATIENT_USER_TYPE);
      return response.sendFile(path.join(getPublicPath(), requestedUrl));
    } catch (error) {
      if (error instanceof HttpError && error.statusCode === 403) {
        console.log('DOES NOT HAVE PERMISSION');
      }

      request.session.destroy((error) => {
        //TODO: handle error
      });
      return response.redirect(PATIENT_LOGIN_PAGE);
    }
  }

  if (isDonorTopLevelPage) {
    console.log(`${time} - in donor's top level page`);

    try {
      await checkAuth(request, DONOR_USER_TYPE);
      return response.status(200).sendFile(path.join(getPublicPath(), requestedUrl));
    } catch (error) {
      if (error instanceof HttpError && error.statusCode === 403) {
        console.log('DOES NOT HAVE PERMISSION');
      }

      request.session.destroy((error) => {
        //TODO: handle error
      });
      return response.redirect(DONOR_LOGIN_PAGE);
    }
  }

  next();
}

/**
 * Check if value exists in array
 * @param {string[]} array
 * @param {string} value
 * @returns {string | undefined}
 */
function checkInArray(array, value) {
  const normalizedValue = value.toLowerCase();
  const found = array.find((element) => element.toLowerCase() === normalizedValue);
  return found;
}
