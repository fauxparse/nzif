module Profiles
  class Create < ApplicationInteractor
    delegate :attributes, to: :context

    def call
      authorize! profile, to: :create?

      profile.update!(attributes)
    end

    def profile
      context[:profile] ||= Profile.new
    end

    private

    def attributes
      @attributes ||= context[:attributes].to_h
    end
  end
end
