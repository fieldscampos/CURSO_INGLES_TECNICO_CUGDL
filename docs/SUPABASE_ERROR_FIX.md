# 🔧 Solución: Error "column student_code does not exist"

## ¿Qué pasó?

La tabla `pre_registrations` se creó **parcialmente**. Probablemente el SQL se interrumpió a mitad de la ejecución, dejando la tabla incompleta.

## ✅ SOLUCIÓN RÁPIDA (5 minutos)

### Paso 1: Eliminar tabla incompleta

En Supabase SQL Editor, ejecuta:

```sql
DROP TABLE IF EXISTS pre_registrations CASCADE;
```

Espera a que terminen los logs (debería decir "DROP TABLE").

### Paso 2: Crear tabla limpia

Copia **TODO** el contenido de:
```
/database/migrations/pre_registrations_table_v2.sql
```

Pégalo en Supabase SQL Editor y ejecuta.

Deberías ver al final:
```
table_name    | current_rows | created_at
--------------+--------------+------------------------
pre_registrations | 0       | 2026-05-05 22:50:18.924
```

✅ Si ves esto, ¡funcionó correctamente!

### Paso 3: Verifica en Table Editor

1. Ve a **Table Editor** en Supabase
2. Deberías ver `pre_registrations` en la lista
3. Click en ella
4. Deberías ver todas las columnas (full_name, student_code, etc.)

### Paso 4: Prueba el formulario

1. http://localhost:5173/preregistro
2. Llena el formulario
3. Submit
4. Verifica datos en Supabase Table Editor

---

## 🐛 Si aún hay error

### Opción A: Limpiar completamente

Ejecuta esto en SQL Editor (de una línea a la vez):

```sql
-- 1. Eliminar policies
DROP POLICY IF EXISTS "Allow public pre-registration insert" ON pre_registrations;
DROP POLICY IF EXISTS "Allow public pre-registration select" ON pre_registrations;

-- 2. Eliminar trigger
DROP TRIGGER IF EXISTS trigger_update_pre_registrations_updated_at ON pre_registrations;

-- 3. Eliminar función
DROP FUNCTION IF EXISTS update_pre_registrations_updated_at();

-- 4. Eliminar tabla
DROP TABLE IF EXISTS pre_registrations CASCADE;
```

Luego vuelve al **Paso 2** arriba.

### Opción B: Verificar tabla existente

```sql
-- Ver estructura de la tabla actual
\d pre_registrations;

-- O en Supabase:
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pre_registrations';
```

Si ves pocas columnas (menos de 15), la tabla está incompleta.

---

## 📋 Comparación: Tabla Correcta vs Incompleta

### ✅ CORRECTA (15 columnas)
```
- id
- full_name
- student_code
- institutional_email
- personal_email
- phone_whatsapp
- career
- semester
- programming_level
- python_experience
- operating_system
- has_laptop
- motivation
- attendance_commitment
- payment_option
- scholarship_reason
- created_at
- updated_at
```

### ❌ INCOMPLETA (ejemplo)
```
- id
- full_name
- (falta student_code y demás)
```

---

## 🎯 Pasos Finales

1. ✅ Ejecutar SQL limpio en Supabase
2. ✅ Verificar tabla en Table Editor
3. ✅ Reiniciar backends (si es necesario)
4. ✅ Probar formulario
5. ✅ Ver datos guardados

---

## 📞 Si persiste el error

1. Verifica que Supabase esté configurado correctamente
2. Comprueba que `.env` tenga `SUPABASE_URL` y `SUPABASE_KEY`
3. Prueba la conexión: `curl https://meyazdjyumdprexdhpxw.supabase.co`
4. Revisa los logs del backend

---

**¡Ese es todo!** Una vez completado, tendrás la tabla funcionando perfectamente. 🎉
