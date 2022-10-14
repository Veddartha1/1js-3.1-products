'use strict'

// Aquí la clase Product

class Product {
    
    constructor(id, name, category, price, units=0) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.units = units;
    }

    productImport() {
        return this.units * this.price;
    }

    toString() {
        return this.name + ': ' + this.units + ' uds. x ' + this.price.toFixed(2) + ' €/u = ' + this.productImport().toFixed(2) + ' €';
    }

    setUnits(units) {
        if (units < 0) {
            throw "Las unidades no pueden ser negativas";
        }
        if (isNaN(units)) {
            throw "Formato incorrecto de unidades"
        }
        this.units = units;
    }

    setName(name) {
        this.name = name;
    }

    setCategory(category) {
        this.category = category;
    }

    setPrice(price) {
        if (price < 0) {
            throw "El precio no puede ser negativo";
        }
        if (isNaN(price)) {
            throw "Formato incorrecto de precio"
        }
        this.price = price;
    }

    getUnits() {
        return this.units;
    }

}

module.exports = Product