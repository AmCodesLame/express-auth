import nodemailer from 'nodemailer';
import mailConfig from '../config/nodemailer.config.js';
import OtpModel from '../models/otp.model.js';
import crypto from 'crypto';

export const sendVerificationOtp = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      auth: {
        user: mailConfig.user,
        pass: mailConfig.password,
      }
    });
    const otp = crypto.randomInt(100000, 999999);
    const otpData = new OtpModel({ email, otp });
    await otpData.save();
    const info = await transporter.sendMail({
      from: 'intern@monter.com',
      to: email,
      subject: "OTP for Email Verification",
      html: `<h1>Your OTP is ${otp}</h1>`,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    throw new Error("Failed to send OTP");
  }
};

export const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  // Adjust age if the birthday has not occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
}