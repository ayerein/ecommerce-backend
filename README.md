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

---

## 🛰️ API Endpoints

La API está organizada de forma semántica siguiendo las mejores prácticas de REST:

### Productos
* `GET /api/products` - Obtiene la lista de productos (incluye filtros, búsqueda y paginación).
* `POST /api/products` - Crea un nuevo producto (Admin).
* `PUT /api/products/:id` - Actualiza un producto existente por su ID.
* `DELETE /api/products/:id` - Elimina un producto de la base de datos.

### Categorías
* `GET /api/products/categories` - Obtiene el listado único de categorías disponibles.

---

## 🧠 Decisiones Técnicas

* **Arquitectura de Datos:** Implementación de esquemas de Mongoose con validaciones integradas para asegurar la integridad de los datos (precios numéricos, stock obligatorio, etc.).
* **Paginación y Filtrado:** Lógica optimizada en el servidor para procesar parámetros de búsqueda (`search`), filtrado por precio y categorías directamente desde la consulta a la base de datos.
* **Manejo de Errores:** Implementación de bloques `try/catch` y respuestas HTTP estandarizadas para una comunicación clara con el frontend.
* **Escalabilidad:** Separación de responsabilidades en carpetas (config, models, routes) para facilitar el crecimiento del proyecto.

---

## 📁 Estructura del Proyecto

```text
src/
 ├── config/         # Configuración de base de datos (MongoDB)
 ├── models/         # Esquemas de Mongoose (Product)
 ├── routes/         # Definición de rutas y endpoints
 └── app.js          # Punto de entrada y configuración de Express
