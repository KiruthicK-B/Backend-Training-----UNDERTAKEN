require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const createAdminAccount = async () => {
    try {
        
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        
        const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('Admin account already exists with email: admin@example.com');
            console.log('\nTo create a new admin, modify the email or password in this script.');
            process.exit(0);
        }

     
        const admin = new Admin({
            email: 'admin@example.com',
            password: 'admin@123'  
        });

        await admin.save();

        console.log('\n✓ Admin account created successfully!');
        console.log('\nAdmin Credentials:');
        console.log('─────────────────');
        console.log('Email: admin@example.com');
        console.log('Password: admin@123');
        console.log('\nUse these credentials to login at POST /admin/login');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin account:', error.message);
        process.exit(1);
    }
};

createAdminAccount();
