import expressAsyncHandler from 'express-async-handler';
import { Category } from '../models/index.js';

export const get_categories_list = expressAsyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).exec();

  res.render('index', {
    categories,
    title: 'Categories List',
    partial: 'allCategories',
  });
});

export const get_category = expressAsyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).exec();

  res.render('index', {
    category,
    title: `Category: ${category.name}`,
    partial: 'category',
  });
});
