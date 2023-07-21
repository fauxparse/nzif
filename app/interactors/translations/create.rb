module Translations
  class Create < ApplicationInteractor
    delegate :name, :traditional_name, to: :context

    def call
      authorize! translation, to: :create?
      translation.save!
    end

    def translation
      context[:translation] ||= Placename.new(
        english: name,
        traditional: traditional_name,
      )
    end
  end
end
