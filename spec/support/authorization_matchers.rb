module AuthorizationMatchers
  class UnauthorizedMatcher < RSpec::Matchers::BuiltIn::RaiseError
    def initialize
      super(ActionPolicy::Unauthorized, /not authorized/i)
    end
  end

  def be_unauthorized
    UnauthorizedMatcher.new
  end
end
