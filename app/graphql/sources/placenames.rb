module Sources
  class Placenames < BaseSource
    def fetch(placenames)
      Placename.load(placenames)
      placenames.map { |name| Placename[name] }
    end
  end
end
