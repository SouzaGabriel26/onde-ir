DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE ROLES AS ENUM ('ADMIN', 'USER');

CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT users_pkey PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  user_name VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_role ROLES DEFAULT('USER'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_password_tokens (
  user_id UUID NOT NULL,
  reset_token VARCHAR(255) NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT reset_password_tokens_pkey PRIMARY KEY (user_id, reset_token),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE restaurants (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT restaurants_pkey PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  address VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  approved BOOLEAN DEFAULT FALSE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE restaurant_images (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT restaurant_images_pkey PRIMARY KEY,
  restaurant_id UUID NOT NULL,
  url VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

CREATE TABLE restaurant_likes (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT restaurant_likes_pkey PRIMARY KEY,
  restaurant_id UUID NOT NULL,
  user_id UUID NOT NULL,

  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE (restaurant_id, user_id)
);

CREATE TABLE restaurant_comments (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT restaurant_comments_pkey PRIMARY KEY,
  restaurant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  parent_comment_id UUID,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parent_comment_id) REFERENCES restaurant_comments(id)
);

CREATE TABLE restaurant_comment_likes (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT restaurant_comment_likes_pkey PRIMARY KEY,
  comment_id UUID NOT NULL,
  user_id UUID NOT NULL,

  FOREIGN KEY (comment_id) REFERENCES restaurant_comments(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE (comment_id, user_id)
);
