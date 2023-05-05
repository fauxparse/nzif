module Types
  class PlaceNameType < Types::BaseObject
    description 'A place name'

    field :id, ID, null: false, description: 'Unique ID'
    field :name, String, null: false, description: 'English name'
    field :traditional_name, String, null: true, description: 'traditional name'

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
