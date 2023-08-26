require 'rails_helper'

RSpec.describe Voucher do
  subject(:voucher) { described_class.new(workshops:, registration:) }

  let(:registration) { create(:registration) }

  12.times do |n|
    context "for #{n} workshops" do
      let(:workshops) { n }

      it { is_expected.to be_valid }

      its(:amount) { is_expected.to eq(Registration.pricing.package_price(workshops: n)) }

      its(:workshops) { is_expected.to eq(n) }
    end
  end
end
