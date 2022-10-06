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
        const errorUI = document.createElement('div');
        errorUI.className = 'alert alert-danger alert-dismissible';
        errorUI.role = 'alert';
        errorUI.innerText = msj;
        const divErrorUI = document.getElementById('messages').appendChild(errorUI);
        setTimeout(() => divErrorUI.remove(errorUI), 3000);
    }
}

module.exports = View;