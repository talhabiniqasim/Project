import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Course from './models/Course.js';
import connectDB from './config/db.js';
import bcrypt from 'bcryptjs';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Course.deleteMany();
    await User.deleteMany();

    // The pre('save') middleware hashes the password automatically.
    // However, since we might want to bypass or it depends on how we create,
    // we just let create() run the middleware.

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'Admin',
    });

    const instructorUser = await User.create({
      name: 'Instructor Kashif Saeed',
      email: 'instructor@example.com',
      password: 'password123',
      role: 'Instructor',
    });

    const studentUser = await User.create({
      name: 'Student Mudassir Maroof',
      email: 'student@example.com',
      password: 'password123',
      role: 'Student',
    });

    const sampleCourses = [
      {
        title: 'MERN Stack Mastery',
        description: 'Learn the MERN stack from scratch.',
        category: 'Web Development',
        price: 9999,
        instructor: instructorUser._id,
        lessons: [
          { title: 'Intro to Node.js', videoUrl: 'http://example.com/vid1' },
          { title: 'React Basics', videoUrl: 'http://example.com/vid2' }
        ]
      },
      {
        title: 'Advanced React patterns',
        description: 'Take your React skills to the next level.',
        category: 'Web Development',
        price: 14999,
        instructor: instructorUser._id,
        lessons: []
      }
    ];

    await Course.insertMany(sampleCourses);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Course.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
