require 'rails_helper'

RSpec.describe 'Countries' do
  describe 'GET /index' do
    subject { response }

    before do
      get '/countries'
    end

    it { is_expected.to have_http_status(:success) }

    describe '#parsed_body' do
      subject(:body) { response.parsed_body }

      it { is_expected.to include(hash_including({ 'label' => 'Aotearoa (New Zealand)' })) }
    end
  end
end
