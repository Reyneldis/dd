import fetch from 'node-fetch';

(async () => {
  const userId = 'test-id'; // Reemplaza con un ID válido o prueba con uno inválido
  const response = await fetch(
    `http://localhost:3000/api/dashboard/users/${userId}`,
  );

  if (!response.ok) {
    console.error('Error:', await response.json());
  } else {
    console.log('Success:', await response.json());
  }
})();
