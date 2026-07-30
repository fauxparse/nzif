require 'rails_helper'

RSpec.describe Registration::Pricing do
  subject(:pricing) { described_class.instance }

  PRICING_SCHEDULE = [ # rubocop:disable RSpec/LeakyConstantDeclaration,Lint/ConstantDefinitionInBlock
    { count: 1,  package_price: Money.from_cents(75_00) },
    { count: 2,  package_price: Money.from_cents(145_00) },
    { count: 3,  package_price: Money.from_cents(210_00) },
    { count: 4,  package_price: Money.from_cents(270_00) },
    { count: 5,  package_price: Money.from_cents(325_00) },
    { count: 6,  package_price: Money.from_cents(380_00) },
    { count: 7,  package_price: Money.from_cents(435_00) },
    { count: 8,  package_price: Money.from_cents(490_00) },
    { count: 9,  package_price: Money.from_cents(545_00) },
    { count: 10, package_price: Money.from_cents(600_00) },
    { count: 11, package_price: Money.from_cents(655_00) },
  ].freeze

  describe '#package_price' do
    subject { pricing.package_price(workshops: count) }

    PRICING_SCHEDULE.each do |row|
      context "for #{row[:count]} workshop#{'s' if row[:count] > 1}" do
        let(:count) { row[:count] }

        it { is_expected.to eq row[:package_price] }
      end
    end
  end

  describe '#workshops_from_total' do
    subject { pricing.workshops_from_total(total:) }

    PRICING_SCHEDULE.each do |row|
      context "for #{row[:package_price]}" do
        let(:total) { row[:package_price] }

        it { is_expected.to eq row[:count] }
      end
    end
  end
end
