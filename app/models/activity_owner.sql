WITH casting AS (
  SELECT
    profile_id,
    sessions.activity_id,
    sessions.activity_type::text AS activity_type,
    "role",
    sessions.id AS session_id
  FROM "cast"
  INNER JOIN sessions
    ON
      "cast".activity_type = 'Activity'
      AND "cast".activity_id = sessions.activity_id
  UNION ALL
  SELECT
    "cast".profile_id AS profile_id,
    sessions.activity_id,
    sessions.activity_type::text AS activity_type,
    "cast"."role" AS "role",
    sessions.id AS session_id
  FROM "cast"
  INNER JOIN sessions
    ON "cast".activity_type = 'Session' AND "cast".activity_id = sessions.id
)
SELECT
  owners.user_id,
  'User' AS user_type,
  casting.activity_id,
  casting.activity_type,
  casting.role,
  casting.session_id
FROM
  (
    SELECT
      profiles.user_id,
      profiles.id AS profile_id
    FROM profiles
    UNION ALL
    SELECT
      ownerships.user_id,
      ownerships.profile_id
    FROM ownerships
  ) AS owners
INNER JOIN
  casting
  ON owners.profile_id = casting.profile_id
WHERE user_id IS NOT NULL
