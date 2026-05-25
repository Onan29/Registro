const { useState } = React;

const SUPABASE_URL = 'https://zjqkeyecaoaecxrxyzad.supabase.co';

const SUPABASE_ANON_KEY = 'sb_publishable_T8I2EiMPiTO6OGQhWhmqpA_2EsnMTYd';

const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("SUPABASE OK", client);

function App() {
  return React.createElement(
    'div',
    {
      style: {
        background: 'black',
        color: 'white',
        minHeight: '100vh',
        padding: '40px',
        fontSize: '32px'
      }
    },
    'FUNCIONANDO'
  );
}

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(React.createElement(App));