const { useState } = React;

const SUPABASE_URL = 'https://zjqkeyecaoaecxrxyzad.supabase.co';

const SUPABASE_ANON_KEY = 'sb_publishable_T8I2EiMPiTO6OGQhWhmqpA_2EsnMTYd';

const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("SUPABASE OK", client);
function App() {

  async function guardarUsuario() {
    const { data, error } = await client
      .from('usuarios')
      .insert([
        {
          nombre: 'Onan',
          apellido: 'Torres',
          documento: '8-123-456',
          tipo_documento: 'cedula',
          correo: 'prueba3@gmail.com',
          fecha_nacimiento: '01/01/2000',
          foto_perfil: null,
          foto_documento: null
        }
      ]);

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if(error){
      alert("Error guardando");
      return;
    }

    alert("Usuario guardado correctamente");
  }

  return React.createElement(
    'div',
    { style:{background:'black', color:'white', minHeight:'100vh', padding:'40px'} },
    React.createElement(
      'button',
      { onClick: guardarUsuario, style:{padding:'15px 30px', fontSize:'20px', cursor:'pointer'} },
      'Guardar Usuario'
    )
  );
}

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(React.createElement(App));

