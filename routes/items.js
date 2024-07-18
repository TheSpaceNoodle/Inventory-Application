import express from 'express';
import { get_item, get_items_list } from '../controllers/itemsControllers.js';

const router = express.Router();

/* GET home page. */
router.get('/', get_items_list);
router.get('/:id', get_item);

export default router;
