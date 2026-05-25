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