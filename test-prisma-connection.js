// test-connection.js
import { Client } from 'pg';

// La misma URL de tu .env.local
const connectionString =
  'postgresql://postgres.rzwatbwqtelwhxlcqcvg:DeliveriExpress123@aws-1-us-east-2.supabase.co:5432/postgres?sslmode=require';

const client = new Client({
  connectionString: connectionString,
});

client
  .connect()
  .then(() => {
    console.log('✅ ¡Conexión a Supabase exitosa!');
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
