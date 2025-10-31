// test-connection.js
import { Client } from 'pg';

// NOTA: Quitamos 'sslmode=require' de la URL.
const connectionString =
  'postgresql://postgres.rzwatbwqtelwhxlcqcvg:DeliveriExpress123@aws-1-us-east-2.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString: connectionString,
  // Aquí configuramos el SSL de forma explícita y limpia
  ssl: {
    rejectUnauthorized: false,
  },
});

client
  .connect()
  .then(() => {
    console.log('✅ ¡Conexión a Supabase (Session Pooler) exitosa!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('⏰ Hora actual del servidor:', res.rows[0].now);
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
  })
  .finally(() => {
    client.end();
  });
