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
        this.store.products.forEach(product => this.view.renderProduct(product));
        this.view.renderTotalImport(this.store.totalImport());
        this.store.categories.forEach(category => this.view.renderCategoryList(category));
    }

    addProductToStore(formData) {
        // En realidad se harían aquí las comprobaciones, pero ya están en el model
        try {
            const prod = this.store.addProduct(formData);
            this.view.renderProduct(prod);
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
            id = 'producto ' + id;
            this.view.renderRemoveElementById(id);
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
}

module.exports = Controller;