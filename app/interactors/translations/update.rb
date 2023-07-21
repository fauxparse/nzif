module Translations
  class Update < ApplicationInteractor
    delegate :id, :name, :traditional_name, to: :context

    def call
      authorize! translation, to: :update?
      translation.update!(english: name, traditional: traditional_name)
    end

    def translation
      context[:translation] ||= Placename.find(id)
    end
  end
end
