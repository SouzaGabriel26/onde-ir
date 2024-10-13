INSERT INTO place_comments
	(
    place_id,
    user_id,
    parent_comment_id,
    description
  )
VALUES
	(
    (SELECT id FROM places WHERE status = 'APPROVED' AND name = 'Churrascaria Espeto de Ouro'),
    (SELECT id FROM users WHERE name = 'Admin user'),
    NULL,
    'Achei interessante este local, frequento bastante!'
  ),
  (
    (SELECT id FROM places WHERE status = 'APPROVED' AND name = 'Café Bamboo'),
    (SELECT id from users WHERE name = 'Normal user'),
    NULL,
    'Um ótimo café'
  );
