require 'rails_helper'

RSpec.describe Activities::Update, type: :interactor do
  let(:activity) { create(:workshop, :with_tutor) }

  let(:attributes) { {} }

  let(:context) { { activity:, attributes: } }

  describe '.call' do
    context 'with a new name' do
      let(:attributes) { { name: 'New name' } }

      it 'updates the activity' do
        expect { result }.to change { activity.reload.name }.to('New name')
      end

      it 'does not change the cast' do
        expect { result }.not_to change { activity.cast.count }
      end
    end

    context 'with another tutor' do
      let(:attributes) do
        { profile_ids: [*activity.tutors.map(&:profile_id), create(:profile).to_param] }
      end

      it 'updates the activity' do
        expect { result }.to change { activity.tutors.count }.by(1)
      end
    end

    context 'with a new attached activity' do
      let(:show) { create(:show, festival: activity.festival) }
      let(:attributes) { { attached_activity_id: show.to_param } }

      it 'updates the activity' do
        expect { result }.to change { activity.reload.show_workshop&.show }.from(nil).to(show)
      end
    end
  end
end
