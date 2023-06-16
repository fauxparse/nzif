SELECT
  sessions.festival_id::text || '|' || sessions.starts_at || '|' || sessions.ends_at || '|' || sessions.activity_type AS slot_id,
  sessions.activity_id AS activity_id,
  sessions.id AS session_id
FROM sessions
WHERE sessions.activity_id IS NOT NULL
