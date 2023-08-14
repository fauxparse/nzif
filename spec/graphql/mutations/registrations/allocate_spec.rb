require 'rails_helper'

RSpec.describe Mutations::Registrations::Allocate, type: :mutation do
  let(:query) do
    <<~GRAPHQL.squish
      mutation {
        allocateWorkshops {
          workshopAllocation {
            id
          }
        }
      }
    GRAPHQL
  end

  let!(:festival) { create(:festival) } # rubocop:disable RSpec/LetSetup

  context 'when logged in as admin' do
    let(:current_user) { create(:admin) }

    it 'creates an allocation' do
      expect { result }.to change(Allocation, :count).by(1)
    end

    it 'enqueues a job' do
      expect { result }.to have_enqueued_job(AllocateWorkshopsJob)
    end

    it 'returns the allocation ID' do
      result
      expect(data[:allocate_workshops][:workshop_allocation][:id]).to eq(Allocation.last.to_param)
    end
  end
end
