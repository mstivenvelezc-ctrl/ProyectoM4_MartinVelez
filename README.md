# MyTask — Gestor de Tareas

Aplicación web de gestión de tareas personales construida con React, TypeScript y Firebase. Permite crear, editar, completar y eliminar tareas con fechas de entrega, autenticación por correo/contraseña y Google, y envío de resúmenes por email mediante AWS SES.

**URL de producción:** https://proyecto-m4-martin-velez.vercel.app  
**Repositorio:** https://github.com/mstivenvelezc-ctrl/ProyectoM4_MartinVelez

---

## Descripción del proyecto

MyTask es un gestor de tareas que permite a cada usuario autenticado administrar su lista personal de tareas en tiempo real. Cada tarea tiene un título, descripción, fecha de entrega y un estado calculado automáticamente (`normal`, `prioridad`, `perdida`, `completada`). El estado se recalcula cada minuto en el cliente según la proximidad a la fecha de entrega.

Funcionalidades principales:

- Registro e inicio de sesión con email/contraseña o Google OAuth
- CRUD completo de tareas con sincronización en tiempo real vía Firestore
- Calendario visual de tareas por mes
- Envío de resumen de tareas al correo del usuario mediante AWS SES
- Sesión persistente en `localStorage` con expiración automática de 24 horas
- Rutas privadas protegidas por autenticación

---

## Estructura del proyecto

```
project-root/
├── src/
│   ├── styles/           # Archivos CSS por componente
│   ├── Routes/           # Router + rutas privadas (PrivateRoute, AuthProvider, AuthContext)
│   ├── Login.tsx         # Vista de inicio de sesión
│   ├── Register.tsx      # Vista de registro
│   ├── TaskHome.tsx      # Dashboard principal (perfil + calendario)
│   ├── tareas.tsx        # Vista de listado y gestión de tareas
│   ├── TaskCalendar.tsx  # Componente calendario
│   ├── UserCard.tsx      # Componente tarjeta de perfil
│   ├── EmailResumenBtn.tsx # Botón de envío de resumen
│   ├── useTareas.ts      # Hook principal de lógica de tareas
│   ├── Tareas.service.ts # Integración con Firestore (CRUD)
│   ├── Tareas.types.ts   # Tipos e interfaces (Tarea, EstadoTarea)
│   ├── Tareas.helpers.ts # Utilidades (calcularEstado, validarTarea, formatearFecha)
│   ├── email.service.ts  # Integración con el endpoint de email
│   ├── firebase.ts       # Configuración de Firebase (cliente)
│   └── googleAuth.ts     # Helper de autenticación con Google
├── api/
│   └── send-email.ts     # Vercel Serverless Function — envío de emails con AWS SES
├── tests/                # Unit tests + tests de componentes + mocks
├── .env                  # Variables locales (NO se sube)
├── .env.example          # Plantilla de variables (SÍ se sube)
├── vercel.json           # Configuración de Vercel (rewrites + headers de seguridad)
├── package.json
└── README.md
```

---

## Decisiones arquitectónicas

### Autenticación con contexto React
La sesión se maneja a través de `AuthContext` + `AuthProvider`, que expone `user`, `isAuthenticated`, `login` y `logout` a toda la app. El estado de sesión se persiste en `localStorage` con un timestamp de expiración de 24 horas. Al cargar la app se verifica que la sesión no haya expirado antes de restaurarla.

### Firestore como base de datos en tiempo real
Las tareas se almacenan en Firestore bajo la ruta `users/{correo}/tareas/{tareaId}`. Se usa `onSnapshot` para suscribirse a cambios en tiempo real, lo que permite que la lista de tareas se actualice automáticamente sin necesidad de refrescar la página.

### Estados de tarea calculados en el cliente
El estado de cada tarea (`normal`, `prioridad`, `perdida`, `completada`) se calcula en el cliente con la función `calcularEstado(fechaEntrega)` basándose en la proximidad a la fecha límite. Se recalcula cada 60 segundos con un `setInterval` para mantener los estados actualizados sin recargar.

