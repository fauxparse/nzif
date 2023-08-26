class Registration
  class Pricing
    include Singleton

    delegate :base_workshop_price, :discount_per_additional_workshop, to: :data

    def package_price(workshops:)
      package_value(workshops:) - package_discount(workshops:)
    end

    def package_value(workshops:)
      base_workshop_price * workshops
    end

    def package_discount(workshops:)
      ((workshops * (workshops - 1)) / 2) * discount_per_additional_workshop
    end

    def workshops_from_total(total:) # rubocop:disable Metrics/AbcSize
      return 0 if total.zero?

      d = discount_per_additional_workshop.to_f
      p = base_workshop_price.to_f
      t = total.to_f

      # invert the pricing formula
      (d + (2 * p) - Math.sqrt((d * d) + (4 * d * p) - (8 * d * t) + (4 * p * p))) / (2 * d).to_i
    end

    private

    def data
      @data ||= Hashie::Mash.new(
        YAML.load_file(Rails.root.join('config/pricing.yml'))['pricing']
          .transform_values { |m| Money.from_cents(m) },
      )
    end
  end
end
