SELECT
  "activities".id AS activity_id,
  NULL AS session_id,
  "cast".profile_id AS profile_id,
  "cast"."role" AS "role"
FROM
  "activities"
INNER JOIN
  "cast"
  ON "activities".id = "cast".activity_id AND "cast".activity_type = 'Activity'
UNION
SELECT
  "activities".id AS activity_id,
  "sessions".id AS session_id,
  "cast".profile_id AS profile_id,
  "cast"."role" AS "role"
FROM
  "activities"
INNER JOIN "sessions" ON "activities".id = "sessions".activity_id
INNER JOIN
  "cast"
  ON "sessions".id = "cast".activity_id AND "cast".activity_type = 'Session'
