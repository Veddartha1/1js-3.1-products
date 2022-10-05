class View {

    renderProduct(product) {

        const productUI = document.createElement('tr');
        productUI.id = 'producto ' + product.id;
        productUI.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.units}</td>
        <td>${Number(product.price).toFixed(2)} €/u</td>
        <td>${Number(product.productImport()).toFixed(2)} €</td>
        <td></td>`;
        
        const tbodyUI = document.querySelector('#table-body');
        tbodyUI.appendChild(productUI);

    }

    renderRemoveElementById(id) {
        const element = document.getElementById(id);
        element.remove();
    }

    renderTotalImport(totalImport) {
        const impTotalUI = document.getElementById('importe-total');
        impTotalUI.textContent = Number(totalImport).toFixed(2) + ' €';
    }

    renderCategoryList(category) {
        const optionUI = document.createElement('option');
        optionUI.id = 'categoria ' + category.id;
        optionUI.innerHTML = category.name;
        optionUI.value = category.id;
        const selectUI = document.getElementById('newprod-cat');
        selectUI.appendChild(optionUI);
    }
    
    renderMessage(msj) {
        const divErrorUI = document.getElementById('messages');
        divErrorUI.innerHTML = `<div class="alert alert-danger alert-dismissible" role="alert">
        ${msj}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onclick="this.parentElement.remove()">
        </button>
        </div>`
    }
}

module.exports = View;