import { supabase } from "../lib/supabase";

/**
 * Script para actualizar el rol de un usuario a administrador
 * 
 * Este script realiza dos operaciones:
 * 1. Busca el usuario por su correo electrónico
 * 2. Actualiza su rol en la tabla user_roles a "admin"
 */
async function updateUserToAdmin(email: string) {
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

// Ejecutar la función con el email proporcionado
updateUserToAdmin("odavaloshdz@gmail.com")
  .then(result => {
    console.log(result.message);
    // Aquí podrías agregar código para mostrar un mensaje en la UI si lo necesitas
  }); 