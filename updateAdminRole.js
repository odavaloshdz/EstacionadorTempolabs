// Script para actualizar el rol de un usuario a administrador
// Ejecutar con: node updateAdminRole.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

// Configurar dotenv
dotenv.config();

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno manualmente si es necesario
let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Si no se encuentran en el entorno, intentar leerlas del archivo .env
if (!supabaseUrl || !supabaseServiceKey) {
  try {
    const envPath = resolve(__dirname, '.env');
    const envContent = readFileSync(envPath, 'utf8');
    const envVars = envContent.split('\n').reduce((acc, line) => {
      const match = line.match(/^(VITE_[A-Z_]+)=(.*)$/);
      if (match) {
        acc[match[1]] = match[2].replace(/["']/g, '');
      }
      return acc;
    }, {});
    
    supabaseUrl = supabaseUrl || envVars.VITE_SUPABASE_URL;
    supabaseServiceKey = supabaseServiceKey || envVars.VITE_SUPABASE_SERVICE_KEY || envVars.VITE_SUPABASE_ANON_KEY;
  } catch (error) {
    console.error('Error al leer el archivo .env:', error.message);
  }
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Se requieren las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_SERVICE_KEY');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Email del usuario a actualizar
const userEmail = 'odavaloshdz@gmail.com';

async function updateUserToAdmin(email) {
  try {
    console.log(`Buscando usuario con email: ${email}...`);
    
    // Paso 1: Obtener el ID del usuario desde la tabla de perfiles
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();
    
    if (profileError) {
      throw new Error(`Error al buscar el perfil: ${profileError.message}`);
    }
    
    if (!profileData) {
      throw new Error(`No se encontró ningún usuario con el email: ${email}`);
    }
    
    const userId = profileData.id;
    console.log(`Usuario encontrado con ID: ${userId}`);
    
    // Paso 2: Verificar si ya existe un registro en user_roles
    const { data: existingRole, error: roleCheckError } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    if (roleCheckError && roleCheckError.code !== "PGRST116") { // PGRST116 es "no se encontró ningún registro"
      throw new Error(`Error al verificar el rol existente: ${roleCheckError.message}`);
    }
    
    // Paso 3: Actualizar o insertar el rol según corresponda
    if (existingRole) {
      console.log(`Actualizando rol existente a admin para el usuario ${email}...`);
      
      const { error: updateError } = await supabase
        .from("user_roles")
        .update({ role: "admin" })
        .eq("user_id", userId);
      
      if (updateError) {
        throw new Error(`Error al actualizar el rol: ${updateError.message}`);
      }
    } else {
      console.log(`Creando nuevo rol admin para el usuario ${email}...`);
      
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert([
          {
            user_id: userId,
            role: "admin",
            created_at: new Date().toISOString()
          }
        ]);
      
      if (insertError) {
        throw new Error(`Error al insertar el rol: ${insertError.message}`);
      }
    }
    
    console.log(`¡Éxito! El usuario ${email} ahora tiene rol de administrador.`);
    return { success: true, message: `El usuario ${email} ahora tiene rol de administrador.` };
    
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, message: error.message };
  }
}

// Ejecutar la función
updateUserToAdmin(userEmail)
  .then(result => {
    console.log(result.message);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Error inesperado:', error);
    process.exit(1);
  }); 