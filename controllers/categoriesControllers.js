import asyncHandler from 'express-async-handler';
import { isValidObjectId } from 'mongoose';
import { Category, Item } from '../models/index.js';

export const get_categories_list = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).exec();

  res.render('index', {
    categories,
    title: 'Categories List',
    partial: 'allCategories',
  });
});

export const get_category = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).exec();

  res.render('index', {
    category,
    title: `Category: ${category.name}`,
    partial: 'category',
  });
});

export const get_create_category = asyncHandler(async (_, res) => {
  res.render('index', { title: 'Add new category', partial: 'categoryForm', method: 'post' });
});

export const post_create_category = asyncHandler(async (req, res) => {
  const createdCategory = await Category.create(req.body);

  res.redirect(createdCategory.url);
});

export const delete_category = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error('Category not found');
  }

  const items = await Item.find({ category: req.params.id }).exec();

  if (items.length > 0) {
    items.forEach(async (item) => {
      await Item.findByIdAndUpdate(item._id, {
        category: item.category.filter((category) => category._id === req.params.id),
      }).exec();
    });
  }

  await Category.findByIdAndDelete(req.params.id).exec();

  res.redirect('/categories');
});

export const get_update_category = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error('Category not found');
  }

  const category = await Category.findById(req.params.id).exec();

  res.render('index', {
    category,
    title: `Update item: ${category.name}`,
    partial: 'categoryForm',
    method: 'post',
  });
});

export const post_update_category = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error('Item not found');
  }

  await Category.findByIdAndUpdate(req.params.id, { ...req.body, last_modified: new Date() })
    .exec()
    .then(() => res.redirect(`/categories/${req.params.id}`));
});
