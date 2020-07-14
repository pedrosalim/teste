const fs = require('fs')
const data = require('./data.json')
const Intl = require('intl')

exports.list = function(req, res) {
    return res.render("products/list", {products: data.products})
}

exports.show = function(req, res) {
    const { id } = req.params

    const foundProduct = data.products.find(function(product) {
        return product.id == id
    })

    if(!foundProduct) return res.send("Produto não encontrado")

    const product = {
        ...foundProduct,
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundProduct.created_at)
    }

    return res.render("products/show", { product })

}

exports.post = function(req, res) {

    const keys = Object.keys(req.body)

    // VERIFICAR SE TODOS OS CAMPOS ESTÃO PREENCHIDOS

    for(key of keys) {
        if (req.body[key] == "") {
            return res.send("Preencha todos os campos")
        }
    }

    // DESESTRUTURANDO O REQ.BODY

    let {avatar_url, name, cod, typeProduct, value} = req.body

    const created_at = Date.now()
    const id = Number(data.products.length + 1)


    data.products.push({
        id,
        avatar_url,
        name,
        typeProduct,
        cod,
        value,
        created_at
    })

    // ESCREVER OS ARQUIVOS CRIADOS DENTRO DO DATA.JSON

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Houve um erro!")

        return res.redirect(`/products/${id}`)
    })

    //return res.send(req.body)
}

exports.edit = function(req, res) {
    const { id } = req.params

    const foundProduct = data.products.find(function(product) {
        return id == product.id
    })

    if(!foundProduct) return res.send("Produto não encontrado")

    const product = {
        ...foundProduct,
    }


    return res.render('products/edit' , { product })
}

exports.put = function(req, res) {
    const { id } = req.body
    let index = 0

    const foundProduct = data.products.find(function(product, foundIndex) {
        if (id == product.id) {
            index = foundIndex
            return true
        }
    })

    if(!foundProduct) return res.send("Produto não encontrado")

    const product = {
        ...foundProduct,
        ...req.body,
        id: Number(req.body.id)
       
    }

    data.products[index] = product

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Houve um erro!")

        return res.redirect(`/products/${id}`)

    })
}

exports.delete = function(req, res) {
    const { id } = req.body // DESESTRUTAR O ID

    const filteredProducts = data.products.filter(function(product) {
        return product.id != id
    })

    data.products = filteredProducts

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Houve um erro!")

        return res.redirect("/products")
    })
}