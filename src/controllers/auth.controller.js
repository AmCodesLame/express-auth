import OtpModel from '../models/otp.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/user.model.js';
import {sendVerificationOtp} from '../utils/auth.utils.js';
dotenv.config();


export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();    
    sendVerificationOtp();
    res.status(201).json({ message: 'User registered, Verify User through OTP' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        sendVerificationOtp();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        } 
        const response = await OtpModel.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (!actualOtp || response[0].otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        await User.findOneAndUpdate({ email }, { is_verified: true });
        await OtpModel.deleteAll({ email });
        res.status(200).json({ message: 'Email verified' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if(!user.is_verified) {
            return res.status(400).json({ message: 'Email not verified' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '6h' }); 
        res.status(200).json({ message: 'User logged in', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
