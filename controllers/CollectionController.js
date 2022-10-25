import CollectionModel from '../models/Collection.js';

export const getAllCollections = async (req, res) => {
  try {
    const collections = await CollectionModel.find().populate('user').exec();
    res.json(collections);
  } catch (error) {
    console.log(error),
      res.status(500).json({
        message: 'Не удалось получить коллекции',
      });
  }
};
export const removeCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;

    CollectionModel.findByIdAndDelete(
      {
        _id: collectionId,
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
        res.json({
          success: true,
        });
      },
    );
  } catch (error) {
    console.log(error),
      res.status(500).json({
        message: 'Не удалось получить коллекции',
      });
  }
};

export const createCollection = async (req, res) => {
  try {
    const doc = new CollectionModel({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      imageUrl: req.body.imageUrl,
      // items: req.body.items,
      user: req.userId,
    });

    const collection = await doc.save();
    res.json(collection);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const postId = req.params.id;
    await CollectionModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        imageUrl: req.body.imageUrl,
        items: req.body.items,
        user: req.userId,
      },
    );
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};
export const getOneCollection = async (req, res) => {
  try {
    const postId = req.params.id;
    const collection = await CollectionModel.findOne({ _id: postId });
    res.json(collection);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статью',
    });
  }
};

export const getMyCollection = async (req, res) => {
  try {
    const myCollections = await CollectionModel.find(
      {
        user: req.userId,
      },
      { items: 1 },
    );
    res.json(myCollections);
  } catch (error) {
    console.log(error),
      res.status(500).json({
        message: 'Не удалось получить коллекции',
      });
  }
};
