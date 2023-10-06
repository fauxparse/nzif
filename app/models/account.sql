SELECT *, total_cents - paid_cents AS outstanding_cents
FROM (
	SELECT
    registrations.id AS id,
		registrations.id AS registration_id,
		placements_count,
		(7000 * placements_count) - (placements_count * (placements_count - 1) / 2) * 500 AS total_cents,
		COALESCE(SUM(payments.amount_cents), 0) AS paid_cents
	FROM registrations
	LEFT OUTER JOIN payments ON payments.registration_id = registrations.id AND payments. "state" = 'approved'
  WHERE completed_at IS NOT NULL
  GROUP BY registrations.id
) inner_query
