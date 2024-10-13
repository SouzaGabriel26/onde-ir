WITH approved_places as (
	SELECT
    id,
    created_by as user_id,
    ROW_NUMBER() OVER() as row_num
  FROM
    places
  WHERE
    status = 'APPROVED'
)
INSERT INTO place_ratings
	(
    place_id,
    user_id,
    rating
	)
VALUES
	-- place created by admin: 1 like
	(
    (SELECT id FROM approved_places WHERE row_num = 1),
    (SELECT user_id FROM approved_places WHERE row_num = 1),
    (4)
  ),
  -- place created by user: 2 likes
  (
    (SELECT id FROM approved_places WHERE row_num = 2),
    (SELECT user_id FROM approved_places WHERE row_num = 2),
    (5)
  ),
  (
    (SELECT id FROM approved_places WHERE row_num = 2),
    (SELECT user_id FROM approved_places WHERE row_num = 1),
    (2)
  );
