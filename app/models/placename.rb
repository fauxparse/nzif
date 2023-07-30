class Placename < ApplicationRecord
  include Searchable

  validates :english, presence: true
  validates :traditional, presence: true, uniqueness: { scope: :english }

  searchable_on :english, :traditional

  def self.[](name)
    cache[name] ||= search(name).presence || new(english: name, traditional: nil, id: name)
  end

  def self.cache
    @cache ||= {}
  end

  def to_param
    @identifier || id
  end

  def id=(identifier)
    super
    @identifier = identifier
  end

  def self.load(placenames)
    select('id, query, COALESCE(english, query) AS english, traditional')
      .from(search_all_from(placenames))
      .where('row = 1')
      .each do |placename|
        cache[placename.query] = placename
      end
  end

  def self.search_all_from(placenames)
    sanitize_sql_array([
      <<~SQL.squish,
        (
          SELECT query, placenames.*, row_number() OVER (PARTITION BY query) AS row
          FROM unnest(ARRAY [?]) query
          LEFT OUTER JOIN placenames ON
          (("placenames"."searchable") @@ (to_tsquery('english', ''' ' || unaccent (query) || ' ''' || ':*')))
        ) placenames
      SQL
      placenames,
    ])
  end
end
