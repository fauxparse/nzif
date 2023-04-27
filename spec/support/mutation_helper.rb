module MutationHelper
  extend ActiveSupport::Concern

  included do
    subject(:result) do
      NZIFSchema.execute(
        query,
        variables: variables.deep_transform_keys { |key| key.to_s.camelize(:lower) },
        context: { current_resource: current_user, **context },
      )
    end

    let(:current_user) { nil }

    let(:context) { {} }

    let(:variables) { {} }

    let(:data) { result['data'].deep_transform_keys { |key| key.to_s.underscore.to_sym } }
  end
end
