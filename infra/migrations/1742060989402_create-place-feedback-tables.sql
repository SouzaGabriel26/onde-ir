-- Up Migration
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

-- Down Migration
DROP TABLE IF EXISTS place_comment_likes;
DROP TABLE IF EXISTS place_comments;
DROP TABLE IF EXISTS place_ratings;
