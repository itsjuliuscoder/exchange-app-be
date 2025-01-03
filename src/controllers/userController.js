const register = async (req, res) => {
    res.status(201).json({ message: 'User registered successfully' });
};

const login = async (req, res) => {
    res.status(200).json({ message: 'Login successful' });
};

module.exports = { register, login };
  