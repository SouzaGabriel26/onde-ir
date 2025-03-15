-- Up Migration
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

-- Down Migration
DROP TRIGGER IF EXISTS update_comment_likes_count_trigger ON place_comment_likes;
DROP FUNCTION IF EXISTS update_comment_likes_count;
