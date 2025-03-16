import { postData } from './http-calls.js';

export async function login({ email, password, userType }) {
  const loginResponse = await postData('/api/auth/login', {
    email,
    password,
    userType,
  });

  console.log('loginResponse', loginResponse);

  if (loginResponse.isOk) {
    localStorage.setItem('email', email);
    localStorage.setItem('userType', userType);

    alert(
      `OTP has been sent to your email. Please enter the OTP to login. Your OTP is ${loginResponse.data.otp}`
    );

    if (userType === 'doctor') {
      window.location.href = '/Login-OTP/Dr-OTPpage.html';
    } else if (userType === 'patient') {
      window.location.href = '/Login-OTP/P-OTPpage.html';
    } else {
      window.location.href = '/Login-OTP/Dn-OTPpage.html';
    }
  }

  return loginResponse;
}

export async function submitOtp({ otp }) {
  const email = localStorage.getItem('email');
  const userType = localStorage.getItem('userType');

  const otpResponse = await postData('/api/auth/verify-otp', {
    email,
    otp,
    userType,
  });

  console.log('otpResponse', otpResponse);

  if (otpResponse.isOk) {
    localStorage.setItem('user', JSON.stringify(otpResponse.data.user));

    if (userType === 'doctor') {
      window.location.href = '/Home/HomePage-Dr.html';
    } else if (userType === 'patient') {
      window.location.href = '/Home/HomePage-Patient.html';
    } else {
      window.location.href = '/Home/HomePage-Donor.html';
    }
  }

  return otpResponse;
}
