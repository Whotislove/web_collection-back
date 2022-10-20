import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 3 символа').isLength({ min: 3 }),
  body('fullName'),
  body('status').optional(),
];
export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 3 символа').isLength({ min: 3 }),
];

export const collectionCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 2 }).isString(),
  body('type', 'Введите тип коллекции').isLength({ min: 2 }).isString(),
  body('description', 'Введите описание коллекции').isLength({ min: 5 }).isString(),
  body('imageUrl', 'Неверная ссылка на изображение').isString(),
  body('items').isArray(),
];