### Separación de responsabilidades
- `useTareas.ts` maneja exclusivamente el estado UI y la lógica de interacción (modales, validaciones, feedback con SweetAlert2).
- `Tareas.service.ts` encapsula todas las operaciones con Firestore (crear, leer, actualizar, eliminar).
- `Tareas.helpers.ts` contiene funciones puras reutilizables (validar, calcular estado, formatear fechas).

### Serverless Function para emails
El envío de emails se delega a una Vercel Serverless Function (`api/send-email.ts`) que usa AWS SES. Esta función verifica el token de Firebase del usuario antes de procesar la solicitud, protegiendo el endpoint de uso no autorizado. Incluye rate limiting en memoria (5 solicitudes por minuto por IP).

### Rutas privadas con React Router
`PrivateRoute` envuelve todas las rutas autenticadas. Si `isAuthenticated` es `false`, redirige automáticamente a `/login`. Las rutas del dashboard viven bajo `/taskhome/*` y se manejan con un `TaskRouter` anidado.

### Headers de seguridad HTTP
`vercel.json` configura los siguientes headers en todas las respuestas:
- `Content-Security-Policy` — restringe orígenes permitidos para scripts, estilos, frames e imágenes
- `X-Frame-Options: SAMEORIGIN` — previene clickjacking
- `X-Content-Type-Options: nosniff` — previene MIME sniffing
- `Strict-Transport-Security` — fuerza HTTPS con preload
- `Referrer-Policy` y `Permissions-Policy`

---

## Instrucciones de instalación

### Requisitos previos
- Node.js 18+
- npm 9+
- Cuenta de Firebase con proyecto creado
- Cuenta de AWS con SES configurado (remitente verificado)

### Instalación local

```bash
# 1. Clonar el repositorio
git clone https://github.com/mstivenvelezc-ctrl/ProyectoM4_MartinVelez.git
cd ProyectoM4_MartinVelez

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno
cp .env.example .env
# Editar .env con tus valores reales

# 4. Iniciar en desarrollo
npm run dev
```

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo en `localhost:5173` |
| `npm run build` | Genera la build de producción en `/dist` |
| `npm run preview` | Previsualiza la build de producción localmente |
| `npm run test` | Corre los tests en modo watch con Vitest |
| `npm run test:run` | Corre los tests una sola vez |
| `npm run coverage` | Genera reporte de cobertura de código |

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables. Nunca subas este archivo al repositorio.

```env
# ─── Firebase (frontend — variables públicas de Vite) ────────────────────────
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# ─── AWS SES (backend — solo en Vercel, nunca en el frontend) ────────────────
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key_id
AWS_SECRET_ACCESS_KEY=tu_secret_access_key
AWS_SES_FROM_EMAIL=remitente_verificado@tudominio.com

# ─── Firebase Admin SDK (para verificar tokens en el servidor) ───────────────
# Obtener en: Firebase Console → Configuración → Cuentas de servicio → Generar clave privada
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
```

Las variables `VITE_*` son públicas y quedan expuestas en el bundle del cliente. Las variables de AWS y Firebase Admin son secretas y solo deben existir en el entorno del servidor (Vercel → Settings → Environment Variables).

---

## Flujo de envío de emails

El resumen de tareas se envía al correo del usuario autenticado siguiendo este flujo:

