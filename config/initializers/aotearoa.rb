aotearoa = ISO3166::Data.cache['NZ'].deep_symbolize_keys
aotearoa[:languages_official] << 'mi'
aotearoa[:languages_spoken] << 'mi'

ISO3166::Data.register(aotearoa)

ISO3166.configure do |config|
  config.locales = %i[en mi de fr es]
end

ISO3166::Data.reset
