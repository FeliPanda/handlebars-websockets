const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbsEngine = require('express-handlebars').engine;

// Servidor y configuración de Socket.IO
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de las vistas (Handlebars)
app.set('views', __dirname + '/views');
app.engine('handlebars', exphbsEngine({
    defaultLayout: '',
}));
app.set('view engine', 'handlebars');

// Datos de prueba (reemplazar por base de datos)
let productos = ['Producto 1', 'Producto 2', 'Producto 3'];

// Rutas
app.get('/', (req, res) => {
    res.render('home', { productos }); // Renderiza home.handlebars
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { productos }); // Renderiza realTimeProducts.handlebars
});

// WebSockets
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    // Manejar evento 'addProduct' del cliente
    socket.on('addProduct', (productName) => {
        productos.push(productName);
        io.emit('updateProducts', productos); // Emitir actualizaciones a todos
    });

    // Manejar evento 'deleteProduct' del cliente
    socket.on('deleteProduct', (productId) => {
        productos.splice(productId, 1);
        io.emit('updateProducts', productos); // Emitir actualizaciones a todos
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Exportación de módulo (opcional para pruebas)
module.exports = server;
