module Localizable
  extend ActiveSupport::Concern

  LOCALES = {
    'New Zealand' => 'mi',
    'Aotearoa' => 'mi',
    'Australia' => 'en-AU',
  }.freeze

  def locale
    return I18n.locale unless country?

    @locale ||= LOCALES.fetch(country.common_name, I18n.locale)
  end

  def country=(value)
    super(value.respond_to?(:alpha2) ? value : ISO3166::Country[value])
  end

  class << ISO3166::Country
    def load(code)
      self[code]
    end

    def dump(country)
      country.alpha2
    end
  end

  included do
    serialize :country, coder: ISO3166::Country
  end
end
