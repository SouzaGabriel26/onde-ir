WITH approved_places as (
	SELECT
    id,
    created_by as user_id,
    ROW_NUMBER() OVER() as row_num
  FROM
    places
  WHERE
    approved
)
INSERT INTO place_likes
	(
    place_id,
    user_id
	)
VALUES
	-- place created by admin: 1 like
	(
    (SELECT id FROM approved_places WHERE row_num = 1),
    (SELECT user_id FROM approved_places WHERE row_num = 1)
  ),
  -- place created by user: 2 likes
  (
    (SELECT id FROM approved_places WHERE row_num = 2),
    (SELECT user_id FROM approved_places WHERE row_num = 2)
  ),
  (
    (SELECT id FROM approved_places WHERE row_num = 2),
    (SELECT user_id FROM approved_places WHERE row_num = 1)
  );
