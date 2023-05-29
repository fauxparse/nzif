module Resolvers
  class Translations < Resolvers::BaseResolver
    type [Types::TranslationType], null: false

    def resolve
      PlaceNameTranslation.all.group_by(&:key).map do |id, translations|
        english, other = translations.partition { |t| t.locale == 'en' }.map(&:first)
        next unless english && other

        Hashie::Mash.new({
          id:,
          name: english.value,
          traditional_name: other.value,
          country: country(other),
        })
      end.compact
    end

    def country(translation)
      case translation.locale
      when 'mi' then ISO3166::Country['NZ']
      when 'en-AU' then ISO3166::Country['AU']
      end
    end
  end
end
