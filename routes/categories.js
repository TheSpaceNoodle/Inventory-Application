import express from 'express';
import { get_categories_list, get_category } from '../controllers/categoriesControllers.js';

const router = express.Router();

/* GET users listing. */
router.get('/', get_categories_list);
router.get('/:id', get_category);

export default router;
