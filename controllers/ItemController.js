import CollectionModel from '../models/Collection.js';
import ItemModel from '../models/Item.js';

export const createItem = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const doc = new ItemModel({
      id: req.body.id,
      name: req.body.name,
      type: req.body.type,
      tags: req.body.tags.split(','),
      comments: [],
      collectionName: collectionId,
    });
    const update = await CollectionModel.findByIdAndUpdate(
      {
        _id: collectionId,
      },
      {
        $inc: { itemsCount: 1 },
      },
    );
    const item = await doc.save();
    res.json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось создать предмет',
    });
  }
};
export const getAllItems = async (req, res) => {
  try {
    const items = await ItemModel.find().populate('collectionName').exec();
    res.json(items);
  } catch (error) {
    console.log(error),
      res.status(500).json({
        message: 'Не удалось получить предметы',
      });
  }
};
export const getColletionItems = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const allItems = await ItemModel.find({
      collectionName: collectionId,
    });
    res.json(allItems);
  } catch (error) {
    console.log(error),
      res.status(500).json({
        message: 'Не удалось получить предметы',
      });
  }
};
export const getOneItem = async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const itemId = req.params.itemId;
    const item = await ItemModel.findOne({
      collectionName: collectionId,
      _id: itemId,
    });
    res.json(item);
  } catch (error) {
    console.log(error),
      res.status(500).json({
        message: 'Не удалось получить предмет',
      });
  }
};
export const removeItem = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const deleteItem = ItemModel.findByIdAndDelete(
      {
        _id: req.body.id,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить предмет',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Предмет не найден',
          });
        }
      },
    );
    const deleteItemCount = await CollectionModel.findByIdAndUpdate(
      {
        _id: collectionId,
      },
      {
        $inc: { itemsCount: -1 },
      },
    );
    const arr = await ItemModel.find({ collectionName: collectionId });
    arr.forEach(async (e, i) => {
      const update = await ItemModel.updateOne(
        {
          _id: e._id,
        },
        {
          id: i + 1,
        },
      );
    });

    res.json({ success: true });
  } catch (error) {
    console.log(error),
      res.status(500).json({
        message: 'Не удалось получить предмет',
      });
  }
};
export const addComment = async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const itemId = req.params.itemId;
    const addComment = await ItemModel.updateOne(
      {
        collectionName: collectionId,
        _id: itemId,
      },
      {
        $push: {
          comments: {
            name: req.body.name,
            text: req.body.text,
            date: req.body.date,
          },
        },
      },
    );
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось создать комментарий',
    });
  }
};
export const updateItem = async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const itemId = req.params.itemId;
    const updateItem = await ItemModel.updateOne(
      {
        collectionName: collectionId,
        _id: itemId,
      },
      {
        name: req.body.name,
        type: req.body.type,
        tags: req.body.tags,
      },
    );
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось создать комментарий',
    });
  }
};
