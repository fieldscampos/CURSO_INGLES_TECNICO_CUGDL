# 📋 Actualizar Tabla de Pre-registros con Campos de Horario

## 🎯 Objetivo

Agregar dos nuevos campos a la tabla `pre_registrations` en Supabase:
- `preferred_days` → Preferencia de días (Entre semana, Fin de semana, o ambos)
- `preferred_schedule` → Preferencia de horario (Tarde, Noche, o ambos)

## 📝 Cambios Realizados

### 1. **Backend - Schema Pydantic** ✅
Archivo: `/backend/app/registrations/schemas.py`

```python
class PreRegistrationIn(BaseModel):
    # ... campos anteriores ...
    preferred_days: str = Field(..., pattern="^(weekdays|weekend|both)$")
    preferred_schedule: str = Field(..., pattern="^(afternoon|evening|both)$")
    # ... campos posteriores ...
```

**Valores válidos:**
- `preferred_days`: `"weekdays"`, `"weekend"`, `"both"`
- `preferred_schedule`: `"afternoon"`, `"evening"`, `"both"`

### 2. **Frontend - Componente del Formulario** ✅
Archivo: `/frontend/src/pages/PreRegistrationPage.jsx`

**Campos agregados:**
- Sección 4: "¿Qué días tienes preferencia/disponibilidad?"
  - Radio buttons: Entre semana, Fin de semana, Ambos
- Sección 4: "¿En qué horario prefieres que se impartan las sesiones?"
  - Radio buttons: Tarde, Noche, Ambos

**Estado del formulario:**
```javascript
formData.preferredDays     // 'weekdays' | 'weekend' | 'both'
formData.preferredSchedule // 'afternoon' | 'evening' | 'both'
```

### 3. **Base de Datos - Migración SQL** ⏳ (PENDIENTE)

Archivo: `/database/migrations/pre_registrations_add_schedule.sql`

## 🚀 Próximos Pasos

### PASO 1: Ejecutar la Migración SQL en Supabase

1. **Abre Supabase Dashboard**
   - URL: https://supabase.com/dashboard/projects
   - Selecciona tu proyecto

2. **Ve a SQL Editor**
   - Left sidebar → SQL Editor
   - Click en "New query"

3. **Copia y pega el contenido de la migración**
   - Abre: `/database/migrations/pre_registrations_add_schedule.sql`
   - Copia TODO el contenido
   - Pégalo en Supabase SQL Editor

4. **Ejecuta la migración**
   - Click en botón "Run" o presiona Ctrl+Enter
   - Deberías ver: "Success" con la tabla actualizada

5. **Verifica la estructura**
   - La query final debería mostrar las nuevas columnas:
     - `preferred_days` (text)
     - `preferred_schedule` (text)

### PASO 2: Verificar que el Backend Recibe los Datos

El backend ya está actualizado y validará:

```python
# Si envías:
{
  "preferred_days": "weekdays",
  "preferred_schedule": "afternoon"
}

# El backend validará automáticamente:
# ✅ Que sean valores válidos
# ✅ Que no sean vacíos
# ✅ Que cumplan el patrón de validación
```

### PASO 3: Probar el Formulario

1. **Inicia el frontend**
   ```bash
   cd frontend && npm run dev
   ```

2. **Abre el navegador**
   - http://localhost:5173

3. **Ve al formulario de pre-registro**
   - Click en "Iniciar Pre-Registro"

4. **Llena el formulario normalmente**
   - Verás dos nuevas preguntas en la Sección 4:
     - "¿Qué días tienes preferencia/disponibilidad para asistir al curso?"
     - "¿En qué horario prefieres que se impartan las sesiones?"

5. **Selecciona opciones y envía**
   - El formulario debería enviar los datos correctamente
   - Verás el mensaje de éxito

## 📊 Estructura de Datos

### Valores en la Base de Datos

| Campo | Valores Posibles |
|-------|-----------------|
| `preferred_days` | `'weekdays'` (Entre semana), `'weekend'` (Fin de semana), `'both'` (Ambos) |
| `preferred_schedule` | `'afternoon'` (Tarde), `'evening'` (Noche), `'both'` (Ambos) |

### Ejemplo de Registro Completo

```json
{
  "id": "uuid-aquí",
  "full_name": "Juan Pérez",
  "student_code": "12345678",
  "institutional_email": "juan@alumnos.udg.mx",
  "career": "Ciberseguridad",
  "semester": "3ro",
  "programming_level": "Básico",
  "python_experience": false,
  "operating_system": "Windows",
  "has_laptop": true,
  "preferred_days": "weekdays",           // 👈 Nuevo
  "preferred_schedule": "evening",         // 👈 Nuevo
  "motivation": "Quiero aprender Python...",
  "attendance_commitment": true,
  "payment_option": "payment",
  "scholarship_reason": null,
  "created_at": "2024-05-06T00:00:00Z",
  "updated_at": "2024-05-06T00:00:00Z"
}
```

## ✅ Verificación

### Checklist de Completitud

- [x] Backend actualizado con nuevos campos
- [x] Frontend con nuevas secciones de formulario
- [x] Validaciones en el formulario
- [x] Schema Pydantic con patrones de validación
- [x] Migración SQL preparada
- [ ] Migración SQL ejecutada en Supabase (🏃 PENDIENTE)
- [ ] Formulario probado end-to-end

### Comandos para Verificar

**Después de ejecutar la migración en Supabase:**

```sql
-- Ver estructura de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pre_registrations'
ORDER BY ordinal_position;

-- Contar registros con los nuevos campos
SELECT COUNT(*) as total_registrations
FROM pre_registrations
WHERE preferred_days IS NOT NULL
AND preferred_schedule IS NOT NULL;
```

## 🐛 Troubleshooting

### Error: "column does not exist"

**Solución:** La migración SQL no se ha ejecutado en Supabase. Sigue el PASO 1 anterior.

### Error: "invalid pattern"

**Causa:** Valores inválidos enviados (ej: typo en "weekdya" en lugar de "weekdays")

**Solución:** El formulario valida automáticamente con radio buttons, así que no debería ocurrir desde la UI.

### Los campos no aparecen en el formulario

**Causa:** Caché del navegador

**Solución:**
```bash
# En la terminal
npm run dev
# Presiona Ctrl+Shift+R en el navegador para limpiar caché
```

## 📚 Documentación Relacionada

- [PRE_REGISTRO_FORMATO.md](./PRE_REGISTRO_FORMATO.md) - Especificación completa del formulario
- [pre_registrations_add_schedule.sql](../database/migrations/pre_registrations_add_schedule.sql) - Migración SQL
- [PreRegistrationPage.jsx](../frontend/src/pages/PreRegistrationPage.jsx) - Componente del formulario
- [schemas.py](../backend/app/registrations/schemas.py) - Schema de validación

## 📞 Preguntas Frecuentes

**P: ¿Puedo cambiar los valores después de crear el campo?**
R: Sí, los valores son text strings. Si necesitas cambiarlos, puedes actualizar la migración.

**P: ¿Se afectan los registros existentes?**
R: No. Los registros existentes tendrán `NULL` en los nuevos campos, que es válido.

**P: ¿Necesito hacer backup antes?**
R: Supabase mantiene backups automáticos. Pero si prefieres, puedes exportar los datos desde la UI.

---

**Status:** 🟡 Parcialmente completado
**Última actualización:** 2024-05-06
**Siguientes pasos:** Ejecutar migración SQL en Supabase
