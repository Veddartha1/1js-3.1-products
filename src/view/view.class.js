class View {

    renderProduct(product) {

        const productUI = document.createElement('tr');
        productUI.id = 'producto-' + product.id;
        productUI.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.units}</td>
        <td>${Number(product.price).toFixed(2)} €/u</td>
        <td>${Number(product.productImport()).toFixed(2)} €</td>
        <td>
            <button class="btn btn-secondary aumentar">
                <span class="material-icons">expand_less</span>
            </button>
            <button class="btn btn-secondary reducir">
                <span class="material-icons">expand_more</span>
            </button>
            <button class="btn btn-secondary editar">
                <span class="material-icons editar">settings</span>
            </button>
            <button class="btn btn-secondary borrar">
                <span class="material-icons">delete_forever</span>
            </button>
        </td>`;
        const tbodyUI = document.querySelector('#table-body');
        tbodyUI.appendChild(productUI);
        if (product.units < 1) {
            document.querySelector('#producto-' + product.id + ' .reducir').disabled = true;
        } else {
            document.querySelector('#producto-' + product.id + ' .reducir').disabled = false;
        }
    }

    renderUpdatedProduct(product) {

        let productsUI = document.querySelector('#producto-' + product.id, 'td');
        let id = productsUI.firstElementChild;
        id.innerHTML = `<td>${product.id}</td>`;
        let name = id.nextElementSibling;
        name.innerHTML = `<td>${product.name}</td>`;
        let category = name.nextElementSibling;
        category.innerHTML = `<td>${product.category}</td>`;
        let units = category.nextElementSibling;
        units.innerHTML = `<td>${product.units}</td>`;
        let price = units.nextElementSibling;
        price.innerHTML = `<td>${Number(product.price).toFixed(2)} €/u</td>`;
        let importe = price.nextElementSibling;
        importe.innerHTML = `<td>${Number(product.productImport()).toFixed(2)} €</td>`;
        
        if (product.units < 1) {
            document.querySelector('#producto-' + product.id + ' .reducir').disabled = true;
        } else {
            document.querySelector('#producto-' + product.id + ' .reducir').disabled = false;
        }

    }

    renderRemoveElementById(id) {
        const element = document.getElementById(id);
        element.remove();
    }

    renderTotalImport(totalImport) {
        const impTotalUI = document.getElementById('importe-total');
        impTotalUI.textContent = Number(totalImport).toFixed(2) + ' €';
    }

    renderCategoryList(payload) {
        const optionUI = document.createElement('option');
        optionUI.id = 'categoria ' + payload.id;
        optionUI.innerHTML = payload.name;
        optionUI.value = payload.id;
        const selectUI = document.getElementById('newprod-cat');
        selectUI.appendChild(optionUI);

        const catUI = document.createElement('tr');
        catUI.id = 'categoria-' + payload.id;
        catUI.innerHTML = `
        <td>${payload.id}</td>
        <td>${payload.name}</td>
        <td>${payload.description}</td>`;
        const tbodyUI = document.querySelector('#cat-table-body');
        tbodyUI.appendChild(catUI);
    }

    renderEditProduct(product) {
        document.querySelector('#new-prod legend').textContent = 'Editar producto';
        
        document.getElementById('newprod-id').value = product.id;
        document.getElementById('newprod-name').value = product.name;
        document.getElementById('newprod-cat').value = product.category;
        document.getElementById('newprod-units').value = product.units;
        document.getElementById('newprod-price').value = product.price;
        document.getElementById('add-prod').textContent = 'Editar';

        document.getElementById('reset-prod').addEventListener('click', (event) => {
            document.querySelector('#new-prod legend').textContent = 'Añadir producto';     
            document.getElementById('add-prod').textContent = 'Añadir';
        });
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