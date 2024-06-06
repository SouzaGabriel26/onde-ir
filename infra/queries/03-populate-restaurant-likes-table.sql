WITH approved_restaurants as (
	SELECT
    id,
    created_by as user_id,
    ROW_NUMBER() OVER() as row_num
  FROM
    restaurants
  WHERE
    restaurants.approved
)
INSERT INTO restaurant_likes
	(
    restaurant_id,
    user_id
	)
VALUES
	-- restaurant created by user: 1 like
	(
    (SELECT id FROM approved_restaurants WHERE row_num = 1),
    (SELECT user_id FROM approved_restaurants WHERE row_num = 1)
  ),
  -- restaurant created by admin: 2 likes
  (
    (SELECT id FROM approved_restaurants WHERE row_num = 2),
    (SELECT user_id FROM approved_restaurants WHERE row_num = 2)
  ),
  (
    (SELECT id FROM approved_restaurants WHERE row_num = 2),
    (SELECT user_id FROM approved_restaurants WHERE row_num = 1)
  );
