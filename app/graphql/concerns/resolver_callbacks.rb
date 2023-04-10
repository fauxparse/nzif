module ResolverCallbacks
  def self.included(base)
    base.include ActiveSupport::Callbacks
    base.define_callbacks :resolve

    base.resolve_method :resolve_with_callbacks
    base.extend ClassMethods
  end

  def resolve_with_callbacks(**kwargs)
    run_callbacks(:resolve) { resolve(**kwargs) }
  end

  module ClassMethods
    def before_resolve(*args, &)
      set_callback(:resolve, :before, *args, &)
    end

    def after_resolve(*args, &)
      set_callback(:resolve, :after, *args, &)
    end
  end
end
