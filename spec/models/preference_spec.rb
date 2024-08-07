require 'rails_helper'

RSpec.describe Preference do
  subject(:preference) { create(:preference, registration:, session:) }

  let(:registration) { create(:registration, festival:) }
  let(:session) { create(:session, :with_workshop, festival:) }
  let(:festival) { create(:festival) }

  its(:position) { is_expected.to eq 1 }

  it { is_expected.to be_valid }

  context 'as a second choice' do
    let(:first_choice) do
      create(
        :preference,
        registration:,
        session: create(:session, :with_workshop, festival:),
      )
    end

    before do
      first_choice
    end

    its(:position) { is_expected.to eq 2 }

    context 'when when the first choice is deleted' do
      it 'moves up to first choice' do
        expect { first_choice.destroy }
          .to change { preference.reload.position }.from(2).to(1)
      end
    end
  end
end
