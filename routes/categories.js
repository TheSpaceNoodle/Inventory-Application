import express from 'express';
import {
  delete_category,
  get_categories_list,
  get_category,
  get_create_category,
  get_update_category,
  post_create_category,
  post_update_category,
} from '../controllers/categoriesControllers.js';

const router = express.Router();

/* GET users listing. */
router.get('/', get_categories_list);
router.get('/create', get_create_category);
router.post('/create', post_create_category);

router.get('/:id/delete', delete_category);
router.get('/:id/update', get_update_category);
router.post('/:id/update', post_update_category);
router.get('/:id', get_category);

export default router;
