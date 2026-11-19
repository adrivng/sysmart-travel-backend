# SysMart Travel - Backend API

API REST para un ERP B2B destinado a agencias mayoristas de viajes. Centraliza la gestión de agencias minoristas, operadores, catálogo de paquetes, promociones y cotizaciones, y provee un asistente conversacional basado en recuperación vectorial (RAG) con Google Gemini.

El repositorio contiene exclusivamente el backend. El frontend (React + TypeScript) se desarrolla en un proyecto independiente.

---

## Stack tecnológico

| Capa | Tecnología | Versión / detalle |
| :--- | :--- | :--- |
| Lenguaje | Java | 21 (LTS) |
| Framework | Spring Boot | 4.1.2 |
| Web | Spring MVC (`spring-boot-starter-webmvc`) | Incluido en Boot 4 |
| Persistencia | Spring Data JPA / Hibernate | ORM y repositorios |
| Base de datos | PostgreSQL (Neon Serverless) | Driver oficial en scope runtime |
| Migraciones | Flyway | V1 a V11 en `db/migration` |
| Seguridad | Spring Security + JJWT | 0.12.7, JWT HS256 stateless, RBAC |
| Validación | Bean Validation (Jakarta) | Validación de DTOs de entrada |
| Documentación | SpringDoc OpenAPI | 3.2.0, Swagger UI |
| Observabilidad | Spring Boot Actuator | Health check (`/actuator/health`) |
| Búsqueda vectorial | pgvector (extensión de PostgreSQL) | `vector(768)`, operador `<->` |
| IA | Google Gemini API | `gemini-3.1-flash-lite` (chat) y `gemini-embedding-001` (embeddings) |
| Utilidades | Lombok | Reducción de código boilerplate |
| Build | Maven Wrapper (`mvnw`) | Sin instalación previa de Maven |

---

## Arquitectura

Diseño desacoplado backend/frontend y patrón MVC. La organización de paquetes es *feature-based*: cada dominio agrupa controlador, DTOs, modelo, repositorio y servicio.

```text
[ React / TypeScript ]  --HTTP/JSON + JWT-->  [ API REST Spring Boot ]
                                                    |        |
                                            JPA/Hibernate   JdbcTemplate
                                                    |        |
                                             [ PostgreSQL ] [ pgvector ]
                                                    |
                                             [ Google Gemini API ]
```

Estructura de paquetes:

```text
net.mayorista.erp
├── config               # SecurityConfig, OpenApiConfig
├── seguridad            # Autenticación, JWT, usuarios y roles
├── maestros
│   ├── agencia
│   ├── operador
│   ├── moneda
│   ├── destino
│   └── promocion        # Incluye migración desde endpoint PHP legacy
├── productos.paquete
├── ventas.cotizacion
└── ia                   # Embeddings, indexación vectorial y chat RAG
```

---

## Dominios implementados

| Dominio | Responsabilidad |
| :--- | :--- |
| Seguridad | Registro, login, emisión/validación de JWT, usuarios y roles (`ADMIN`, `OPERADOR`, `VENDEDOR`) |
| Agencias | Gestión de agencias minoristas clientes |
| Operadores | Gestión de proveedores/operadores turísticos |
| Monedas | Catálogo multimoneda |
| Destinos | Catálogo de destinos |
| Promociones | Promociones vigentes e importación desde el endpoint PHP legacy |
| Paquetes | Catálogo de paquetes con destino, duración, precios e inclusiones |
| Cotizaciones | Gestión de cotizaciones |
| IA | Indexación vectorial de promociones y paquetes, búsqueda por similitud y chat con contexto RAG |

---

## Seguridad y control de acceso

- Autenticación stateless con JWT firmado mediante JJWT (HMAC).
- Contraseñas almacenadas con BCrypt.
- `JwtAuthenticationFilter` activo en la cadena de filtros.
- Autorización por rol en los endpoints (`ROLE_ADMIN`, `ROLE_OPERADOR`, `ROLE_VENDEDOR`).
- Swagger UI configurado con esquema `bearerAuth` para probar endpoints protegidos.

### Matriz de acceso

