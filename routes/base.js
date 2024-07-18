import { Router } from 'express';

const router = Router();

router.get('/', (_, res) => {
  res.redirect('/items');
});

export default router;
