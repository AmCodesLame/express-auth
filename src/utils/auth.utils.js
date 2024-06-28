import nodemailer from 'nodemailer';
import mailConfig from '../config/nodemailer.config.js';
import OtpModel from '../models/otp.model.js';
const crypto = require('crypto');

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
    const info = await transporter.sendMail({
      from: 'intern@monter.com',
      to: email,
      subject: "OTP for Email Verification",
      html: `<h1>Your OTP is ${otp}</h1>`,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};
