# SysMart Travel - Backend API

API REST para un ERP B2B destinado a agencias mayoristas de viajes. Centraliza la gestión de agencias minoristas, operadores, catálogo de paquetes, promociones, cotizaciones y provee un asistente conversacional basado en modelos de lenguaje y búsqueda vectorial.

El repositorio contiene exclusivamente el backend. El frontend (React + TypeScript) se desarrolla en un proyecto independiente.

---

## Stack tecnológico

| Capa | Tecnología | Versión / detalle |
| :--- | :--- | :--- |
| Lenguaje | Java | 21 (LTS) |
| Framework | Spring Boot | 4.1.2 |
| Web | Spring MVC (starter-webmvc) | Incluido en Boot 4 |
| Persistencia | Spring Data JPA / Hibernate | Mapeo ORM y repositorios |
| Base de datos | PostgreSQL (Neon Serverless) | Driver oficial en scope runtime |
| Migraciones | Flyway | V1 a V9 en `db/migration` |
| Seguridad | Spring Security + JJWT | 0.12.7, tokens HS256 stateless |
| Validación | Bean Validation (Jakarta) | Anotaciones en DTOs de entrada |
| Documentación | SpringDoc OpenAPI | 3.2.0, Swagger UI |
| Búsqueda vectorial | pgvector (extensión de PostgreSQL) | `vector(768)`, operador `<->` |
| IA | Google Gemini API | `gemini-3.1-flash-lite` y `text-embedding-004` |
| Utilidades | Lombok | Reducción de código boilerplate |
| Build | Maven Wrapper (`mvnw`) | Sin instalación previa de Maven |

---

## Arquitectura

Diseño desacoplado backend/frontend y patrón MVC dentro del servicio. La organización de paquetes es *feature-based*: cada dominio de negocio agrupa su controlador, DTOs, modelo, repositorio y servicio.

```text
[ React / TypeScript ]  --HTTP/JSON-->  [ API REST Spring Boot ]
                                             |        |
                                     JPA/Hibernate   JdbcTemplate
                                             |        |
                                      [ PostgreSQL ] [pgvector]
                                             |
                                      [ Google Gemini API ]
```

Estructura de paquetes:

```text
net.mayorista.erp
├── configuracion        # SecurityConfig, OpenApiConfig
├── seguridad            # Autenticación, JWT, usuarios y roles
│   ├── controller
│   ├── dto
│   ├── model
│   ├── repository
│   └── service
├── maestros
│   ├── agencia
│   ├── operador
│   ├── moneda
│   ├── destino
│   └── promocion
├── productos.paquete
├── ventas.cotizacion
└── ia                   # Chat con Gemini e indexación vectorial
```

Cada feature sigue el flujo `Controller -> Service -> Repository`, con DTOs separados para peticiones y respuestas.

---

## Dominios implementados

| Dominio | Responsabilidad |
| :--- | :--- |
| Seguridad | Registro, login, emisión y validación de JWT, modelo de usuarios y roles |
| Agencias | Alta y consulta de agencias minoristas clientes |
| Operadores | Gestión de proveedores/operadores turísticos |
| Monedas | Catálogo multimoneda |
| Destinos | Catálogo de destinos |
| Promociones | Promociones vigentes y migración desde el sistema PHP legacy |
| Paquetes | Catálogo de paquetes con destino, precio e inclusiones |
| Cotizaciones | Armado y consulta de cotizaciones |
| IA | Generación de respuestas con Gemini e indexación de promociones en pgvector |

---

## Endpoints

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Autenticación y obtención de token JWT |
| GET | `/api/maestros/agencias` | Listado de agencias |
| POST | `/api/maestros/agencias` | Alta de agencia |
| GET | `/api/maestros/operadores` | Listado de operadores |
| POST | `/api/maestros/operadores` | Alta de operador |
| GET | `/api/maestros/monedas` | Listado de monedas |
| POST | `/api/maestros/monedas` | Alta de moneda |
| GET | `/api/maestros/destinos` | Listado de destinos |
| POST | `/api/maestros/destinos` | Alta de destino |
| POST | `/api/maestros/promociones/migrar-desde-php` | Importación de promociones legacy |
| GET | `/api/productos/paquetes` | Listado de paquetes |
| POST | `/api/productos/paquetes` | Alta de paquete |
| GET | `/api/ventas/cotizaciones` | Listado de cotizaciones |
| POST | `/api/ventas/cotizaciones` | Alta de cotización |
| POST | `/api/ia/chat` | Consulta en lenguaje natural al asistente con recuperación vectorial |
| POST | `/api/ia/vectores/indexar` | Indexación de promociones en pgvector |
| POST | `/api/ia/vectores/buscar` | Recuperación de promociones por similitud vectorial |

Documentación interactiva disponible en `/swagger-ui.html`.

---

## Configuración

La aplicación no almacena credenciales en el código. Lee los valores del entorno mediante placeholders en `application.properties`:

```properties
spring.config.import=optional:file:.env[.properties]
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
erp.jwt.secret=${JWT_SECRET}
gemini.api.key=${GEMINI_API_KEY}
server.port=${PORT:8080}
```

