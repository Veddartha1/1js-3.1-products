const Product = require('../model/product.class')
const Store = require('../model/store.class')
const View = require('../view/view.class')

class Controller {

    constructor() {
        this.store = new Store(1, 'Almacén 1')
        this.view = new View()
    }

    init(){
        this.store.loadData()
        this.store.products.forEach(product => {
            this.view.renderProduct(product)
            this.addButtonListener(product.id)
        });
        this.view.renderTotalImport(this.store.totalImport());
        this.store.categories.forEach(category => this.view.renderCategoryList(category))
        this.showSection('almacen')
        this.addListeners()
    }

    addListeners() {

        window.addEventListener('load', () => {

            document.getElementById('new-prod').addEventListener('submit', (event) => {

                event.preventDefault()

                const id = document.getElementById('newprod-id').value
                const name = document.getElementById('newprod-name').value
                const price = document.getElementById('newprod-price').value
                const category = document.getElementById('newprod-cat').value
                const units = document.getElementById('newprod-units').value

                if (id) {
                    this.editProductFromStore({ id, name, price, category, units })   
                } else {
                    this.validateName.bind(this)()
                    this.validateCat()
                    this.validateUnits()
                    this.validatePrice()
                    this.addProductToStore({ name, price, category, units })   
                }
            })
          
            document.getElementById('new-cat').addEventListener('submit', (event) => {
                event.preventDefault()
            
                const name = document.getElementById('newcat-name').value
                const description = document.getElementById('newcat-description').value
            
                this.addCategoryToStore({ name, description })   
          
            })
          
            document.getElementById('del-cat').addEventListener('submit', (event) => {
                event.preventDefault()
            
                this.deleteCategoryFromStore(document.getElementById('delcat-id').value)      
            })
          
            document.getElementById('pagina-prod').addEventListener('click', (event) => {
                this.showSection('almacen')
            })
          
            document.getElementById('pagina-cat').addEventListener('click', (event) => {
                this.showSection('categorias')
            })
          
            document.getElementById('pagina-add-prod').addEventListener('click', (event) => {
                this.showSection('new-prod')
            })
          
            document.getElementById('pagina-add-cat').addEventListener('click', (event) => {
                this.showSection('new-cat')
            })
            
            document.getElementById('pagina-about').addEventListener('click', (event) => {
                this.showSection('about')
            })

            document.getElementById('newprod-name').addEventListener('blur', this.validateName.bind(this))

            document.getElementById('newprod-cat').addEventListener('blur', this.validateCat)

            document.getElementById('newprod-units').addEventListener('blur', this.validateUnits)

            document.getElementById('newprod-price').addEventListener('blur', this.validatePrice)
          
        })
    }

    validateName() {
        const id = document.getElementById('newprod-id').value
        if (!id) { 
            const nombre = document.getElementById('newprod-name')
            const error = document.querySelector('#newprod-name + span.error')
            if (this.hasProductName(nombre.value)) {
                nombre.setCustomValidity("El nombre ya existe")
            } else {
                nombre.setCustomValidity("")
            }
            error.textContent = nombre.validationMessage
        }
    }

    validateCat() {
        const id = document.getElementById('newprod-id').value
        if (!id) { 
            const cat = document.getElementById('newprod-cat')
            cat.nextElementSibling.textContent = cat.validationMessage
        }
    }

    validateUnits() {
        const id = document.getElementById('newprod-id').value
        if (!id) { 
            const units = document.getElementById('newprod-units')
            units.nextElementSibling.textContent = units.validationMessage
        }
    }

    validatePrice() {
        const id = document.getElementById('newprod-id').value
        if (!id) { 
            const precio = document.getElementById('newprod-price')
            const error = document.querySelector('#newprod-price + span.error')
            if (precio.validity.patternMismatch) {
                error.textContent = "Se debe introducir un número entero positivo con un máximo de 2 decimales";
            } else {
                error.textContent = ""
            }
            error.textContent = precio.validationMessage
        }
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
            this.showSection('new-prod')
        });
        
        document.querySelector('#producto-' + productId + ' .borrar').addEventListener('click', (event) => {
            event.preventDefault();
            this.deleteProductFromStore(productId);
        });
    }

    addProductToStore(formData) {
        if (document.getElementById('new-prod').checkValidity()) {
            try {
                const prod = this.store.addProduct(formData);
                this.view.renderProduct(prod);
                this.addButtonListener(prod.id);
                this.view.renderTotalImport(this.store.totalImport());
            } catch(err) {
                this.view.renderMessage(err);
            }
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

    hasProductName(searchedName) {
        return this.store.products.some(product => product.getName() === searchedName)
    }

}

module.exports = Controller;