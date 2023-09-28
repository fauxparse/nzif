SELECT
	owners.user_id AS user_id,
	'User' AS user_type,
	casting.activity_id AS activity_id,
	casting.activity_type AS activity_type,
	casting.role AS ROLE,
	casting.session_id AS session_id
FROM
  (
		SELECT
			profiles.user_id AS user_id,
			profiles.id AS profile_id
		FROM profiles
		UNION ALL
		SELECT
			ownerships.user_id,
			ownerships.profile_id
		FROM ownerships
	) owners
JOIN
	(
		SELECT
			profile_id,
			sessions.activity_id,
			sessions.activity_type::text as activity_type,
			"role",
			sessions.id AS session_id
		FROM "cast"
		JOIN sessions
			ON "cast".activity_type = 'Activity' AND sessions.activity_id = "cast".activity_id
		UNION ALL
		SELECT
			"cast".profile_id AS profile_id,
			sessions.activity_id AS activity_id,
			sessions.activity_type::text AS activity_type,
			"cast"."role" AS "role",
			sessions.id AS session_id
		FROM "cast"
		JOIN sessions
			ON "cast".activity_type = 'Session' AND "cast".activity_id = sessions.id
	) casting
	ON casting.profile_id = owners.profile_id
WHERE user_id IS NOT NULL
