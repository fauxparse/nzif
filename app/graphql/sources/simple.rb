module Sources
  class Simple < BaseSource
    attr_reader :model

    def initialize(context:, model:)
      super(context:)
      @model = model
    end

    def fetch(ids)
      models = model.find(ids).index_by(&:id)
      ids.map { |id| models[id] }
    end
  end
end