| Variable | Descripción |
| :--- | :--- |
| `DATABASE_URL` | URL JDBC completa, incluyendo `sslmode=require&stringtype=unspecified` |
| `DATABASE_USERNAME` | Usuario de PostgreSQL |
| `DATABASE_PASSWORD` | Contraseña de PostgreSQL |
| `JWT_SECRET` | Secreto de firma, mínimo 32 bytes; se usa directamente como bytes, sin decodificación Base64 |
| `GEMINI_API_KEY` | Credencial de Google AI Studio |
| `PORT` | Puerto HTTP; Render lo inyecta automáticamente, el valor local por defecto es 8080 |

### Decisiones técnicas de configuración

- `spring.jpa.hibernate.ddl-auto=validate`: Flyway es el único propietario del esquema; Hibernate solo verifica que las entidades coincidan con las tablas.
- `spring.flyway.baseline-on-migrate=true`: permite adoptar bases de datos preexistentes sin reconstruirlas.
- `stringtype=unspecified` en la URL JDBC: `VectorSqlService` enlaza el embedding como `String` y aplica el cast `?::vector`. Sin este parámetro, el driver PgJDBC envía el valor como `varchar` y PostgreSQL responde `cannot cast type character varying to vector`.
- Dimensionalidad `768`: coincide entre `text-embedding-004`, la columna `vector(768)` y la validación previa a cada inserción o consulta.
- La extensión `vector` y la tabla `vector_store` se crean mediante la migración `V10__vector_store.sql`, con sentencias idempotentes.
- Si la API de embeddings falla, `EmbeddingService` lanza una excepción en lugar de devolver un vector de ceros, evitando indexar datos inválidos.

Para trabajo local se recomienda un archivo `.env` en la raíz (ignorado por Git) con las variables anteriores. Opcionalmente se puede versionar un `.env.example` con las claves sin valores como plantilla.

---

## Ejecución local

### Requisitos

- JDK 21
- PostgreSQL local o instancia de Neon
- API key de Google AI Studio
- Maven Wrapper incluido en el repositorio

### Pasos

```bash
git clone https://github.com/adrivng/sysmart-travel-backend.git
cd sysmart-travel-backend
```

1. Crear el archivo `.env` en la raíz con las variables de la tabla anterior.
2. Alternativamente, cargar las mismas variables en *Run/Debug Configurations* de IntelliJ IDEA.
3. Ejecutar la aplicación:

```bash
./mvnw spring-boot:run
```

4. Acceder a Swagger UI en `http://localhost:8080/swagger-ui.html`.

Verificación rápida del entorno:

```bash
./mvnw test
```

La prueba `@SpringBootTest` valida el arranque del contexto, la ejecución de Flyway y la correspondencia entre entidades JPA y el esquema real.

---

## Despliegue

El `Dockerfile` define un build multi-stage: compilación con Maven sobre Temurin 21 y ejecución sobre una imagen JRE Alpine. Las variables se inyectan en tiempo de ejecución, por lo que ningún secreto queda grabado en la imagen.

En Render, registrar las variables de la sección de configuración en *Environment*. La plataforma define `PORT`, que la aplicación respeta mediante `${PORT:8080}`.

Flujo RAG vectorial:

1. `POST /api/ia/vectores/indexar` obtiene las promociones, genera un embedding por cada una con `text-embedding-004` y persiste el resultado en `vector_store`. La operación es atómica: primero se generan todos los embeddings y recién después se reemplaza el contenido de la tabla.
2. `POST /api/ia/chat` convierte la pregunta en un embedding, recupera las tres promociones más cercanas con el operador `<->` de pgvector y usa ese contexto, junto con el catálogo de paquetes, para generar la respuesta con Gemini.
3. `POST /api/ia/vectores/buscar` expone la recuperación por similitud de forma independiente, útil para verificar el funcionamiento del índice.

La indexación debe ejecutarse una vez después de arrancar y volver a ejecutarse cada vez que cambien las promociones.

---

## Seguridad

- Autenticación stateless con JWT firmado mediante JJWT y clave HMAC.
- Contraseñas hasheadas con BCrypt.
- Modelo de roles definido: `ADMIN`, `VENDEDOR` y `OPERADOR`.
- Validación de entrada con Bean Validation en los DTOs.

Estado actual: `SecurityConfig` mantiene temporalmente `permitAll` y el filtro `JwtAuthenticationFilter` permanece desactivado para facilitar las pruebas de desarrollo. La activación de la autorización por ruta está prevista como siguiente paso.

---

## Trabajo pendiente

- Activar `JwtAuthenticationFilter` y aplicar control de acceso por rol en los endpoints.
- Ampliar la cobertura de pruebas y exponer un endpoint de health check.
- Extender la indexación vectorial al catálogo de paquetes, que hoy se incorpora desde JPA.

---

## Autor

Adrian

GitHub: https://github.com/adrivng

LinkedIn: https://www.linkedin.com/in/adriancarl31/