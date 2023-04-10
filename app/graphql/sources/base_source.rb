module Sources
  class BaseSource < GraphQL::Dataloader::Source
    include ActionPolicy::GraphQL::Behaviour

    attr_reader :context

    def initialize(context:)
      @context = context
      super()
    end
  end
end
