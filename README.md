# SysMart Travel 
**ERP Inteligente para Agencias Mayoristas de Viajes**

SysMart Travel es una plataforma integral (B2B) diseñada para digitalizar y automatizar la operación de una agencia mayorista de turismo. Permite la gestión de agencias minoristas (clientes), proveedores (operadores), catálogo de paquetes, tarifas multimoneda y un flujo completo de cotizaciones y reservas.

Como valor agregado, integra un **Asistente Virtual con IA (Chat RAG)** que permite a los agentes de viajes consultar precios, disponibilidad, condiciones y destinos en lenguaje natural, agilizando la venta y atención al cliente.

> **Nota:** Este proyecto demuestra arquitectura de software, seguridad, despliegue en la nube e integración de Inteligencia Artificial en sistemas empresariales.

---

## 🛠️ Stack Tecnológico

### Backend
*   **Lenguaje:** Java 21 (LTS)
*   **Framework:** Spring Boot 4
*   **Persistencia:** Spring Data JPA / Hibernate
*   **Base de Datos:** PostgreSQL (Neon Serverless) + Extensión `pgvector`
*   **Migraciones:** Flyway
*   **Seguridad:** Spring Security + JWT (JSON Web Tokens)
*   **Validación:** Bean Validation
*   **Documentación:** SpringDoc OpenAPI (Swagger UI)

### Frontend
*   **Framework:** React.js (Vite)
*   **Lenguaje:** TypeScript / JavaScript
*   **Estilos:** Tailwind CSS / Bootstrap
*   **Despliegue:** Vercel

### Inteligencia Artificial (RAG)
*   **Framework:** Spring AI
*   **Modelo LLM:** OpenAI (GPT-4) / Google Gemini
*   **Base de Datos Vectorial:** PostgreSQL (`pgvector` en Neon)

### Infraestructura y DevOps
*   **Contenedores:** Docker
*   **Backend Cloud:** Render
*   **Base de Datos Cloud:** Neon

---

## 🏗️ Arquitectura del Sistema

El proyecto está construido bajo una arquitectura **desacoplada (Backend / Frontend)** y un patrón **MVC (Modelo-Vista-Controlador)** en el backend, con una estructura de paquetes *Feature-Based* (por dominio de negocio).

```text
[ Frontend React (Vercel) ] 
       │ (HTTP / JSON + JWT)
       ▼
[ API REST Spring Boot (Render) ] ──► [ PostgreSQL + pgvector (Neon) ]
       │
       └──► [ Spring AI ] ──► [ OpenAI / Gemini ]