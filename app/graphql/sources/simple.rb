module Sources
  class Simple < BaseSource
    attr_reader :model, :primary_key

    def initialize(context:, model:, primary_key: :id)
      super(context:)
      @model = model
      @primary_key = primary_key
    end

    def fetch(ids)
      models = (primary_key == :id ? model.find(ids) : model.where(primary_key => ids).all)
        .index_by(&:to_param)
      ids.map { |id| models[id] }
    end
  end
end
