const { useState } = React;

const SUPABASE_URL = 'https://zjqkeyecaoaecxrxyzad.supabase.co';

const SUPABASE_ANON_KEY = 'sb_publishable_T8I2EiMPiTO6OGQhWhmqpA_2EsnMTYd';

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("SUPABASE OK", supabase);

function App() {
  return React.createElement(
    'div',
    {
      style: {
        color: 'white',
        background: 'black',
        minHeight: '100vh',
        padding: '40px'
      }
    },
    'APP FUNCIONANDO'
  );
}

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(React.createElement(App));