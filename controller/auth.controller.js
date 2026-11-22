// Auth oldingi darslarda yozilgan (videoda to'liq ko'rsatilmagan) — oddiy register/login
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../model/auth.model');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "username, email va password kerak" });
  }

  const foundUser = await userModel.findOne({ email });
  if (foundUser) {
    return res.status(400).json({ message: 'Bu email allaqachon mavjud' });
  }

  const hash = await bcrypt.hash(password, 10);
  await userModel.create({ username, email, password: hash });

  res.status(201).json({ message: "Ro'yxatdan o'tdingiz" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const foundUser = await userModel.findOne({ email });
  if (!foundUser) {
    return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
  }

  const check = await bcrypt.compare(password || '', foundUser.password);
  if (!check) {
    return res.status(400).json({ message: "Parol noto'g'ri" });
  }

  const token = jwt.sign(
    { id: foundUser._id, email: foundUser.email, role: foundUser.role },
    process.env.SECRET_KEY,
    { expiresIn: '1d' },
  );

  res.json({ message: 'Muvaffaqiyatli', token });
};

module.exports = { register, login };
