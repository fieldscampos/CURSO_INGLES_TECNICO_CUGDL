# Plan: Sistema de Pagos y Verificación

## Problemática
Los estudiantes pre-registrados necesitan un flujo de pago integrado donde puedan:
1. Elegir entre dos métodos de pago (banco con referencia o transferencia)
2. Subir comprobante(s) de pago
3. Ser verificados manualmente por el admin

El admin necesita una plataforma simple para revisar documentos y confirmar pagos.

## Propuesta
- **Nueva página:** `/pagina-pago` - Flujo completo de pago para estudiantes
- **Panel Admin:** `/admin/pagos` (protegido con login) - Revisión y confirmación de comprobantes
- **Base de datos:** Nueva tabla `payment_records` con estados y archivos
- **Almacenamiento:** Supabase Storage para captura/PDF de comprobantes
- **Autenticación admin:** Sistema simple basado en variables de entorno (usuario/contraseña)

---

## Arquitectura de Base de Datos

### Tabla: `payment_methods` (datos del banco - configuración estática)
```
Almacena info de cuenta bancaria y datos de contacto del inscriptor.
Única fila con toda la información necesaria para ambos métodos.
```
**Campos:**
- `id` UUID (PK)
- `bank_name` TEXT - Nombre del banco
- `account_holder` TEXT - Titular de cuenta
- `account_number` TEXT - Número de cuenta
- `clabe` TEXT - CLABE interbancario
- `phone` TEXT - Teléfono de contacto
- `reference_pdf_path` TEXT - Path en Supabase Storage del PDF estático
- `created_at` TIMESTAMP
- `updated_at` TIMESTAMP

### Tabla: `payment_records` (comprobantes por estudiante)
```
Vincula cada pre-registro con sus intentos de pago y estado de verificación.
```
**Campos:**
- `id` UUID (PK)
- `pre_registration_id` UUID (FK → pre_registrations)
- `institutional_email` TEXT - Email institucional para verificación
- `payment_method` ENUM ('bank_reference', 'bank_transfer') - Método elegido
- `status` ENUM ('draft', 'pending', 'verified', 'rejected', 'completed') - Estado del flujo
- `rejection_reason` TEXT - Si status='rejected', motivo de rechazo
- `verified_by` TEXT - Email del admin que verificó
- `verified_at` TIMESTAMP - Fecha de verificación
- `created_at` TIMESTAMP
- `updated_at` TIMESTAMP

**Índices:** pre_registration_id, institutional_email, status, created_at

### Tabla: `payment_files` (comprobantes/documentos múltiples)
```
Registro de múltiples archivos por payment_record.
Permite reintentos con nuevas imágenes/PDFs si fue rechazado.
```
**Campos:**
- `id` UUID (PK)
- `payment_record_id` UUID (FK → payment_records)
- `file_name` TEXT - Nombre original del archivo
- `file_path` TEXT - Path en Supabase Storage
- `file_type` ENUM ('screenshot', 'pdf', 'receipt') - Tipo de comprobante
- `file_size_kb` INTEGER - Tamaño en KB
- `uploaded_at` TIMESTAMP
- `is_primary` BOOLEAN DEFAULT false - Marcar archivo principal

**Índices:** payment_record_id, uploaded_at

---

## Flujo de Funcionalidad

### 1️⃣ Estudiante - Página `/pagina-pago`

**Pantalla 1: Seleccionar Método de Pago**
- Radio buttons: "Pago por Banco (Referencia)" | "Transferencia Bancaria"
- Mostrar info del banco (titularidad, CLABE, teléfono)
- Botón "Descargar PDF de Referencia" (descarga PDF estático desde Supabase Storage)

**Pantalla 2: Upload de Comprobante**
- Ingreso de email institucional (validar que existe en pre_registrations)
- Drag & drop área para múltiples archivos
- Aceptar: PNG, JPG, PDF (máx 5MB cada uno)
- Mostrar preview de imágenes
- Botón "Enviar Comprobante(s)"

**Pantalla 3: Confirmación**
- Mensaje: "Comprobante enviado. Tu pago será verificado en máx 24-48hrs."
- Mostrar email donde recibirá confirmación
- Link a `/tracking-pago` para revisar estado (opcional inicial)

### 2️⃣ Admin - Panel `/admin/pagos`

