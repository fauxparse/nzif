class CountryList
  PRIORITY = %w[NZ AU].freeze

  attr_reader :traditional

  def initialize(traditional: true)
    @traditional = traditional
  end

  def all
    @all ||= ISO3166::Country.all.sort_by do |country|
      if priority?(country)
        [0, PRIORITY.index(country.alpha2)]
      else
        [1, country.common_name]
      end
    end
  end

  def as_json(...)
    all.map do |country|
      { value: country.alpha2, label: names(country), priority: priority?(country) }
    end
  end

  def names(country)
    languages = country.languages - ['en']
    languages.unshift('mi') if country.alpha2 == 'NZ'

    all_names = [
      country.common_name,
      *languages.map { |language| country.translations[language] },
    ].compact.uniq

    all_names.reverse! if traditional

    format_names(all_names)
  end

  def format_names(names)
    names.many? ? "#{names.first} (#{names[1..].join('/ ')})" : names.first
  end

  def priority?(country)
    PRIORITY.include?(country.alpha2)
  end
end
