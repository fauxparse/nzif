module InteractorHelper
  extend ActiveSupport::Concern

  included do
    subject(:result) { described_class.call(current_user:, **context) }

    let!(:current_user) { create(:admin) }
    let(:context) { {} }
  end
end
