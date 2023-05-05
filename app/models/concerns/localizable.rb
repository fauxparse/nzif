module Localizable
  extend ActiveSupport::Concern

  LOCALES = {
    'New Zealand' => 'mi',
    'Aotearoa' => 'mi',
    'Australia' => 'en-AU',
  }.freeze

  def country=(value)
    super(find_country(value))
  end

  def locale
    return I18n.locale unless country?

    @locale ||= LOCALES.fetch(find_country(country), I18n.locale)
  end

  private

  def find_country(country)
    match = Amatch::JaroWinkler.new(country)
    LOCALES.keys.find { |c| match.match(c) > 0.9 } || country
  end
end
