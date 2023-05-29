module Translations
  class Create < ApplicationInteractor
    delegate :name, :traditional_name, :country, to: :context

    def call
      PlaceNameTranslation.locales(country).each do |locale|
        PlaceNameTranslation.create!(
          key:,
          locale:,
          value: locale == 'en' ? name : traditional_name,
        ) do |translation|
          authorize! translation, to: :create?
        end
      end

      context[:translation] = Hashie::Mash.new({ id: key, name:, traditional_name:, country: })
    end

    def key
      @key ||= PlaceNameTranslation.key_for(name)
    end
  end
end
