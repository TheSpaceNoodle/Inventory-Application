import asyncHandler from 'express-async-handler';
import { isValidObjectId } from 'mongoose';
import { Category, Item } from '../models/index.js';

export const get_items_list = asyncHandler(async (req, res) => {
  const categoryFromQuery = req.query.category;

  const isCategoryFilter = categoryFromQuery && isValidObjectId(categoryFromQuery);
  const itemsFilter = isCategoryFilter ? { category: categoryFromQuery } : {};

  const filterCategories = (data) =>
    isCategoryFilter ? data.filter((val) => val._id.toHexString() !== categoryFromQuery) : data;

  const [items, categories, currentCategory] = await Promise.all([
    Item.find(itemsFilter).sort({ last_modified: 1 }).exec(),
    Category.find().sort({ name: 1 }).exec().then(filterCategories),
    isCategoryFilter && Category.findById(categoryFromQuery).exec(),
  ]);

  res.render('index', {
    items,
    categories,
    title: 'Items List',
    partial: 'allItems',
    currentCategory,
  });
});

export const get_item = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error('Item not found');
  }

  const item = await Item.findById(req.params.id).populate('category').exec();

  res.render('index', {
    item,
    title: `Item: ${item.name}`,
    partial: 'item',
  });
});

export const get_create_item = asyncHandler(async (_, res) => {
  const categories = await Category.find().exec();

  res.render('index', { categories, title: 'Add new item', partial: 'itemForm', method: 'post' });
});

export const post_create_item = asyncHandler(async (req, res) => {
  const createdItem = await Item.create({ ...req.body, last_modified: new Date() });

  res.redirect(createdItem.url);
});

export const delete_item = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error('Item not found');
  }

  await Item.findByIdAndDelete(req.params.id).exec();

  res.redirect('/items');
});

export const get_update_item = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error('Item not found');
  }

  const [item, categories] = await Promise.all([Item.findById(req.params.id).exec(), Category.find().exec()]);

  res.render('index', {
    item,
    categories,
    title: `Update item: ${item.name}`,
    partial: 'itemForm',
    method: 'post',
  });
});

export const post_update_item = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error('Item not found');
  }

  await Item.findByIdAndUpdate(req.params.id, { ...req.body, last_modified: new Date() })
    .exec()
    .then(() => res.redirect(`/items/${req.params.id}`));
});
