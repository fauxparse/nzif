SELECT
  sessions.starts_at AS starts_at,
  sessions.id AS session_id
FROM sessions
WHERE sessions.activity_id IS NOT NULL
