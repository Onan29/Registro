const { useState } = React;

const SUPABASE_URL = 'https://zjqkeyecaoaecxrxyzad.supabase.co';

const SUPABASE_ANON_KEY = 'sb_publishable_T8I2EiMPiTO6OGQhWhmqpA_2EsnMTYd';

const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("SUPABASE OK", client);

const { data, error } = await client
  .from('usuarios')
  .insert([
    {
      nombre: 'Onan',
      apellido: 'Torres',
      documento: '8-123-456',
      tipo_documento: 'cedula',
      correo: 'prueba2@gmail.com',
      fecha_nacimiento: '01/01/2000',
      foto_perfil: null,
      foto_documento: null
    }
  ]);