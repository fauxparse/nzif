class ApplicationInteractor
  include Interactor

  include ActiveModel::Validations

  include ActionPolicy::Behaviour
  include ActionPolicy::Behaviours::ThreadMemoized
  include ActionPolicy::Behaviours::Memoized
  include ActionPolicy::Behaviours::Namespaced
  include ActionPolicy::GraphQL::Fields

  authorize :user, through: :current_user

  delegate :current_user, to: :context

  def authorized?
    @authorization_performed
  end

  def authorize!(*args, **kwargs, &)
    @authorization_performed = true
    super(*args, **kwargs, &)
  end

  def perform(interactor_class, **kwargs)
    interactor_class.call(**kwargs.merge(current_user:))
  end

  def skip_authorization!
    @authorization_performed = true
  end

  def self.inherited(subclass)
    super
    subclass.after do
      raise 'Unauthorized interaction' unless authorized?
    end
  end
end
