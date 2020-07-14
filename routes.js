const express = require('express')
const routes = express.Router()
const products = require('./products')

routes.get('/', function(req, res) {
    return res.redirect("/products")
})

routes.get('/products', function(req, res) {
    return res.render("products/index")
})

routes.get('/products/list', products.list)

routes.get('/products/create', function(req, res) {
    return res.render("products/create")
})

routes.get('/products/:id', products.show)

routes.get('/products/:id/edit', products.edit)

routes.put('/products', products.put)

routes.post("/products", products.post)

routes.delete('/products', products.delete)

module.exports = routes