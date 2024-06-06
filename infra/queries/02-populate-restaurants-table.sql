WITH user_ids AS (
  SELECT
    id,
    ROW_NUMBER() OVER () as row_num
  FROM users
)
INSERT INTO restaurants
  (
    name,
    address,
    description,
    latitude,
    longitude,
    approved,
    approved_by,
    created_by
  )
VALUES
  (
    'Churrascaria Espeto de Ouro',
    'Av. Nossa Senhora da Penha, 1234, Vitória, ES',
    'Delicious Brazilian barbecue with a variety of meats.',
    -20.3155,
    -40.3128,
    TRUE,
    (SELECT id FROM users WHERE user_role = 'ADMIN' LIMIT 1),
    (SELECT id FROM user_ids WHERE row_num = 1)
  ),
  (
    'Restaurante Sabor Capixaba',
    'R. do Comércio, 567, Vila Velha, ES',
    'Traditional Espírito Santo cuisine with a modern twist.',
    -20.3341,
    -40.2935,
    FALSE,
    NULL,
    (SELECT id FROM user_ids WHERE row_num = 1)
  ),
  (
    'Botequim Vix',
    'R. Aleixo Netto, 789, Vitória, ES',
    'A cozy place to enjoy Brazilian snacks and drinks.',
    -20.2976,
    -40.2958,
    FALSE,
    NULL,
    (SELECT id FROM user_ids WHERE row_num = 1)
  ),
  (
    'Moqueca Capixaba',
    'Av. Jerônimo Monteiro, 101, Serra, ES',
    'Specializing in the famous Moqueca Capixaba dish.',
    -20.1211,
    -40.3075,
    TRUE,
    (SELECT id FROM users WHERE user_role = 'ADMIN' LIMIT 1),
    (SELECT id FROM user_ids WHERE row_num = 2)
  ),
  (
    'Cantina Italiana',
    'R. Inácio Higino, 202, Vitória, ES',
    'Authentic Italian cuisine with a Brazilian flair.',
    -20.3155,
    -40.3058,
    FALSE,
    NULL,
    (SELECT id FROM user_ids WHERE row_num = 2)
  ),
  (
    'Pouso da Garça',
    'Estr. do Contorno, 303, Guarapari, ES',
    'Seafood restaurant with a beautiful seaside view.',
    -20.6500,
    -40.5090,
    FALSE,
    NULL,
    (SELECT id FROM user_ids WHERE row_num = 1)
  ),
  (
    'Café Bamboo',
    'R. do Lazer, 404, Vitória, ES',
    'A vibrant café offering a variety of Brazilian coffee blends.',
    -20.3155,
    -40.2969,
    FALSE,
    NULL,
    (SELECT id FROM user_ids WHERE row_num = 1)
  ),
  (
    'Bar do Gerson',
    'Av. Hugo Musso, 505, Vila Velha, ES',
    'Popular bar known for its lively atmosphere and cold beer.',
    -20.3274,
    -40.2922,
    FALSE,
    NULL,
    (SELECT id FROM user_ids WHERE row_num = 1)
  ),
  (
    'Pastelaria do João',
    'R. Henrique Moscoso, 606, Vitória, ES',
    'Best pastels in the city with a variety of fillings.',
    -20.3155,
    -40.3010,
    FALSE,
    NULL,
    (SELECT id FROM user_ids WHERE row_num = 1)
  ),
  (
    'Esquina Mineira',
    'Av. Carlos Lindenberg, 707, Cariacica, ES',
    'Traditional Minas Gerais cuisine in Espírito Santo.',
    -20.2630,
    -40.4166,
    TRUE,
    (SELECT id FROM users WHERE user_role = 'ADMIN' LIMIT 1),
    (SELECT id FROM user_ids WHERE row_num = 2)
  );
