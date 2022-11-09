'use strict'

const Category = require('./category.class');
const Product = require('./product.class');
const SERVER = 'http://localhost:3000'

// Aquí la clase Store

class Store {

    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.products = new Array();
        this.categories = new Array();
    }

    async loadData() {
        try {
            const response = await fetch(SERVER + '/categories')
            if (!response.ok) {
                throw `Error ${response.status} de la BBDD: ${response.statusText}`
            }
            const categories = await response.json()
            categories.forEach(category => {
                this.categories.push(new Category(category.id, category.name, category.description));
            });
        } catch (error) {
            alert(error)
        }

        try {
            const response = await fetch(SERVER + '/products')
            if (!response.ok) {
                throw `Error ${response.status} de la BBDD: ${response.statusText}`
            }
            const products = await response.json()
            products.forEach(product => {
                this.products.push(new Product(product.id, product.name, product.category, product.price, product.units));
            });
        } catch (error) {
            alert(error)
        } 
    }

    getCategoryById(id) {
        let category = this.categories.find(category => category.id === Number(id));
        if (!category) {
            throw "No se encuentra ninguna cagegoría con id " + id;
        }
        return category;
    }

    getCategoryByName(name) {
        let category = this.categories.find(category => category.name.toLocaleLowerCase() === name.toLocaleLowerCase());
        if (!category) {
            throw "No se encuentra ninguna cagegoría con nombre " + name;
        }
        return category;
    }

    getProductById(id) {
        let product = this.products.find(croduct => croduct.id === Number(id));
        if (!product) {
            throw "No se encuentra ningún producto con id " + id;
        }
        return product;
    }

    getProductsByCategory(id) {
        let products = this.products.filter(product => product.category === Number(id));
        return products;
    }

    async addCategory(payload) {
        if (!payload.name) {
            throw "No se ha indicado ningún nombre";
        }
        try {
            this.getCategoryByName(payload.name);
        } catch {
            const response = await fetch (SERVER + '/categories/', {
                method: 'POST', 
                body: JSON.stringify(payload),
                headers:{
                'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw 'Error: ' + response.status
            }
            const attributes = await response.json()
            const newCat = new Category (attributes.id, attributes.name, attributes.description)
            this.categories.push(newCat);
            return newCat;    
        }
        throw "Ya existe la categoría";
    }

    async addProduct(payload) {
        if (!payload.name) {
            throw "No se ha indicado ningún nombre";
        }
        if (!payload.category) {
            throw "No se ha indicado categoría";
        }
        if (!payload.price || isNaN(payload.price)) {
            throw "No se ha indicado un precio o su formato es incorrecto";
        }
        if (payload.price < 0) {
            throw "El precio es inferior a 0";
        }
        if (payload.units && (!Number.isInteger(Number(payload.units)) || isNaN(payload.units))) {
            throw "La unidades tienen un formato incorrecto";
        }
        if (payload.units < 0) {
            throw "Las unidades son inferior a 0";
        }

        const response = await fetch(SERVER + '/products', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw `Error ${response.status} de la BBDD: ${response.statusText}`
        }
        const attributes = await response.json()

        this.getCategoryById(payload.category);
        //let id = this.products.reduce((max, product) => max > product.id ? max : product.id, 0) + 1;
        const newProduct = new Product (attributes.id, attributes.name, attributes.category, attributes.price, attributes.units);
        this.products.push(newProduct);
        return newProduct;
    }

    async delCategory(id) {
        let category = this.getCategoryById(id);
        if (!category) {
            throw "La categoría no existe";
        }
        if (this.getProductsByCategory(id).length > 0) {
            throw "La categoría contiene productos";     
        } else {
            const response = await fetch(SERVER + '/categories/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
                })
            if (!response.ok) {
                throw `Error ${response.status} de la BBDD: ${response.statusText}`
            }
            let catIndex = this.categories.findIndex(category => category.id === Number(id));
            this.categories.splice(catIndex,1);
            return category;
        }  
    }

    async delProduct(id) {
        let producto = this.getProductById(id);
        if (producto.units > 0) {
            throw "El producto todavía tiene unidades"; 
        }
        const response = await fetch(SERVER + '/products/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
            })
        if (!response.ok) {
            throw `Error ${response.status} de la BBDD: ${response.statusText}`
        }
        let productIndex = this.products.findIndex(product => product.id === Number(id));
        this.products.splice(productIndex, 1);
        return producto;
    }

    totalImport() {
        return this.products.reduce((total, product) => total += product.productImport(), 0);
    }

    orderByUnitsDesc() {
        return this.products.sort((elem1, elem2) => elem2.units - elem1.units);
    }

    orderByName() {
        return this.products.sort((elem1, elem2) => elem1.name.localeCompare(elem2.name));
    }

    underStock(units) {
        return this.products.filter(function(product) {
            if (product.units < units) {
                return true;
            } else {
                return false;
            }
        });
    }

    aumentarProducto(id) {
        let unidades = this.getProductById(id).units;
        unidades = Number(unidades) + 1;
        this.getProductById(id).setUnits(unidades);
    }

    reducirProducto(id) {
        let unidades = this.getProductById(id).units;
        unidades = Number(unidades) - 1;
        if (unidades < 0) {
            throw "Las unidades no pueden ser menores a 0";
        }
        this.getProductById(id).setUnits(unidades);
    }

    toString() {
        let cabecera = 'Almacén ' + this.id + ' => ' + this.products.length +
        ' productos: ' + this.totalImport.toFixed(2) + ' €\n';
        let productos = this.products.map(product => '- ' + product);
        return  cabecera + productos;
    }

    async editProduct(payload) {
        if (!payload.name) {
            throw "No se ha indicado ningún nombre";
        }
        if (!payload.category) {
            throw "No se ha indicado categoría";
        }
        if (!payload.price || isNaN(payload.price)) {
            throw "No se ha indicado un precio o su formato es incorrecto";
        }
        if (payload.price < 0) {
            throw "El precio es inferior a 0";
        }
        if (payload.units && (!Number.isInteger(Number(payload.units)) || isNaN(payload.units))) {
            throw "La unidades tienen un formato incorrecto";
        }
        if (payload.units < 0) {
            throw "Las unidades son inferior a 0";
        }

        const response = await fetch(SERVER + '/products/' + payload.id, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
            })
        if (!response.ok) {
            throw `Error ${response.status} de la BBDD: ${response.statusText}`
        }
        let product = this.getProductById(payload.id);
        product.setName(payload.name);
        product.setPrice(payload.price);
        product.setCategory(payload.category);
        product.setUnits(payload.units);
        return product;
    }

}

module.exports = Store