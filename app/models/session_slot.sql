WITH multi_slot_sessions AS (
  SELECT
    id AS session_id,
    festival_id,
    CASE
      WHEN
        activity_type = 'Workshop' AND ends_at - starts_at > INTERVAL '3' HOUR
        THEN
          ARRAY[starts_at, ends_at - INTERVAL '3' HOUR]
      ELSE
        ARRAY[starts_at]
    END AS starts_at,
    CASE
      WHEN
        activity_type = 'Workshop' AND ends_at - starts_at > INTERVAL '3' HOUR
        THEN
          ARRAY[starts_at + INTERVAL '3' HOUR, ends_at]
      ELSE
        ARRAY[ends_at]
    END AS ends_at
  FROM sessions
)

SELECT
  session_id,
  festival_id,
  UNNEST(starts_at) AS starts_at,
  UNNEST(ends_at) AS ends_at
FROM multi_slot_sessions
