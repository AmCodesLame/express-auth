import OtpModel from '../models/otp.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/user.model.js';
import {sendVerificationOtp, calculateAge} from '../utils/auth.utils.js';
dotenv.config();


export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    const existingUser = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });
    if (existingUser || existingUsername) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();    
    await sendVerificationOtp(email);
    res.status(201).json({ message: 'User registered, Verify User through OTP' });
  } catch (error) {
    res.status(500).json({ message: `Server error - ${error}` });
  }
};

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
          return res.status(400).json({ message: 'Please fill all fields' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        if (user.is_verified) {
            return res.status(400).json({ message: 'Email already verified' });
        }
        await sendVerificationOtp(email);
        res.status(200).json({ message: 'OTP sent for verification' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!username || !otp) {
          return res.status(400).json({ message: 'Please fill all fields' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        } 
        if (user.is_verified) {
            return res.status(400).json({ message: 'Email already verified' });
        }
        const response = await OtpModel.find({ email }).sort({ createdAt: -1 }).limit(1);
        
        if (response.length == 0 || response[0].otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        await User.findOneAndUpdate({ email }, { is_verified: true });
        await OtpModel.deleteMany({ email });
        res.status(200).json({ message: 'Email verified' });
    } catch (error) {
        res.status(500).json({ message: 'Server error'});
    }
}

export const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if ((!username && !email) || !password) {
          return res.status(400).json({ message: 'Please fill all fields' });
        }
        let user;
        if(email) {
          user = await User.findOne({ email });
        } else {
          user = await User.findOne({username})
        }
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if(!user.is_verified) {
            await sendVerificationOtp(user.email);
            return res.status(400).json({ message: 'Email not verified, OTP sent for verification' });
        }
        const token = jwt.sign({ id: user._id, role: user.is_admin }, process.env.JWT_SECRET, { expiresIn: '6h' }); 
        if(!user.is_updated) {
            res.status(200).json({ message: 'User logged in, Update profile', token });
        }

        res.status(200).json({ message: 'User logged in', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const updateUser = async (req, res) => {
  try {
        const { username, email, password, location, work, dob, briefDescription } = req.body;
        const userId = req.user.id;

        if (username || email || password) {
          return res.status(400).json({ message: 'Cannot update these fields: username, email, password' });
        }

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        if(dob){
          user.dob = new Date(dob);
          user.age = calculateAge(dob);
          user.is_updated = true;
        }

        user.location = location || user.location;
        user.work = work || user.work;
        user.briefDescription = briefDescription || user.briefDescription;
        user.updatedAt = Date.now();

        await user.save();

        res.status(200).json({ message: 'Profile updated succesfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error'+error });
    }
}

export const getUser = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ user });
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
}

export const adminLogin = async (req, res) => {
  try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
      }
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isValid = await bcrypt.compare(password, user.password);
      const hashedPassword = await bcrypt.hash(password, 10);
      if (!isValid) {
          return res.status(400).json({ message: 'Invalid credentials'+hashedPassword });
      }
      if(!user.is_admin) {
          return res.status(400).json({ message: 'Not Authorized'});
      }
      const token = jwt.sign({ id: user._id, role: user.is_admin }, process.env.JWT_SECRET, { expiresIn: '6h' }); 

      res.status(200).json({ message: 'Admin User logged in', token });
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Server error' });
  }
}

export const adminGetUsers = async (req, res) => {
  try {
      let users = [];
      const usersdb = await User.find({ is_admin: false });
      usersdb.forEach(user => {
        users.push(user.username);
      })
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
}

export const adminGetUser = async (req, res) => {
  try {
      const { username } = req.body;
      if(!username ) {
        return res.status(400).json({ message: 'Please fill all fields' });
      }

      const user = await User.findOne({ username }).select('-password');
      if (!user) {
          return res.status(400).json({ message: 'Invalid username' });
      }
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
}

export const adminDeleteUser = async (req, res) => {
  try {
      const { username } = req.body;
      if(!username ) {
        return res.status(400).json({ message: 'Please fill all fields' });
      }

      const user = await User.findOneAndDelete({ username });
      if (!user) {
          return res.status(400).json({ message: 'Invalid username' });
      }
      res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
}
