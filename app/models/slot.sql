SELECT
  sessions.festival_id::text || '|' || sessions.starts_at || '|' || sessions.ends_at || '|' || sessions.activity_type AS id,
  sessions.festival_id as festival_id,
  sessions.starts_at as starts_at,
  sessions.ends_at as ends_at,
  sessions.activity_type as activity_type
FROM sessions
GROUP BY sessions.festival_id, sessions.starts_at, sessions.ends_at, sessions.activity_type
ORDER BY sessions.starts_at
