import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { asyncHandler } from '../utils/async-handler.js';
import { generateToken } from '../utils/token.js';
import { toSlug } from '../utils/slug.js';

const generateUniqueUsername = async (name) => {
  const base = toSlug(name) || 'user';
  let candidate = base;
  let counter = 1;

  while (await User.exists({ username: candidate })) {
    counter += 1;
    candidate = `${base}-${counter}`;
  }

  return candidate;
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email already registered.'
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const username = await generateUniqueUsername(name);

  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword
  });

  const token = generateToken({ userId: user._id.toString() });

  return res.status(201).json({
    success: true,
    message: 'Registration successful.',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email
      }
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  }

  const passwordMatched = await bcrypt.compare(password, user.password);

  if (!passwordMatched) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  }

  const token = generateToken({ userId: user._id.toString() });

  return res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email
      }
    }
  });
});

export const me = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user
  });
});
