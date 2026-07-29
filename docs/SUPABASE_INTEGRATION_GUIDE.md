# Pre-Registro Curso Python - Guía de Integración Supabase

## ¿Qué se hizo?

Se actualizó el formulario de pre-registro con los campos especificados en `/docs/PRE_REGISTRO_FORMATO.md` y se creó la integración con Supabase para guardar los datos automáticamente.

### Cambios Realizados:

1. **Frontend (PreRegistrationPage.jsx)**
   - ✅ Actualizado con carreras correctas (Ciberseguridad, IA, Creatividad Digital, etc.)
   - ✅ Semestres: 1ro, 2do, 3ro, 4to (sin rangos)
   - ✅ Email institucional validado: @alumnos.udg.mx
   - ✅ Opciones de pago/beca con checkboxes
   - ✅ Validación completa en cliente
   - ✅ Integración con endpoint backend

2. **Backend (routes.py + schemas.py)**
   - ✅ Nuevo endpoint: `POST /api/registrations/pre-registro`
   - ✅ **SIN autenticación requerida** (público)
   - ✅ Valida todos los campos
   - ✅ Guarda en Supabase automáticamente
   - ✅ Error handling completo

3. **Database (Supabase)**
   - ✅ Migración SQL preparada: `/database/migrations/pre_registrations_table.sql`
   - ✅ Tabla con constraints y validaciones
   - ✅ RLS habilitado para seguridad
   - ✅ Índices para performance
   - ✅ Trigger para actualizar `updated_at`

---

## 🚀 Pasos para Activar la Integración

### Paso 1: Crear la Tabla en Supabase

1. Abre tu proyecto Supabase: https://supabase.com/dashboard
2. Ve a **SQL Editor**
3. Copia el contenido de: `/database/migrations/pre_registrations_table.sql`
4. Pégalo en el SQL Editor y ejecuta
5. Verifica que se haya creado correctamente (deberías ver "pre_registrations" en Tables)

### Paso 2: Verificar Variables de Entorno

Backend (`.env`):
```
SUPABASE_URL=https://meyazdjyumdprexdhpxw.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ Ya están configuradas

### Paso 3: Reiniciar el Backend

```bash
cd backend
python run_dev.py
```

Debería estar escuchando en `http://localhost:8000`

### Paso 4: Prueba del Formulario

1. Accede a: http://localhost:5173/preregistro
2. Llena el formulario con datos de prueba:
   - Nombre: Juan Pérez
   - Código: 12345
   - Email: juan@alumnos.udg.mx
   - Carrera: Ciberseguridad
   - Semestre: 1ro
   - Experiencia: Básico
   - Python: No
   - SO: Windows
   - Laptop: Sí
   - Motivación: Quiero aprender Python
   - Compromiso: ✓
   - Pago: Selecciona "Puedo pagar $100 MXN"

3. Submit
4. Deberías ver: "¡Pre-registro completado!"

### Paso 5: Verificar en Supabase

1. Ve a **Table Editor** en Supabase
2. Abre tabla `pre_registrations`
3. Deberías ver tu registro con todos los datos

---

## 📊 Estructura de Datos en Supabase

```sql
CREATE TABLE pre_registrations (
  id UUID PRIMARY KEY,
  full_name TEXT NOT NULL,
  student_code TEXT NOT NULL,
  institutional_email TEXT NOT NULL,
  personal_email TEXT,
  phone_whatsapp TEXT,
  career TEXT NOT NULL,
  semester TEXT NOT NULL,
  programming_level TEXT NOT NULL,
  python_experience BOOLEAN,
  operating_system TEXT NOT NULL,
  has_laptop BOOLEAN,
  motivation TEXT NOT NULL,
  attendance_commitment BOOLEAN,
  payment_option TEXT NOT NULL,
  scholarship_reason TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

---

## 🔒 Seguridad

- **RLS Habilitado**: La tabla tiene políticas de seguridad
- **Public INSERT**: Permite inserciones sin autenticación (pre-registro)
- **Validaciones en BD**: Constraints en email, payment_option, programming_level
- **sin_token**: El endpoint `/api/registrations/pre-registro` NO requiere JWT

---

## 🧪 Testing

### Test Local (sin Supabase):

```bash
# En otra terminal
cd frontend
npm run dev

# En otra terminal
cd backend
python run_dev.py
```

Luego accede a: http://localhost:5173/preregistro

### Ver Logs Backend:

```bash
# Los logs mostrarán:
# - "Pre-registration created: <uuid>"
# - Errores de validación
# - Problemas de conexión a Supabase
```

---

## 📝 Campos Guardados por Sección

### Sección 1: Información Personal
- `full_name` - Nombre completo
- `student_code` - Código estudiante (solo números)
- `institutional_email` - Email @alumnos.udg.mx
- `personal_email` - Email personal (opcional)
- `phone_whatsapp` - Teléfono/WhatsApp (opcional)

### Sección 2: Perfil Académico
- `career` - Carrera seleccionada
- `semester` - Semestre (1ro, 2do, 3ro, 4to)

### Sección 3: Perfil Técnico
- `programming_level` - Nulo/Básico/Intermedio/Avanzado
- `python_experience` - Booleano (Sí/No)
- `operating_system` - Windows/macOS/Linux

### Sección 4: Logística
- `has_laptop` - Booleano (Sí/No)
- `motivation` - Texto razón de inscripción
- `attendance_commitment` - Booleano (Sí/No)

### Sección 5: Pagos
- `payment_option` - "payment" o "scholarship"
- `scholarship_reason` - Texto razón de beca (si aplica)

---

## ✅ Checklist de Verificación

- [ ] Tabla `pre_registrations` creada en Supabase
- [ ] Backend corriendo en puerto 8000
- [ ] Frontend corriendo en puerto 5173
- [ ] Acceso a http://localhost:5173/preregistro
- [ ] Formulario se completa sin errores
- [ ] Se recibe "Pre-registro completado"
- [ ] Datos aparecen en Supabase > Table Editor
- [ ] Logs en backend muestran el ID guardado

---

## 🐛 Troubleshooting

### Error: "El servidor no está configurado"
- Verifica que `SUPABASE_URL` y `SUPABASE_KEY` estén en `.env`
- Reinicia el backend

### Error: "El email debe terminar en @alumnos.udg.mx"
- Usa un email con ese dominio en el formulario
- Ej: `nombre@alumnos.udg.mx`

### Datos no aparecen en Supabase
- Verifica los logs del backend
- Comprueba que la tabla existe
- Verifica que RLS esté habilitado (debería permitir inserts públicos)

### Error de conexión a Supabase
- Verifica que tu internet esté conectado
- Comprueba que Supabase esté operativo (status.supabase.com)
- Verifica las credenciales en `.env`

---

## 📬 Próximos Pasos

1. **Email de confirmación**: Integrar SendGrid o similar
2. **Admin Dashboard**: Crear vista para ver todos los registros
3. **Reportes**: Estadísticas de registros por carrera, semestre, etc.
4. **Exportar datos**: CSV/Excel con todos los registros

---

**¡Listo para usar!** 🎉