**Pantalla: Login Básico**
- Usuario + Contraseña (contra env vars: ADMIN_USERNAME, ADMIN_PASSWORD)
- Persiste sesión en localStorage (o cookies seguras)

**Pantalla: Dashboard de Pagos**

*Filtros:*
- Status: Draft | Pending | Verified | Rejected | Completed
- Fecha rango
- Búsqueda por email institucional
- Búsqueda por email de pre-registro

*Tabla/Grid de pagos:*
```
| Email Institucional | Nombre | Método | Status | Archivos | Acciones |
| user@udg.mx        | Juan   | Bank   | Pending| 2 archivos| [Ver]    |
```

*Pantalla de Revisión (modal/página):*
- **Datos del registro:**
  - Nombre completo, email institucional, método de pago
  - Fecha de envío, intentos previos

- **Galería de comprobantes:**
  - Thumbnails de imágenes
  - Previsualización al hacer click (modal o viewer)
  - Info: tamaño, tipo, fecha de carga

- **Acciones:**
  - [✅ Verificar Pago] → status = 'verified', genera notificación
  - [❌ Rechazar] → status = 'rejected', campo de motivo (ej. "Referencia no legible")
  - [💾 Guardar Borrador] → para revisar después

- **Notificaciones:**
  - Al verificar/rechazar, enviar email al estudiante
  - Si rechazado: indicar motivo e invitar a resubir

---

## Componentes a Crear

### Frontend (`/frontend/src`)

1. **pages/PaymentPage.jsx**
   - Componente principal con wizard de 3 pasos
   - Integración con Supabase Storage para upload
   - Manejo de errores y validación

2. **pages/AdminPaymentDashboard.jsx**
   - Login modal
   - Tabla de pagos con filtros
   - Modal de revisión de comprobantes
   - Galería de imágenes responsive

3. **components/AdminLoginModal.jsx**
   - Form simple de usuario/contraseña
   - Validación contra backend

4. **components/PaymentMethodSelector.jsx**
   - Radio buttons + info del banco
   - Descarga PDF desde Storage

5. **components/PaymentFileUpload.jsx**
   - Drag & drop file input
   - Preview de archivos
   - Validación de tipos/tamaño

6. **styles/payment.css**
   - Estilos del flujo de pago
   - Galería de imágenes responsive
   - Modal de revisión

### Backend (`/backend/app`)

1. **registrations/payment_schemas.py**
   - `PaymentMethodDataOut` - Info del banco
   - `PaymentRecordIn` - Submit comprobante
   - `PaymentRecordOut` - Estado del pago
   - `AdminLoginRequest`, `AdminLoginResponse`

2. **registrations/payment_routes.py**
   - `GET /payments/bank-info` - Obtener datos del banco
   - `POST /payments/upload` - Subir comprobante(s)
   - `GET /payments/status/{email}` - Consultar estado (estudiante)
   - `POST /admin/login` - Autenticación admin
   - `GET /admin/payments` - Listar pagos con filtros
   - `PUT /admin/payments/{id}/verify` - Verificar pago
   - `PUT /admin/payments/{id}/reject` - Rechazar + motivo
   - `GET /admin/payments/{id}/files` - Listar archivos de un pago

3. **email_service.py** (NEW)
   - `send_payment_verification_email()` - Confirma pago verificado
   - `send_payment_rejection_email()` - Notifica rechazo con motivo
   - Templates en HTML

### Database Migrations

1. **migration: create_payment_tables.sql**
   - Crear `payment_methods` (insertar 1 fila)
   - Crear `payment_records` (con RLS)
   - Crear `payment_files` (con RLS)
   - Índices y constraints
   - Políticas RLS (INSERT público, SELECT solo admin)

---

## Configuración de Supabase Storage

**Bucket:** `payment-receipts` (privado)
- Permitir acceso PUBLIC para INSERT (estudiantes suben)
- Generar URLs con expiración temporal para descargas

**Rutas:**
```
/payment-receipts/
  ├── reference-pdfs/
  │   └── referencia-banco-2026.pdf (estático)
  └── receipts/
      ├── {payment_record_id}/
      │   ├── imagen1.png
      │   ├── imagen2.jpg
      │   └── documento.pdf
```

---

## Variables de Entorno

**Backend (.env):**
```
# Admin auth
ADMIN_USERNAME=<usuario>
ADMIN_PASSWORD=<contraseña_hasheada>

# Email service (si usamos SMTP)
SMTP_SERVER=<server>
SMTP_PORT=587
SMTP_USER=<email>
SMTP_PASSWORD=<password>
```

