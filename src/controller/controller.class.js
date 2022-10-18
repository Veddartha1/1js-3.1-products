const Product = require('../model/product.class');
const Store = require('../model/store.class');
const View = require('../view/view.class');

class Controller {

    constructor() {
        this.store = new Store(1, 'Almacén 1');
        this.view = new View();
    }

    init(){
        this.store.loadData();
        this.store.products.forEach(product => {
            this.view.renderProduct(product);
            this.addButtonListener(product.id)
        });
        this.view.renderTotalImport(this.store.totalImport());
        this.store.categories.forEach(category => this.view.renderCategoryList(category));
        this.showSection('almacen');
    }

    addButtonListener(productId) {
        const prod = this.store.getProductById(productId);

        document.querySelector('#producto-' + productId + ' .aumentar').addEventListener('click', (event) => {
            event.preventDefault();
            
            this.store.aumentarProducto(productId);
            this.view.renderUpdatedProduct(prod);
            this.view.renderTotalImport(this.store.totalImport());
        });
        document.querySelector('#producto-' + productId + ' .reducir').addEventListener('click', (event) => {
            event.preventDefault();
            
            this.store.reducirProducto(productId);
            this.view.renderUpdatedProduct(prod);
            this.view.renderTotalImport(this.store.totalImport());
        });
        document.querySelector('#producto-' + productId + ' .editar').addEventListener('click', (event) => {
            event.preventDefault();
            this.view.renderEditProduct(prod);

        });
        
        document.querySelector('#producto-' + productId + ' .borrar').addEventListener('click', (event) => {
            event.preventDefault();
            this.deleteProductFromStore(productId);
        });
    }

    addProductToStore(formData) {
        // En realidad se harían aquí las comprobaciones, pero ya están en el model
        try {
            const prod = this.store.addProduct(formData);
            this.view.renderProduct(prod);
            this.addButtonListener(prod.id);
            this.view.renderTotalImport(this.store.totalImport());
        } catch(err) {
            this.view.renderMessage(err);
        }

    }
    
    addCategoryToStore(formData){
        try {
            const newCat = this.store.addCategory(formData.name, formData.description);
            this.view.renderCategoryList(newCat);
        } catch(err) {
            this.view.renderMessage(err);
        }
    }

     deleteProductFromStore(id) {
        try {
            this.store.delProduct(id);
            id = 'producto-' + id;
            this.view.renderRemoveElementById(id);
            this.view.renderTotalImport(this.store.totalImport());
        } catch(err) {
            this.view.renderMessage(err);
        }
    }

    deleteCategoryFromStore(id) {
        try {
            this.store.delCategory(id);
            id = 'categoria ' + id;
            this.view.renderRemoveElementById(id);
        } catch(err) {
            this.view.renderMessage(err);
        }
    }

    editProductFromStore(formData) {
        try {
            let prod = this.store.editProduct(formData.id, formData.name, formData.price, formData.category, formData.units);
            this.view.renderUpdatedProduct(prod);
            this.view.renderTotalImport(this.store.totalImport());
        } catch(err) {
            this.view.renderMessage(err);
        }
    }

    showSection(section) {
        this.hideAllSections();
        document.getElementById(section).classList.remove('oculto');
    }

    hideAllSections() {
        document.getElementById('almacen').classList.add('oculto');
        document.getElementById('new-cat').classList.add('oculto');
        document.getElementById('del-cat').classList.add('oculto');
        document.getElementById('new-prod').classList.add('oculto');
        document.getElementById('almacen').classList.add('oculto');
        document.getElementById('categorias').classList.add('oculto');
        document.getElementById('about').classList.add('oculto');
    }

}

module.exports = Controller;