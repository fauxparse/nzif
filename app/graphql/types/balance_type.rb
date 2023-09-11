module Types
  class BalanceType < BaseObject
    field :id, ID, null: false
    field :paid, Types::MoneyType, null: false
    field :total, Types::MoneyType, null: false

    def paid
      Money.from_cents(
        Payment
          .joins(:registration)
          .where(registrations: { festival_id: object.id }, state: :approved)
          .sum(:amount_cents),
      )
    end

    def total # rubocop:disable GraphQL/ResolverMethodLength, Metrics/MethodLength
      Festival.connection.execute(
        Festival.sanitize_sql_array([

          <<~SQL.squish,
            SELECT
              SUM((count * ? - (count * (count - 1)) / 2 * ?)) AS total
            FROM (
              SELECT
              placements.registration_id,
              COUNT(DISTINCT (placements.id)) AS count
              FROM placements
              GROUP BY placements.registration_id
            ) counts
          SQL
          Registration::Pricing.instance.base_workshop_price.cents,
          Registration::Pricing.instance.discount_per_additional_workshop.cents,
        ]),
      ).first['total'].to_i
    end
  end
end
