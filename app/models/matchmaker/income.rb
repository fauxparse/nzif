module Matchmaker
  class Income
    attr_reader :allocation

    def initialize(allocation:)
      @allocation = allocation
    end

    def to_csv(filename: nil)
      if filename
        CSV.open(filename, 'wb', &method(:generate))
      else
        CSV.generate(&method(:generate))
      end
    end

    private

    def generate(csv)
      allocation.registrations.each_value do |registration|
        csv << [
          registration.id, registration.name, registration.placements.size,
          cost(registration.placements.size)
        ]
      end
    end

    def cost(workshops)
      ::Registration::Pricing.instance.package_price(workshops:)
    end
  end
end
