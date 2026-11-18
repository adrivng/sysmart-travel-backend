# SysMart Travel - Backend API

**ERP Inteligente para Agencias Mayoristas de Viajes**

SysMart Travel es una plataforma integral (B2B) diseñada para digitalizar y automatizar la operación de una agencia mayorista de turismo. Permite la gestión de agencias minoristas (clientes), proveedores (operadores), catálogo de paquetes, tarifas multimoneda y un flujo completo de cotizaciones y reservas.

Como valor agregado, integra un **Asistente Virtual con IA (Chat RAG)** que permite a los agentes de viajes consultar precios, disponibilidad, condiciones y destinos en lenguaje natural, agilizando la venta y atención al cliente.

> **Nota importante:** Este repositorio contiene **exclusivamente el Backend (API REST)** desarrollado en **Java 21 + Spring Boot**. El Frontend (React + TypeScript) se encuentra en un repositorio separado.

---

## Stack Tecnológico (Backend)

* **Lenguaje:** Java 21 (LTS)
* **Framework:** Spring Boot 4
* **Persistencia:** Spring Data JPA / Hibernate
* **Base de Datos:** PostgreSQL (Neon Serverless)
* **Migraciones:** Flyway
* **Seguridad:** Spring Security + JWT (JSON Web Tokens)
* **Validación:** Bean Validation
* **Documentación:** SpringDoc OpenAPI (Swagger UI)
* **Inteligencia Artificial:** Integración nativa con **Google Gemini API** (Modelo `gemini-3.1-flash-lite`) para el Chat RAG.

---

## Arquitectura del Sistema

El proyecto está construido bajo una arquitectura **desacoplada (Backend / Frontend)** y un patrón **MVC** en el backend, con una estructura de paquetes *Feature-Based* (por dominio de negocio).

```text
[ Frontend React (Vercel) ] 
       │ (HTTP / JSON + JWT)
       ▼
[ API REST Spring Boot (Render) ] ──► [ PostgreSQL (Neon) ]
       │
       └──► [ Google Gemini API ] ──► [ Respuestas Chat RAG ]
```

---

## Cómo ejecutar este proyecto en local

### 1. Requisitos previos
* Java 21 (JDK)
* PostgreSQL (Local o en Neon)
* Maven (ya incluido con el `mvnw`)
* Una API Key de Google Gemini (puedes obtener una gratis en Google AI Studio).

### 2. Variables de Entorno requeridas
Por seguridad, las credenciales no están en el código. Debes configurar las siguientes variables de entorno (en tu IDE o en el archivo `.env`):

| Variable | Descripción                                                                   |
| :--- |:------------------------------------------------------------------------------|
| `DATABASE_URL` | URL de conexión JDBC a PostgreSQL (ej. `jdbc:postgresql://localhost:5432/erp-travel-db`) |
| `DATABASE_USERNAME` | Usuario de PostgreSQL                                                         |
| `DATABASE_PASSWORD` | Contraseña de PostgreSQL                                                      |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT (mínimo 32 caracteres)               |
| `GEMINI_API_KEY` | API Key de Google AI Studio para el Chat RAG                                  |

### 3. Pasos para arrancar
1. Clona el repositorio:
   ```bash
   git clone [https://github.com/tu-usuario/sysmart-travel-backend.git](https://github.com/tu-usuario/sysmart-travel-backend.git)
   ```
2. Abre el proyecto en IntelliJ IDEA.
3. Configura las variables de entorno en la pestaña de **Edit Configurations** de IntelliJ o directamente en tu `application.properties` para pruebas locales.
4. Ejecuta la aplicación con `./mvnw spring-boot:run` o haz clic en el botón **Play** de `ErpApplication`.
5. Abre la documentación Swagger en: `http://localhost:8080/swagger-ui.html`

---

## Seguridad

* **JWT (JSON Web Tokens):** Sesiones stateless.
* **BCrypt:** Encriptación de contraseñas.
* **Role-Based Access Control (RBAC):** Roles predefinidos (`ADMIN`, `VENDEDOR`, `OPERADOR`).

---

## Autor

**Adrian**
* [GitHub](https://github.com/adrivng)
* [LinkedIn](https://www.linkedin.com/in/adriancarl31/)