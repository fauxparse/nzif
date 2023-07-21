module Sources
  class PlaceName < BaseSource
    def fetch(placenames)
      Placename.load(placenames)
      placenames.map { |name| Placename[name] }
    end
  end
end
