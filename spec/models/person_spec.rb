require 'rails_helper'

RSpec.describe Person do
  describe 'director' do
    subject(:person) { build(:director, activity:) }

    let(:activity) { create(:show) }

    it { is_expected.to be_valid }

    context 'for a workshop' do
      let(:activity) { create(:workshop) }

      it { is_expected.not_to be_valid }
    end
  end
end
