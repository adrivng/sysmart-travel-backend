# ERP Turístico

Backend de un **ERP vertical para agencias de viajes**, migrado desde un back-office PHP a **Java 21 + Spring Boot**. Cubre la operación del negocio: seguridad, maestros, reservas, liquidaciones y reportes.

> Proyecto de portafolio. El back-office PHP original se mantiene aparte y solo se usa como referencia.

## Stack

| Tecnología | Uso |
|---|---|
| Java 21 | Lenguaje |
| Spring Boot 4 | Framework base |
| Spring Web MVC | API REST |
| Spring Data JPA / Hibernate | Persistencia |
| PostgreSQL | Base de datos |
| Flyway | Migraciones versionadas |
| Spring Security + JWT (jjwt) | Autenticación y autorización |
| Bean Validation | Validación de datos |
| springdoc-openapi (Swagger UI) | Documentación de la API |
| Maven Wrapper | Build |

## Arquitectura

Monolito modular en capas:

```
Controller  ->  Service  ->  Repository  ->  Entity
      \            /
         DTO (records)
```

- `controller`: expone endpoints REST y valida la entrada.
- `service`: reglas de negocio y transacciones.
- `repository`: acceso a datos con Spring Data JPA.
- `entity`: modelo relacional.
- `dto`: contratos de entrada/salida (records).

## Módulos

Estado actual:

- [x] **Seguridad**: usuarios, roles, login JWT, CRUD de usuarios.
- [x] **Maestros**: ubigeo INEI (26 departamentos, 197 provincias, 1 709 distritos), operadores y hoteles.
- [ ] **Maestros avanzados**: empresas, agencias, sedes y agentes.
- [ ] **Reservas**: cabecera, detalle, pasajeros, extras, prepagos.
- [ ] **Liquidaciones**: vouchers, prepagos, resumen económico.
- [ ] **Reportes**: ventas, operadores, ejecutivos, agencias.
- [ ] **Lealtad / Metas**.

## Cómo ejecutarlo

### Requisitos

- Java 21
- PostgreSQL en `localhost:5432` con usuario `postgres`
- Base de datos `erp_travel` (UTF-8)

```sql
CREATE DATABASE erp_travel
    WITH ENCODING 'UTF8'
    TEMPLATE template0
    LC_COLLATE 'C'
    LC_CTYPE 'C';
```

### Arrancar

```powershell
.\mvnw.cmd spring-boot:run
```

Flyway crea las tablas y `DataInitializer` siembra los roles y el usuario administrador.

| Recurso | URL |
|---|---|
| UI (login) | http://localhost:8080/ |
| Panel de usuarios | http://localhost:8080/app.html |
| Maestros | http://localhost:8080/maestros.html |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| OpenAPI JSON | http://localhost:8080/v3/api-docs |

### Credenciales de demo

```
usuario:    admin
contraseña: admin123
```

## Endpoints de seguridad

| Método | Ruta | Descripción | Rol |
|---|---|---|---|
| POST | `/api/auth/login` | Obtiene el token JWT | público |
| GET | `/api/auth/me` | Datos del usuario autenticado | autenticado |
| GET | `/api/usuarios` | Lista usuarios | autenticado |
| GET | `/api/usuarios/{id}` | Obtiene un usuario | autenticado |
| GET | `/api/usuarios/roles` | Lista roles disponibles | autenticado |
| POST | `/api/usuarios` | Crea un usuario | ADMIN |
| PUT | `/api/usuarios/{id}` | Actualiza un usuario | ADMIN |
| DELETE | `/api/usuarios/{id}` | Elimina un usuario | ADMIN |

## Endpoints de maestros

| Método | Ruta | Descripción | Rol |
|---|---|---|---|
| GET | `/api/ubigeo/departamentos` | Lista departamentos | autenticado |
| GET | `/api/ubigeo/departamentos/{id}/provincias` | Provincias de un departamento | autenticado |
| GET | `/api/ubigeo/provincias/{id}/distritos` | Distritos de una provincia | autenticado |
| GET | `/api/operadores?q=` | Lista/busca operadores | autenticado |
| GET | `/api/operadores/{id}` | Obtiene un operador | autenticado |
| POST | `/api/operadores` | Crea un operador | ADMIN / OPERADOR |
| PUT | `/api/operadores/{id}` | Actualiza un operador | ADMIN / OPERADOR |
| DELETE | `/api/operadores/{id}` | Elimina un operador (si no tiene hoteles) | ADMIN / OPERADOR |
| GET | `/api/hoteles?q=` | Lista/busca hoteles | autenticado |
| GET | `/api/hoteles/{id}` | Obtiene un hotel | autenticado |
| POST | `/api/hoteles` | Crea un hotel | ADMIN / OPERADOR |
| PUT | `/api/hoteles/{id}` | Actualiza un hotel | ADMIN / OPERADOR |
| DELETE | `/api/hoteles/{id}` | Elimina un hotel | ADMIN / OPERADOR |

Ejemplo de login:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Luego envía el token en cada petición:

```
Authorization: Bearer <token>
```

## Modelo de seguridad

El back-office PHP usaba 27 columnas booleanas (`usu_modulo_1..27`) para permisos. Aquí se reemplazó por **RBAC limpio**:

```
rol (1) ──── (N) usuario
```

Roles base: `ADMIN`, `VENDEDOR`, `OPERADOR`.

## Respuestas de error

Formato uniforme para toda la API:

```json
{
  "status": 400,
  "mensaje": "Datos inválidos",
  "campos": {
    "email": "El correo no tiene un formato válido"
  }
}
```

## Estructura del proyecto

```
src/main/java/net/mayorista/erp
├── ErpApplication.java
├── comun/          errores uniformes de la API
├── config/         seguridad, OpenAPI y datos iniciales
├── seguridad/      usuarios, roles, JWT
└── maestros/       ubigeo, operadores y hoteles
```

## ¿Por qué JavaScript en la interfaz?

El **backend es 100 % Java**: recibe las peticiones, valida, aplica reglas de negocio, accede a PostgreSQL y responde JSON. Es la parte que se evalúa en un puesto backend.

La interfaz es una **capa separada** que consume esa API. Se usa JavaScript porque es el lenguaje que entiende el navegador. Hay dos formas válidas de resolverlo:

| Opción | Cómo funciona | Cuándo usarla |
|---|---|---|
| **API REST + JS** (la usada aquí) | Java expone `/api/...` y el navegador consume con `fetch` | Cuando habrá otros clientes (móvil, PWA) o se busca practicar APIs |
| **Thymeleaf / JSP** | Java genera el HTML en el servidor | Cuando solo hay web y se quiere evitar JS |

Si todo se hiciera "por Java" en el navegador, se necesitaría algo como Vaadin o JSF, que generan la UI desde Java pero añaden complejidad. Para el portafolio, **REST + JavaScript mínimo** demuestra mejor lo que pide una empresa: diseño de API, seguridad y persistencia en Java.

## Configuración

En `src/main/resources/application.properties`:

- `spring.datasource.*`: conexión a PostgreSQL.
- `spring.jpa.hibernate.ddl-auto=validate`: el esquema lo controla Flyway.
- `erp.jwt.secret` / `erp.jwt.expiracion-minutos`: configuración del token.

> En producción, el secreto JWT y las credenciales deben venir de variables de entorno.
