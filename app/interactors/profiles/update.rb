module Profiles
  class Update < ApplicationInteractor
    delegate :profile, :attributes, to: :context

    def call
      authorize! profile, to: :update?

      profile.update!(attributes)
    end

    private

    def attributes
      @attributes ||= context[:attributes].to_h
    end
  end
end
