# 📦 Sistema de Inventario – Frontend

Aplicación web para la gestión de inventario con control de stock, roles de usuario y alertas visuales.  
Forma parte de un sistema completo orientado a uso real en comercios o pequeñas empresas.

---

## 🧩 Funcionalidades principales

- Autenticación de usuarios
- Gestión de productos
- Control de stock con movimientos (entradas / salidas)
- Alertas visuales por stock bajo
- Gestión de categorías y proveedores
- Gestión de usuarios con roles
- Interfaz responsive y clara

---

## 👥 Roles de usuario

- **Admin**
  - Acceso total al sistema
  - Gestión de usuarios
  - Visualización de alertas de stock
- **Empleado**
  - Gestión de productos y movimientos
- **Visor**
  - Acceso de solo lectura

---

## 🚨 Alertas de stock

- 🔴 **Stock crítico**: stock menor al mínimo
- 🟡 **Advertencia**: stock igual o hasta 2 unidades por encima del mínimo
- Las alertas visibles en el sidebar están disponibles únicamente para el rol **admin**

---

## 🛠️ Tecnologías utilizadas

- Angular (Standalone Components)
- TypeScript
- Tailwind CSS
- RxJS
- Angular HttpClient

---

## 🧠 Decisiones técnicas

- Arquitectura basada en componentes standalone para mayor modularidad
- Servicios desacoplados para comunicación con el backend
- Control de permisos desde frontend basado en rol
- Separación clara entre edición de producto y movimientos de stock
  - El stock **no puede modificarse directamente** al editar un producto
  - Todos los cambios de stock deben registrarse mediante movimientos

---

## ▶️ Instalación y ejecución

```bash
npm install
ng serve
