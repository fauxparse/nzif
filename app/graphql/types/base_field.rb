module Types
  class BaseField < GraphQL::Schema::Field
    argument_class Types::BaseArgument

    def initialize(*args, authenticate: false, **kwargs, &block)
      @authenticate = authenticate
      super(*args, **kwargs, &block)
    end

    attr_reader :authenticate
  end
end