**Frontend (.env):**
```
VITE_SUPABASE_URL=<url>
VITE_SUPABASE_ANON_KEY=<key>
```

---

## Flujo Técnico Resumido

1. **Estudiante entra a `/pagina-pago`**
   - Carga `GET /payments/bank-info` (muestra datos bancarios)
   - Selecciona método y descarga PDF si lo necesita

2. **Estudiante sube comprobante(s)**
   - Upload a Supabase Storage (cliente directo si SAS token, o backend intermediario)
   - Crea `payment_record` (status='draft') en BD
   - Crea múltiples `payment_files` (uno por archivo)
   - Status cambia automáticamente a 'pending' cuando termina upload
   - Confirmación: "Enviado, espera revisión"

3. **Admin accede a `/admin/pagos`**
   - Login con usuario/contraseña
   - Token guardado en localStorage
   - Autenticación verificada en cada request GET `/admin/payments`

4. **Admin revisa comprobantes**
   - Click en fila → abre modal de revisión
   - Ve imágenes/PDFs en galería
   - Click [✅ Verificar] → status='verified', envía email
   - O Click [❌ Rechazar] → status='rejected', motivo guardado, envía email
   - Estudiante recibe notificación y puede resubir desde `/pagina-pago`

5. **Ciclo completo**
   - Status: draft → pending → verified/rejected → (si rejected) → draft (reintento)
   - Final: status='completed' cuando se marque como listo

---

## Consideraciones de Seguridad

- **RLS en `payment_records`** → INSERT público, SELECT solo admin + propia fila si es estudiante
- **RLS en `payment_files`** → Igual que payment_records
- **Admin auth → Token JWT simple O sesión con refresh** (sin OAuth, solo usuario/contraseña)
- **Validación de email institucional** → Debe estar registrado en pre_registrations
- **Almacenamiento de contraseña admin** → Hasheada con bcrypt en env
- **Auditoría** → Guardar `verified_by` y timestamp de cada acción

---

## Fases de Implementación

### Fase 1: Setup BD + Backend Base
- [ ] Crear tabla `payment_methods` (1 fila)
- [ ] Crear tabla `payment_records` con RLS
- [ ] Crear tabla `payment_files` con RLS
- [ ] Endpoint `GET /payments/bank-info`
- [ ] Schema Pydantic `PaymentMethodDataOut`

### Fase 2: Upload de Comprobantes (Backend)
- [ ] Endpoint `POST /payments/upload` con validación
- [ ] Integración Supabase Storage
- [ ] Crear `payment_record` + `payment_files`
- [ ] Schema Pydantic: `PaymentRecordIn`, `PaymentRecordOut`

### Fase 3: Frontend de Estudiante
- [ ] Componente `PaymentPage.jsx` (wizard 3 pasos)
- [ ] Integrar upload a Storage
- [ ] Formulario con email institucional + validación
- [ ] UI responsiva + mobile

### Fase 4: Backend Admin
- [ ] Endpoint `POST /admin/login`
- [ ] Endpoint `GET /admin/payments` con filtros
- [ ] Endpoint `PUT /admin/payments/{id}/verify`
- [ ] Endpoint `PUT /admin/payments/{id}/reject`
- [ ] Email service de notificaciones

### Fase 5: Frontend Admin
- [ ] Page `AdminPaymentDashboard.jsx`
- [ ] Login modal
- [ ] Tabla con filtros
- [ ] Modal de revisión + galería
- [ ] Acciones verificar/rechazar

### Fase 6: Refinamientos
- [ ] Tests end-to-end
- [ ] Validaciones robustas
- [ ] Manejo de errores
- [ ] Documentación

---

## Archivos Base para Referencia

- **PRE_REGISTRO_FORMATO.md** → Estructura de pre-registros (validar email)
- **REGISTRO_ACADEMIA_CUGDL.md** → Si aplica académicos a sistema de pagos
- **.env.example** → Documentar nuevas variables

---

## Notas Finales

- El sistema de pagos es **semi-automatizado**: upload de documentos sí, pero verificación manual del admin
- Diseño enfocado en **claridad y facilidad de revisión** para el admin
- Futura mejora: Integración real con pasarelas (Stripe, Mercado Pago) si se necesita
- Importante: **Backup de Storage** regularmente en Supabase
