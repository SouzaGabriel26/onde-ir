INSERT INTO places
  (
    name,
    country,
    street,
    city,
    state,
    num_place,
    complement,
    description,
    category_id,
    latitude,
    longitude,
    approved,
    approved_by,
    created_by
  )
VALUES
  (
    'Churrascaria Espeto de Ouro',
    'Brasil',
    'Av. Nossa Senhora da Penha',
    'Vitória',
    'ES',
    1234,
    NULL,
    'Deliciosa churrascaria com variedade de comidas.',
    (SELECT id FROM categories WHERE name = 'restaurantes'),
    -20.3155,
    -40.3128,
    TRUE,
    (SELECT id FROM users WHERE user_role = 'ADMIN' LIMIT 1),
    (SELECT id FROM users WHERE user_role = 'ADMIN' LIMIT 1)
  ),
  (
    'Café Bamboo',
    'Brasil',
    'R. do Lazer',
    'Vitória',
    'ES',
    404,
    'Em frente a padaria',
    'Um café incrivel que oferece vários sabores inexplicáveis',
    (SELECT id FROM categories WHERE name = 'restaurantes'),
    -20.3155,
    -40.2969,
    TRUE,
    (SELECT id FROM users WHERE user_role = 'ADMIN' LIMIT 1),
    (SELECT id FROM USERS WHERE user_role = 'USER' LIMIT 1)
  ),
  (
    'Bar do Gerson',
    'Brasil',
    'Av. Hugo Musso',
    'Vila Velha',
    'ES',
    505,
    NULL,
    'Bar muito conhecido por seu ambiente agradável e bebidas geladas',
    (SELECT id FROM categories WHERE name = 'restaurantes'),
    -20.3274,
    -40.2922,
    FALSE,
    NULL,
    (SELECT id FROM users WHERE user_role = 'USER' LIMIT 1)
  ),
  (
    'Pizzaria do Zé',
    'Brasil',
    'Av. Jerônimo Monteiro',
    'Vitória',
    'ES',
    1234,
    NULL,
    'Pizzaria com variedade de sabores e promoções',
    (SELECT id FROM categories WHERE name = 'restaurantes'),
    -20.3155,
    -40.3128,
    FALSE,
    NULL,
    (SELECT id FROM users WHERE user_role = 'USER' LIMIT 1)
  );
