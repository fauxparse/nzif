SELECT owners.user_id, "cast".activity_id, "cast".activity_type
FROM (
	SELECT
		profiles.user_id AS user_id,
		profiles.id AS profile_id
	FROM
		profiles
	UNION ALL
	SELECT
		ownerships.user_id,
		ownerships.profile_id
	FROM
		ownerships
) owners
JOIN "cast" ON "cast".profile_id = owners.profile_id
WHERE user_id IS NOT NULL