| Alcance | Reglas |
| :--- | :--- |
| Público | `/api/auth/**`, `/swagger-ui.html`, `/swagger-ui/**`, `/v3/api-docs/**`, `/actuator/health/**` |
| `ADMIN`, `OPERADOR` | `POST /api/ia/vectores/indexar`, `POST /api/maestros/promociones/migrar-desde-php`, `POST /api/maestros/**`, `POST /api/productos/**` |
| `ADMIN`, `VENDEDOR` | `POST /api/ventas/**` |
| Cualquier usuario autenticado | `GET /api/**`, `POST /api/ia/chat`, `POST /api/ia/vectores/buscar` |
| `ADMIN` | Cualquier otra operación sobre `/api/**` |

El registro público (`POST /api/auth/register`) crea usuarios con rol `VENDEDOR`. La base de datos inicializa los roles `ADMIN`, `VENDEDOR` y `OPERADOR` mediante migraciones Flyway.

---

## Endpoints

| Método | Ruta | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Registro de usuario (rol `VENDEDOR`) | Público |
| POST | `/api/auth/login` | Autenticación y emisión de token JWT | Público |
| GET | `/api/maestros/agencias` | Listado de agencias | Autenticado |
| POST | `/api/maestros/agencias` | Alta de agencia | `ADMIN`, `OPERADOR` |
| GET | `/api/maestros/operadores` | Listado de operadores | Autenticado |
| POST | `/api/maestros/operadores` | Alta de operador | `ADMIN`, `OPERADOR` |
| GET | `/api/maestros/monedas` | Listado de monedas | Autenticado |
| POST | `/api/maestros/monedas` | Alta de moneda | `ADMIN`, `OPERADOR` |
| GET | `/api/maestros/destinos` | Listado de destinos | Autenticado |
| POST | `/api/maestros/destinos` | Alta de destino | `ADMIN`, `OPERADOR` |
| POST | `/api/maestros/promociones/migrar-desde-php` | Importación de promociones desde endpoint PHP legacy | `ADMIN`, `OPERADOR` |
| GET | `/api/productos/paquetes` | Listado de paquetes | Autenticado |
| POST | `/api/productos/paquetes` | Alta de paquete | `ADMIN`, `OPERADOR` |
| GET | `/api/ventas/cotizaciones` | Listado de cotizaciones | Autenticado |
| POST | `/api/ventas/cotizaciones` | Alta de cotización | `ADMIN`, `VENDEDOR` |
| POST | `/api/ia/chat` | Consulta en lenguaje natural con contexto RAG | Autenticado |
| POST | `/api/ia/vectores/indexar` | Indexación vectorial de promociones y paquetes | `ADMIN`, `OPERADOR` |
| POST | `/api/ia/vectores/buscar` | Búsqueda de contexto por similitud vectorial | Autenticado |
| GET | `/actuator/health` | Estado de salud de la aplicación | Público |

Documentación interactiva: `/swagger-ui.html`.

---

## Indexación vectorial y RAG

### Flujo

1. `POST /api/ia/vectores/indexar` recopila promociones y paquetes desde la base de datos, construye un documento textual por registro y genera embeddings con `gemini-embedding-001` (`outputDimensionality=768`).
2. Los embeddings se generan mediante `batchEmbedContents` en lotes de 50 solicitudes por llamada, con reintentos ante respuestas `429` (cuota por minuto del plan gratuito). Las llamadas HTTP a Gemini se realizan fuera de la transacción de base de datos.
3. Una vez generados y validados todos los vectores, se reemplaza el contenido de `vector_store` en una transacción corta (`TRUNCATE` + inserción por lotes), evitando pérdida del índice anterior si falla la generación.
4. `POST /api/ia/chat` convierte la pregunta en un embedding, recupera los fragmentos más cercanos con el operador `<->` de pgvector y envía ese contexto a `gemini-3.1-flash-lite` para generar la respuesta.
5. `POST /api/ia/vectores/buscar` expone la recuperación por similitud de forma independiente para verificación del índice.

La indexación debe ejecutarse después de cargar o modificar promociones/paquetes (por ejemplo, tras `POST /api/maestros/promociones/migrar-desde-php`).

### Correcciones aplicadas al flujo de embeddings

- **Modelo de embeddings:** se migró de `text-embedding-004` (no disponible para la clave utilizada) a `gemini-embedding-001`, solicitando explícitamente `outputDimensionality=768` para mantener compatibilidad con la columna `vector(768)`.
- **Límite de cuota (429):** el indexado secuencial (una solicitud por documento) excedía el límite de 100 solicitudes/minuto del plan gratuito. Se implementó `batchEmbedContents` en lotes y reintentos con espera ante `429`.
- **Consistencia transaccional:** la generación de embeddings se separó de la persistencia; el índice solo se reemplaza cuando todos los vectores fueron generados y validados.
- **Validación:** se verifica la cantidad y dimensionalidad de los embeddings; ante errores de la API no se insertan vectores inválidos.

