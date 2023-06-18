SELECT
  sessions.festival_id as festival_id,
  sessions.starts_at as starts_at,
  sessions.ends_at as ends_at
FROM sessions
GROUP BY sessions.festival_id, sessions.starts_at, sessions.ends_at
ORDER BY sessions.starts_at
