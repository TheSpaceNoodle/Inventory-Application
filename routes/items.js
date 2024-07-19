import express from 'express';
import {
  delete_item,
  get_create_item,
  get_item,
  get_items_list,
  get_update_item,
  post_create_item,
  post_update_item,
} from '../controllers/itemsControllers.js';

const router = express.Router();

/* GET home page. */
router.get('/', get_items_list);
router.get('/create', get_create_item);
router.post('/create', post_create_item);

router.get('/:id', get_item);
router.get('/:id/delete', delete_item);
router.get('/:id/update', get_update_item);
router.post('/:id/update', post_update_item);

export default router;
