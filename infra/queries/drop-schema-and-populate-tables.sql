DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE ROLES AS ENUM ('ADMIN', 'USER');
CREATE TYPE STATUS AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT users_pkey PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  user_name VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  user_role ROLES DEFAULT('USER'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE TABLE reset_password_tokens (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT reset_password_tokens_pkey PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  reset_token VARCHAR(255) NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE TABLE categories (
	id UUID DEFAULT uuid_generate_v4() CONSTRAINT categories_pkey PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE places (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT places_pkey PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  city VARCHAR(255) NOT NULL,
  street VARCHAR(255),
  num_place INTEGER,
  complement VARCHAR(255),
  description VARCHAR(255),
  category_id UUID NOT NULL REFERENCES categories(id),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  status STATUS DEFAULT('PENDING'),
  reviewed_by UUID REFERENCES users(id),
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

CREATE TABLE place_ratings (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT place_ratings_pkey PRIMARY KEY,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),

  UNIQUE (place_id, user_id)
);

CREATE TABLE place_comments (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT place_comments_pkey PRIMARY KEY,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES place_comments(id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE TABLE place_comment_likes (
  id UUID DEFAULT uuid_generate_v4() CONSTRAINT place_comment_likes_pkey PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES place_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),

  UNIQUE (comment_id, user_id)
);

-- Functions
CREATE FUNCTION update_comment_likes_count() RETURNS TRIGGER AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      UPDATE place_comments
      SET likes_count = likes_count + 1
      WHERE id = NEW.comment_id;
    END IF;

    IF TG_OP = 'DELETE' THEN
      UPDATE place_comments
      SET likes_count = likes_count - 1
      WHERE id = OLD.comment_id;
    END IF;

    RETURN NULL;
  END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE OR REPLACE TRIGGER update_comment_likes_count_trigger
AFTER INSERT OR DELETE ON place_comment_likes
FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();
