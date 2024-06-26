INSERT INTO place_images
	(
    place_id,
    url,
    description
  )
VALUES
	(
    (SELECT id FROM places WHERE name = 'Churrascaria Espeto de Ouro'),
    'https://github.com/SouzaGabriel26/onde-ir/blob/main/assets/photo-restaurant-01.jpg?raw=true',
    'Foto do ambiente interto'
  ),
  (
    (SELECT id FROM places WHERE name = 'Churrascaria Espeto de Ouro'),
    'https://github.com/SouzaGabriel26/onde-ir/blob/main/assets/photo-restaurant-02.jpg?raw=true',
    'Foto do ambiente externo'
  ),
  (
    (SELECT id FROM places WHERE name = 'Café Bamboo'),
    'https://github.com/SouzaGabriel26/onde-ir/blob/main/assets/photo-restaurant-03.jpg?raw=true',
    'Ambiente elegante e em contato com a natureza'
  ),
  (
    (SELECT id FROM places WHERE name = 'Bar do Gerson'),
    'https://github.com/SouzaGabriel26/onde-ir/blob/main/assets/photo-restaurant-04.jpg?raw=true',
    'Ambiente externo de frente para a praia'
  ),
  (
    (SELECT id FROM places WHERE name = 'Bar do Gerson'),
    'https://github.com/SouzaGabriel26/onde-ir/blob/main/assets/photo-restaurant-05.jpg?raw=true',
    'Ambiente interno exclusivo e elegante'
  );
