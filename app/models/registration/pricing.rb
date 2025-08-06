class Registration
  class Pricing
    include Singleton

    delegate :base_workshop_price, :discount_per_additional_workshop, :discount_limit, to: :data

    def package_price(workshops:)
      package_value(workshops:) - package_discount(workshops:)
    end

    def package_value(workshops:)
      base_workshop_price * workshops
    end

    def package_discount(workshops:)
      n = [workshops, discount_limit].min
      return 0 if n.zero?

      discounted = ((n * (n - 1)) / 2) * discount_per_additional_workshop
      additional = [workshops - discount_limit, 0].max *
                   (discount_per_additional_workshop * (discount_limit - 1))
      discounted + additional
    end

    def workshops_from_total(total:)
      return 0 if total.zero?

      d = discount_per_additional_workshop.to_f
      p = base_workshop_price.to_f
      t = [total, package_price(workshops: discount_limit)].min.to_f
      price_per_additional_workshop = (p - (d * (discount_limit - 1))).to_f

      # invert the pricing formula
      up_to = (
        (d + (2 * p) - Math.sqrt((d * d) + (4 * d * p) - (8 * d * t) + (4 * p * p))) / (2 * d).to_i
      ).to_i
      additional = ((total.to_f - t) / price_per_additional_workshop).to_i
      up_to + additional
    end

    private

    def data
      @data ||= begin
        data = YAML.load_file(Rails.root.join('config/pricing.yml'))['pricing']
        Hashie::Mash.new(
          base_workshop_price: Money.from_cents(data['base_workshop_price']),
          discount_per_additional_workshop:
            Money.from_cents(data['discount_per_additional_workshop']),
          discount_limit: data['discount_limit'],
        )
      end
    end
  end
end
