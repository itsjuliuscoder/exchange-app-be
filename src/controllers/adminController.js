const Admin = require('../models/Admin');

// Get all admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get admin by ID
exports.getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new admin
exports.createAdmin = async (req, res) => {
    const admin = new Admin(req.body);
    try {
        const newAdmin = await admin.save();
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update admin
exports.updateAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ message: 'Admin deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};