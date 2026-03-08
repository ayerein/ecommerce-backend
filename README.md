# ⚙️ Ecommerce Backend - Node.js & MongoDB

Este es el núcleo de procesamiento (API REST) del proyecto Ecommerce Full Stack. Se encarga de la gestión de la base de datos, la lógica de productos y la persistencia de la información.

**🔗 [API Base URL](https://ecommerce-backend-1tde.onrender.com)**

---

## 🛠️ Stack Tecnológico

* **Node.js:** Entorno de ejecución para el servidor.
* **Express.js:** Framework para la creación de rutas y manejo de middlewares.
* **MongoDB & Mongoose:** Base de datos NoSQL y modelado de datos mediante esquemas.
* **CORS:** Configuración de seguridad para permitir peticiones desde el frontend.
* **Dotenv:** Gestión de variables de entorno para proteger credenciales.
* **Passport.js:** Middleware de autenticación con estrategias local (Registro/Login) y JWT.
* **JWT (JSON Web Tokens):** Generación de tokens seguros para el manejo de sesiones.
* **Bcrypt:** Encriptación de contraseñas mediante hashing para máxima seguridad.
* **Cookie-Parser:** Manejo de cookies firmadas para el almacenamiento seguro del JWT.

---

## 🔐 Autenticación y Seguridad

Se implemento un sistema de seguridad siguiendo los estándares:

* **Estrategia "Current":** Endpoint especializado `/api/sessions/current` que utiliza Passport-JWT para validar la identidad del usuario a través de cookies.
* **Encriptación:** Uso de `bcrypt.hash` para asegurar que las contraseñas nunca se almacenen en texto plano.
* **Merge de Carritos:** Lógica avanzada que detecta si un usuario tiene productos en un carrito de "invitado" y los transfiere automáticamente a su carrito personal al registrarse o loguearse.
* **Autorización por Roles:** Middlewares para restringir el acceso a rutas sensibles (CRUD de productos) solo a usuarios con rol `admin`.

---

## 🛰️ API Endpoints

La API está organizada de forma semántica siguiendo las mejores prácticas de REST:

### Productos (`/api/products`)
* `GET /api/products` - Obtiene la lista de productos (incluye filtros, búsqueda y paginación).
* `POST /api/products` - Crea un nuevo producto (Admin).
* `GET /api/products/:id` - Obtiene un producto existente por su ID.
* `PUT /api/products/:id` - Actualiza un producto existente por su ID.
* `DELETE /api/products/:id` - Elimina un producto de la base de datos.
* `GET /api/products/categories` - Obtiene el listado único de categorías disponibles.

### Carritos (`/api/carts`)
* `POST /api/cart` - Crear nuevo carrito.
* `GET /api/cart/:id` - Obtener productos de un carrito específico.
* `POST /api/cart/add` - Agregar producto al carrito.
* `DELETE /api/cart/:cartId/product/:productId` - Elimina un producto del carrito.
* `DELETE /api/cart/:cartId` - Elimina el carrito.

### Sesiones y Usuarios (`/api/sessions`)
* `POST /api/sessions/register` - Registro de nuevo usuario (crea hash de password y asigna carrito).
* `POST /api/sessions/login` - Autenticación y generación de JWT en cookie firmada.
* `GET /api/sessions/current` - Valida el token actual y devuelve los datos del usuario.
* `POST /api/sessions/logout` - Limpia la cookie de sesión.

* ### Órdenes de Compra (`/api/orders`)
* `POST /api/orders/` - **[Auth Only]** Finaliza la compra del carrito actual, verifica stock, genera el ticket y vacía el carrito del usuario.

---

## 🧠 Decisiones Técnicas

* **Arquitectura de Datos:** Implementación de esquemas de Mongoose con validaciones integradas para asegurar la integridad de los datos (precios numéricos, stock obligatorio, etc.).
* **Paginación y Filtrado:** Lógica optimizada en el servidor para procesar parámetros de búsqueda (`search`), filtrado por precio y categorías directamente desde la consulta a la base de datos.
* * **Estrategia de Persistencia de Sesión:** Implementé el almacenamiento del JWT en **Cookies firmadas (`httpOnly`)**.
* **Integración de Carritos (Merge Lógica):** Desarrollé una lógica de "fusión" de carritos. Al autenticarse, el servidor identifica si existe un `guestCartId` y transfiere los productos al carrito persistente del usuario.
* **Middlewares de Autorización:** Utilicé un sistema de "Capas de Seguridad" mediante Passport.js. Cada ruta crítica (como el CRUD de productos o la creación de órdenes) cuenta con un middleware que valida no solo el token, sino también el rol (`admin`/`user`) del solicitante.
* **Seguridad de Datos:** Implementación de **Bcrypt** para el manejo de credenciales, asegurando que en caso de una brecha de base de datos las contraseñas no queden expuestas.

---

## 📁 Estructura del Proyecto

```text
src/
 ├── config/         # Configuración de base de datos (MongoDB)
 ├── controllers/    # Lógica de los endpoints (User, Product, Cart)
 ├── middleware/     # Validaciones de sesión y roles (isAuth, isAdmin)
 ├── models/         # Esquemas de Mongoose (Product)
 ├── routes/         # Definición de rutas y endpoints
 └── app.js          # Punto de entrada y configuración de Express
