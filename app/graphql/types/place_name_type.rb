module Types
  class PlaceNameType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :traditional_name, String, null: true

    def name
      I18n.t(deburr(object.name), locale: :en, default: object.name)
    end

    def traditional_name
      I18n.t(deburr(object.name), locale: object.locale, default: object.name)
    end

    def deburr(string)
      I18n.transliterate(string).underscore.gsub(/\s+/, '_')
    end
  end
end
