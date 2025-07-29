WITH preferences AS (
  SELECT
    preferences.session_id,
    preferences.position,
    COUNT(preferences.id) AS count
  FROM
    preferences
  INNER JOIN sessions ON preferences.session_id = sessions.id
  GROUP BY
    preferences.session_id,
    preferences."position"
)

SELECT
  sessions.id,
  activities.name AS "name",
  sessions.festival_id,
  ARRAY_AGG(ARRAY[preferences.position, preferences."count"]) AS counts
FROM
  preferences
INNER JOIN sessions ON preferences.session_id = sessions.id
INNER JOIN activities ON sessions.activity_id = activities.id
GROUP BY activities.name, sessions.id, sessions.festival_id
