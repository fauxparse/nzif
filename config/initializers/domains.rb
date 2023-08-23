module Domains
  class Short
    DOMAIN = 'nzif.in'.freeze

    def self.matches?(request)
      request.domain == DOMAIN
    end
  end

  class Main
    DOMAIN = 'my.improvfest.nz'.freeze

    def self.matches?(request)
      request.domain == DOMAIN
    end
  end
end
