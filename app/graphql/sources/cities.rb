module Sources
  class Cities < BaseSource
    def fetch(names)
      matches = City
        .joins(
          <<~SQL.squish,
            LEFT JOIN (SELECT id, UNNEST(traditional_names) AS traditional_name FROM cities) AS traditional_cities
            ON cities.id = traditional_cities.id
          SQL
        )
        .where('cities.name IN (?) OR traditional_cities.traditional_name IN (?)', names, names)
        .reduce({}) do |memo, city|
          [city.name, *city.traditional_names].reduce(memo) do |acc, name|
            acc.merge(name => city)
          end
        end

      names.map { |name| matches[name] }
    end
  end
end
