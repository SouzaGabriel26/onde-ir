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
    'https://source.unsplash.com/400x300/?restaurant,barbecue',
    'Foto do ambiente interno'
),
(
    (SELECT id FROM places WHERE name = 'Pizzaria Sabor & Arte'),
    'https://source.unsplash.com/400x300/?pizza,restaurant',
    'Foto de uma pizza artesanal'
),
(
    (SELECT id FROM places WHERE name = 'Bar do João'),
    'https://source.unsplash.com/400x300/?bar,drinks',
    'Foto do bar e coquetéis'
),
(
    (SELECT id FROM places WHERE name = 'Cafeteria Aroma & Sabor'),
    'https://source.unsplash.com/400x300/?coffee,cafe',
    'Foto de um café sendo servido'
),
(
    (SELECT id FROM places WHERE name = 'Restaurante Comida Mineira'),
    'https://source.unsplash.com/400x300/?food,mineira',
    'Prato típico mineiro'
),
(
    (SELECT id FROM places WHERE name = 'Hamburgueria Black Beef'),
    'https://source.unsplash.com/400x300/?burger,fastfood',
    'Foto de um hambúrguer artesanal'
),
(
    (SELECT id FROM places WHERE name = 'Sorveteria Gelato & Cia'),
    'https://source.unsplash.com/400x300/?icecream,dessert',
    'Foto de um sorvete artesanal'
),
(
    (SELECT id FROM places WHERE name = 'Padaria Pão & Tradição'),
    'https://source.unsplash.com/400x300/?bakery,bread',
    'Foto de pães frescos'
),
(
    (SELECT id FROM places WHERE name = 'Churrascaria Gaúcha'),
    'https://source.unsplash.com/400x300/?barbecue,meat',
    'Foto do rodízio de carnes'
),
(
    (SELECT id FROM places WHERE name = 'Cantina Italiana La Pasta'),
    'https://source.unsplash.com/400x300/?pasta,italian',
    'Foto de um prato de macarrão'
),
(
    (SELECT id FROM places WHERE name = 'Doceria Doce Encanto'),
    'https://source.unsplash.com/400x300/?cake,dessert',
    'Foto de um bolo decorado'
),
(
    (SELECT id FROM places WHERE name = 'Bar e Petiscaria Maré Alta'),
    'https://source.unsplash.com/400x300/?beach,bar',
    'Foto do bar à beira-mar'
),
(
    (SELECT id FROM places WHERE name = 'Restaurante Vegano Vida Verde'),
    'https://source.unsplash.com/400x300/?vegan,healthy',
    'Foto de um prato vegano'
),
(
    (SELECT id FROM places WHERE name = 'Café Colonial Delícias da Serra'),
    'https://source.unsplash.com/400x300/?breakfast,coffee',
    'Foto do café colonial'
),
(
    (SELECT id FROM places WHERE name = 'Pastelaria do Zé'),
    'https://source.unsplash.com/400x300/?pastel,food',
    'Foto de pastéis crocantes'
),
(
    (SELECT id FROM places WHERE name = 'Espetaria Sabor do Churrasco'),
    'https://source.unsplash.com/400x300/?skewers,grill',
    'Foto dos espetinhos no carvão'
);
