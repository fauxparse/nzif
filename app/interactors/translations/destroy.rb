module Translations
  class Destroy < ApplicationInteractor
    delegate :id, to: :context

    def call
      authorize! translation, to: :destroy?
      translation.destroy!
    end

    def translation
      context[:translation] ||= Placename.find(id)
    end
  end
end
