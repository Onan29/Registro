const { useState } = React;

const SUPABASE_URL = 'https://zjqkeyecaoaecxrxyzad.supabase.co';

const SUPABASE_ANON_KEY = 'sb_publishable_T8I2EiMPiTO6OGQhWhmqpA_2EsnMTYd';

const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("SUPABASE OK", client);

async function testConnection() {

  const { data, error } = await client
    .from('usuarios')
    .select('*');

  console.log("DATA:", data);
  console.log("ERROR:", error);
}

testConnection();

function App() {
  return React.createElement(
    'div',
    {
      style: {
        background: 'black',
        color: 'white',
        minHeight: '100vh',
        padding: '40px'
      }
    },
    'Conectando a Supabase...'
  );
}

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(React.createElement(App));