```
Usuario hace clic en "Enviar resumen"
        │
        ▼
email.service.ts
  └── Obtiene el ID token del usuario desde Firebase Auth (auth.currentUser.getIdToken())
  └── Construye el cuerpo del email con el resumen de tareas (estadísticas + detalle)
  └── Hace POST a /api/send-email con:
        - Header: Authorization: Bearer {idToken}
        - Body: { to, subject, body }
        │
        ▼
api/send-email.ts (Vercel Serverless Function)
  └── Verifica que el método sea POST
  └── Extrae el token del header Authorization
  └── Verifica el token con Firebase Admin SDK (getAuth().verifyIdToken(token))
      ├── Token inválido → 401 No autorizado
      └── Token válido → continúa
  └── Verifica rate limiting por IP (máx. 5 solicitudes/minuto)
      ├── Límite superado → 429 Too Many Requests
      └── OK → continúa
  └── Valida campos requeridos (to, subject, body) y formato de email
  └── Envía el email usando AWS SES (SendEmailCommand)
  └── Responde 200 { message: "Email enviado con éxito" }
        │
        ▼
Usuario recibe el email con:
  - Resumen estadístico (total, completadas, activas, prioridad, perdidas)
  - Detalle de cada tarea (título, estado, descripción, fecha de entrega)
```

---

## Integración de IA en el proceso de trabajo

### Cómo se integró

La IA (Claude) fue una herramienta activa durante todo el desarrollo del proyecto, no solo para escribir código sino para razonar sobre decisiones de arquitectura, detectar problemas y mejorar la calidad del código.

### Situaciones donde fue más efectiva

**Análisis de seguridad (ethical hacking):** La situación más valiosa fue pedirle a la IA que revisara el código fuente completo con ojos de seguridad. Detectó vulnerabilidades reales que no hubiera identificado fácilmente: el endpoint de email sin autenticación que cualquiera podía explotar, la sesión sin expiración en localStorage, el token fantasma `userToken` que era dead code, y la ausencia de headers HTTP de seguridad. Cada vulnerabilidad vino con una explicación clara del riesgo y el código exacto para corregirla.

**Depuración de Content Security Policy:** Configurar el CSP correctamente para que Firebase Auth funcionara fue un proceso iterativo. La IA analizó los errores de la consola en cada intento e identificó exactamente qué dominio faltaba en cada directiva. Sin esto, hubiera sido un proceso de prueba y error muy lento.

**Arquitectura de la capa de datos:** La separación entre `useTareas.ts` (estado UI), `Tareas.service.ts` (Firestore) y `Tareas.helpers.ts` (lógica pura) surgió de una conversación sobre cómo organizar el código de forma que fuera testeable. La IA explicó por qué las funciones puras son más fáciles de testear y propuso la separación que terminó implementándose.

**Generación de tests:** Para los unit tests de helpers y servicios, la IA generó los casos de prueba relevantes (incluyendo edge cases como tareas sin fecha, fechas pasadas, fechas en el futuro cercano) y explicó el patrón de mocking para Firestore.

### Patrones y buenas prácticas descubiertas

**Dar contexto completo antes de pedir código.** Compartir el código existente antes de pedir una corrección produce resultados mucho más precisos que describir el problema en abstracto. La IA puede ver exactamente qué hay y proponer cambios que encajan con el estilo del proyecto.

**Iterar en lugar de pedir todo de una vez.** Pedir "arregla la seguridad de mi app" produce respuestas genéricas. Pedir "revisa este archivo específico y dime si el endpoint tiene vulnerabilidades" produce análisis concreto y accionable.

**Pedir explicación junto con el código.** Cada corrección de seguridad vino con una explicación de por qué era una vulnerabilidad y qué ataque habilitaba. Esto convierte la asistencia en aprendizaje real, no solo en código copiado.

**Usar la IA como revisor antes de hacer push.** El flujo más efectivo fue: escribir el código, luego pedirle a la IA que lo revise antes de subir a producción. Detecta problemas que el linter no ve (lógica incorrecta, casos borde, implicaciones de seguridad).

**Verificar siempre en producción.** La IA puede generar código correcto que falla por razones del entorno (versiones, configuraciones de Vercel, caché del navegador). El ciclo correcto es: generar → desplegar → verificar → iterar, no asumir que el código generado funciona sin probarlo.