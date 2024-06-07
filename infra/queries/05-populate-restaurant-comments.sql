INSERT INTO restaurant_comments
	(
    restaurant_id,
    user_id,
    parent_comment_id,
    description
  )
VALUES
	(
    (SELECT id FROM restaurants WHERE approved AND name = 'Churrascaria Espeto de Ouro'),
    (SELECT id FROM users WHERE name = 'Gabriel'),
    NULL,
    'Achei interessante este local, frequento bastante!'
  ),
  (
    (SELECT id FROM restaurants WHERE approved AND name = 'Moqueca Capixaba'),
    (SELECT id from users WHERE name = 'Jane Doe'),
    NULL,
    'Uma ótima moqueca capixaba'
  ),
  (
    (SELECT id FROM restaurants WHERE approved AND name = 'Esquina Mineira'),
    (SELECT id from users WHERE name = 'Jane Doe'),
    NULL,
    'Fui pela primeira vez neste ano de 2024. Gostei bastante, porém o atendimento é um pouco demorado.'
  )
