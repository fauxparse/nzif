module Translations
  class Destroy < ApplicationInteractor
    delegate :id, to: :context

    def call
      PlaceNameTranslation.where(key: id).find_each do |translation|
        authorize! translation, to: :destroy?
        translation.destroy!
      end

      I18n.backend.backends.first.reload!
    end
  end
end
