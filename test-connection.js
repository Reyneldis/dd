// test-connection.js
import { Client } from 'pg';

const connectionString =
  'postgresql://postgres.rzwatbwqtelwhxlcqcvg:DeliveriExpress123@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require';

const client = new Client({
  connectionString: connectionString,
  // ¡AÑADE ESTA OPCIÓN!
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
