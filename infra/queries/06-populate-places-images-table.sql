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
  ),
  (
    (SELECT id FROM places WHERE name = 'Churrascaria Espeto de Ouro'),
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Foto do ambiente interno'
),
(
    (SELECT id FROM places WHERE name = 'Pizzaria Sabor & Arte'),
    'https://images.unsplash.com/photo-1613946069412-38f7f1ff0b65?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Foto de uma pizza artesanal'
),
(
    (SELECT id FROM places WHERE name = 'Bar do João'),
    'https://plus.unsplash.com/premium_photo-1661539313494-e59ea8eb62a3?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Foto do bar e coquetéis'
),
(
    (SELECT id FROM places WHERE name = 'Cafeteria Aroma & Sabor'),
    'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Foto de um café sendo servido'
),
(
    (SELECT id FROM places WHERE name = 'Restaurante Comida Mineira'),
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Prato típico mineiro'
),
(
    (SELECT id FROM places WHERE name = 'Hamburgueria Black Beef'),
    'https://plus.unsplash.com/premium_photo-1670984940156-c7f833fe8397?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Foto de um hambúrguer artesanal'
),
(
    (SELECT id FROM places WHERE name = 'Sorveteria Gelato & Cia'),
    'https://images.unsplash.com/photo-1517334266-b25264dbe6f3?q=80&w=1937&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Foto de um sorvete artesanal'
),
(
    (SELECT id FROM places WHERE name = 'Padaria Pão & Tradição'),
    'https://images.unsplash.com/photo-1597271479259-1c6bd2bfcf21?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Foto de pães frescos'
),
(
    (SELECT id FROM places WHERE name = 'Churrascaria Gaúcha'),
    'https://plus.unsplash.com/premium_photo-1675884331509-f301e600e798?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Foto do rodízio de carnes'
),
(
    (SELECT id FROM places WHERE name = 'Cantina Italiana La Pasta'),
    'https://images.unsplash.com/photo-1517713982677-4b66332f98de?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Foto de um prato de macarrão'
),
(
    (SELECT id FROM places WHERE name = 'Doceria Doce Encanto'),
    'https://plus.unsplash.com/premium_photo-1670984940113-f3aa1cd1309a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Foto de um bolo decorado'
),
(
    (SELECT id FROM places WHERE name = 'Bar e Petiscaria Maré Alta'),
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Foto do bar à beira-mar'
),
(
    (SELECT id FROM places WHERE name = 'Restaurante Vegano Vida Verde'),
    'https://images.unsplash.com/photo-1567667778211-b19f5a4e1efe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Foto de um prato vegano'
),
(
    (SELECT id FROM places WHERE name = 'Café Colonial Delícias da Serra'),
    'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Foto do café colonial'
),
(
    (SELECT id FROM places WHERE name = 'Pastelaria do Zé'),
    'https://plus.unsplash.com/premium_photo-1671394138398-fe1ce5e5b03b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Foto de pastéis crocantes'
),
(
    (SELECT id FROM places WHERE name = 'Pizzaria do Zé'),
    'https://plus.unsplash.com/premium_photo-1671394138398-fe1ce5e5b03b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Foto de pastéis crocantes'
),
(
    (SELECT id FROM places WHERE name = 'Espetaria Sabor do Churrasco'),
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Foto dos espetinhos no carvão'
);
