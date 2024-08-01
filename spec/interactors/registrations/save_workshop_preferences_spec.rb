require 'rails_helper'

RSpec.describe Registrations::SaveWorkshopPreferences do
  let(:festival) { create(:festival) }
  let(:registration) { create(:registration, festival:) }
  let(:context) { { registration:, preferences: } }

  let(:resulting_preferences) do
    result.registration.reload.preferences.pluck(:session_id, :position)
  end

  let(:sessions) do
    [
      create(:session, :full_day, :with_workshop, festival:),
      create(:session, :morning, :with_workshop, festival:),
      create(:session, :morning, :with_workshop, festival:),
      create(:session, :morning, :with_workshop, festival:),
      create(:session, :afternoon, :with_workshop, festival:),
      create(:session, :afternoon, :with_workshop, festival:),
      create(:session, :afternoon, :with_workshop, festival:),
    ]
  end

  context 'for a complex preference setup' do
    let(:preferences) do
      [
        { session_id: sessions[5].to_param, position: 1 },
        { session_id: sessions[0].to_param, position: 2 },
        { session_id: sessions[4].to_param, position: 3 },
        { session_id: sessions[1].to_param, position: 3 },
        { session_id: sessions[2].to_param, position: 4 },
      ]
    end

    it 'saves the preferences' do
      expect { result }.to change(registration.preferences, :count).by(5)
    end

    it 'sets the positions correctly' do
      expect(resulting_preferences).to contain_exactly(
        [sessions[5].id, 1],
        [sessions[0].id, 2],
        [sessions[4].id, 3],
        [sessions[1].id, 3],
        [sessions[2].id, 4],
      )
    end
  end

  context 'with existing preferences' do
    let(:preferences) do
      [{ session_id: sessions[0].to_param, position: 1 }]
    end

    before do
      registration.preferences.create!(session: sessions[1])
    end

    it 'deletes the old preference and adds the new one' do
      expect(resulting_preferences).to contain_exactly(
        [sessions[0].id, 1],
      )
    end

    context 'when passed an empty array' do
      let(:preferences) { [] }

      it 'deletes the old preference' do
        expect { result }.to change(registration.preferences, :count).by(-1)
      end
    end
  end
end