---

## Configuración

La aplicación lee la configuración sensible desde el entorno. En local puede cargarse desde un archivo `.env` en la raíz (ignorado por Git) gracias a `spring.config.import=optional:file:.env[.properties]`.

```properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
erp.jwt.secret=${JWT_SECRET}
gemini.api.key=${GEMINI_API_KEY}
server.port=${PORT:8080}
```

| Variable | Descripción |
| :--- | :--- |
| `DATABASE_URL` | URL JDBC de PostgreSQL, incluyendo `sslmode=require&stringtype=unspecified` |
| `DATABASE_USERNAME` | Usuario de la base de datos |
| `DATABASE_PASSWORD` | Contraseña de la base de datos |
| `JWT_SECRET` | Secreto de firma JWT (mínimo 32 bytes) |
| `GEMINI_API_KEY` | Clave de Google AI Studio |
| `PORT` | Puerto HTTP (Render lo inyecta; por defecto 8080) |

Decisiones relevantes:

- `spring.jpa.hibernate.ddl-auto=validate`: Flyway es la fuente de verdad del esquema.
- `spring.flyway.baseline-on-migrate=true`: permite adoptar bases existentes.
- `stringtype=unspecified` en la URL JDBC: necesario para enviar parámetros como `?::vector` mediante PgJDBC.
- Migración `V10__vector_store.sql`: crea la extensión `vector` y la tabla `vector_store` de forma idempotente.
- Migración `V11__seed_roles.sql`: asegura la existencia de los roles `VENDEDOR` y `OPERADOR`.

---

## Ejecución local

### Requisitos

- JDK 21
- PostgreSQL o instancia de Neon
- Clave de API de Google AI Studio
- Maven Wrapper incluido (`mvnw` / `mvnw.cmd`)

### Pasos

```bash
git clone https://github.com/adrivng/sysmart-travel-backend.git
cd sysmart-travel-backend
```

1. Crear un archivo `.env` en la raíz con las variables indicadas.
2. Iniciar la aplicación:

```bash
./mvnw spring-boot:run
```

3. Acceder a Swagger UI: `http://localhost:8080/swagger-ui.html`.
4. Autenticarse con `POST /api/auth/login` (o registrar un usuario) y usar el botón **Authorize** con el token Bearer.
5. Si es necesario, importar promociones desde el endpoint PHP legacy (`POST /api/maestros/promociones/migrar-desde-php`) y luego ejecutar `POST /api/ia/vectores/indexar`.

### Pruebas

```bash
./mvnw test
```

Las pruebas automatizadas incluyen:

- Validación del contexto de aplicación, migraciones Flyway y correspondencia JPA/esquema (`@SpringBootTest`).
- Pruebas unitarias de generación y validación de JWT (`JwtServiceTest`).
- Pruebas de integración de seguridad y disponibilidad: health check público, login público, rechazo de acceso no autenticado a endpoints protegidos (`ApiSecurityIntegrationTest`).

Además, se realizaron pruebas funcionales consumiendo el endpoint PHP legacy de promociones (`POST /api/maestros/promociones/migrar-desde-php`), seguidas de la indexación vectorial y consultas al chat/búsqueda para validar el flujo RAG de extremo a extremo.

---

## Despliegue en Render

- Build multi-stage definido en `Dockerfile` (Maven + Temurin 21 para compilación, JRE Alpine para ejecución).
- Las variables de entorno se configuran en *Environment* del servicio de Render; no se incluyen en la imagen ni en el repositorio.
- La aplicación respeta `PORT` inyectado por la plataforma.
- Después de cada despliegue, ejecutar `POST /api/ia/vectores/indexar` si el contenido de promociones/paquetes cambió o si el índice debe regenerarse.

---

## Mejoras futuras

- Endpoints de actualización y eliminación (PUT/DELETE) con reglas de autorización específicas por recurso.
- Cobertura de pruebas adicional para controladores y servicios de negocio con datos de prueba aislados.
- Reindexación automática ante cambios en promociones/paquetes.
- Métricas y observabilidad extendida mediante Actuator.

---

## Autor

Adrian

- GitHub: https://github.com/adrivng
- LinkedIn: https://www.linkedin.com/in/adriancarl31/
