module Profiles
  class Update < ApplicationInteractor
    delegate :profile, :attributes, to: :context

    def call
      authorize! profile, to: :update?

      profile.update!(attributes)
    end

    private

    def attributes
      @attributes ||= context[:attributes].to_h.tap do |attrs|
        if attrs[:city].is_a?(Hash)
          attrs[:country] = attrs[:city][:country]
          attrs[:city] = attrs[:city][:name]
        end
      end
    end
  end
end
