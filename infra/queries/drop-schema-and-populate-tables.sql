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
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE TABLE reset_password_tokens (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT reset_password_tokens_pkey PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  reset_token VARCHAR(255) NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE TABLE categories (
	id UUID DEFAULT uuid_generate_v4() CONSTRAINT categories_pkey PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE places (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT places_pkey PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  city VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  num_place INTEGER,
  complement VARCHAR(255),
  description VARCHAR(255),
  category_id UUID NOT NULL REFERENCES categories(id),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  approved BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES users(id),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE TABLE place_images (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT place_images_pkey PRIMARY KEY,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE TABLE place_likes (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT place_likes_pkey PRIMARY KEY,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  UNIQUE (place_id, user_id)
);

CREATE TABLE place_comments (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT place_comments_pkey PRIMARY KEY,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES place_comments(id) ON DELETE CASCADE,
  description VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE TABLE place_comment_likes (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT place_comment_likes_pkey PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES place_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  UNIQUE (comment_id, user_id)
);
