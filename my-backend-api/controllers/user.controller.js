const { signAppToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");
const { User, AuthProvider } = require("../models");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { adminAuth } = require("../lib/firebaseAdmin");

const register = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: role && role === "admin" ? "admin" : "user",
    });

    await AuthProvider.create({
      provider: "EMAIL",
      providerId: newUser.id.toString(),
      password: hashedPassword,
      userId: newUser.id,
    });

    const token = signAppToken(newUser);

    return res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("error", err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = signAppToken(user);
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Error in login:", err);
    return res.status(500).json({ error: err.message });
  }
};

const googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const { email, name, uid } = decoded;

    if (!email) {
      return res.status(400).json({ message: "Google account has no email" });
    }
    let authProvider = await AuthProvider.findOne({
      where: { provider: "GOOGLE", providerId: uid },
      include: [{ model: User }],
    });

    let user;

    if (!authProvider) {
      user = await User.findOne({ where: { email } });

      if (!user) {
        user = await User.create({ name, email });
        await AuthProvider.create({
          provider: "GOOGLE",
          providerId: uid,
          userId: user.id,
        });
      } else {
        await AuthProvider.create({
          provider: "GOOGLE",
          providerId: uid,
          userId: user.id,
        });
      }
    } else {
      user = authProvider.User;
    }
    const appToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Google login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: appToken,
    });
  } catch (err) {
    console.error("Google login error:", err);
    return res.status(401).json({ message: "Google login failed" });
  }
};

const users = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "name",
        "lastName",
        "phone",
        "addresses",
        "email",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, addresses, lastName } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (addresses !== undefined) {
      let currentAddresses = user.addresses || [];

      const updatedAddresses = addresses.map((addr) => {
        if (!addr.id) {
          return { id: uuidv4(), ...addr };
        }
        return addr;
      });

      user.addresses = updatedAddresses;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updatedData = req.body;

    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const addresses = user.addresses || [];

    const index = addresses.findIndex(
      (addr) => String(addr.id) === String(addressId)
    );

    if (index === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    addresses[index] = { ...addresses[index], ...updatedData };
    user.addresses = addresses;
    await user.save();

    return res.json({ message: "Address updated successfully", addresses });
  } catch (error) {
    console.error("error ---------", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  users,
  me,
  googleLogin,
  updateProfile,
  updateAddress,
};
