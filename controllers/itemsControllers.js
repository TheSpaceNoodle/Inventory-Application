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
  const item = await Item.findById(req.params.id).populate('category').exec();

  res.render('index', {
    item,
    title: `Item: ${item.name}`,
    partial: 'item',
  });
});
