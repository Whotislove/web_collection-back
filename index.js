import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, collectionCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as CollectionController from './controllers/CollectionController.js';
import cors from 'cors';
mongoose
  .connect(
    'mongodb+srv://admin:wwwwww@cluster0.lmxnk7s.mongodb.net/collection?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('DB OK');
  })
  .catch((err) => console.log('DB error', err));
const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post('/login', loginValidation, UserController.login);

app.post('/register', registerValidation, UserController.register);

app.get('/me', checkAuth, UserController.getMe);

app.get('/mycollection', checkAuth, CollectionController.getMyCollection);

app.post(
  '/collection',
  checkAuth,
  collectionCreateValidation,
  CollectionController.createCollection,
);
app.get('/collection', CollectionController.getAllCollections);
app.delete('/collection/:id', checkAuth, CollectionController.removeCollection);
app.patch('/collection/:id', checkAuth, CollectionController.updateCollection);
app.post('/item/:id', checkAuth, CollectionController.createItem);
app.delete('/item/:id', checkAuth, CollectionController.deleteItem);
app.patch('/item/:id', checkAuth, CollectionController.updateItem);

app.listen(1111, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});
