WITH pricing AS (
  SELECT
    base.count,
    discounted.discountable,
    base.count * 7000 AS total,
    (
      discountable * (discountable - 1)) / 2 * 500 + GREATEST(
      0,
      base.count - discountable
    ) * 2000 AS discount
  FROM (
    SELECT
      GENERATE_SERIES(
        0,
        11
      ) AS count
  ) AS base,
    LATERAL (
      SELECT discounted.discountable
      FROM (
        SELECT
          GENERATE_SERIES(
            0,
            11
          ) AS count,
          LEAST(
            count,
            5
          ) AS discountable
      ) AS discounted
      WHERE
        discounted.count = base.count
    ) AS discounted
)

SELECT
  registrations.festival_id,
  registrations.id,
  pricing.total AS subtotal,
  pricing.discount,
  registrations.donate_discount,
  CASE registrations.donate_discount
    WHEN TRUE THEN pricing.total
    ELSE pricing.total - pricing.discount
  END AS total
FROM
  registrations
INNER JOIN pricing ON registrations.placements_count = pricing.count
WHERE
  registrations.completed_at IS NOT NULL
