'use strict'

// Aquí importaremos la clase del controlador e instanciaremos uno
const Controller = require('./controller/controller.class')
window.addEventListener('load', () => {
const myController = new Controller()
myController.init()
})