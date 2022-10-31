import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModel from '../models/User.js';
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      status: req.body.status,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      { expiresIn: '360d' },
    );
    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Данный пользователь уже существует',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      return res.status(404).json({
        message: 'Неверный пароль',
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      { expiresIn: '180d' },
    );
    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
    });
  } catch (error) {
    console.log(error);
    res.status().json({
      message: 'Нет доступа',
    });
  }
};
export const getAll = async (req, res) => {
  try {
    const user = await UserModel.find(req);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Ошибка пользователей',
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await UserModel.findOneAndDelete(
      {
        _id: req.body._id,
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: 'Ошибка',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Пользователь не найден',
          });
        }
        res.json({
          success: true,
        });
      },
    );
    await CollectionModel.deleteMany(
      {
        user: req.body._id,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить коллекцию',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }
      },
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Ошибка пользователей',
    });
  }
};
export const updateUser = async (req, res) => {
  try {
    await UserModel.updateOne(
      {
        _id: req.body._id,
      },
      {
        status: req.body.status,
      },
    );
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Ошибка запроса',
    });
  }
};
