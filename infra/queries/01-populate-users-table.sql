INSERT INTO users
	(
    email,
    name,
    user_name,
    user_role,
    password
  )
VALUES
	(
    'user@email.com',
    'Normal user',
    'normal_user',
    'USER',
    '$2b$10$Vtq78yo4RxbWPtARY6R7CO2vVeGu1Nd4XASIhxB/PylfTL1/Bf3TG'
  ),
  (
    'admin@email.com',
    'Admin user',
    'admin_user',
    'ADMIN',
    '$2b$10$Vtq78yo4RxbWPtARY6R7CO2vVeGu1Nd4XASIhxB/PylfTL1/Bf3TG'
  );

-- password: 123456
