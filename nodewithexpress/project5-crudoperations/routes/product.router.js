var express = require('express');
var router = express.Router();
var productCtrl = require('../controllers/product.ctrl')


// router.get('/products',productCtrl.get);
// router.get('/products/:id', productCtrl.getById);
// router.post('/products', productCtrl.save);
// router.delete('/products/:id', productCtrl.delete);
// domain.com/products
router.get('', productCtrl.get);
router.get('/:id', productCtrl.getById);
router.post('', productCtrl.save);
router.delete('/:id', productCtrl.delete);
router.put('/:id',productCtrl.update);
module.exports = router;