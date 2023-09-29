module Messageable
  extend ActiveSupport::Concern

  included do
    has_many :messages, as: :messageable, dependent: :destroy
  end

  def message_recipients
    raise NotImplementedError, "please implement #{self.class.name}#message_recipients"
  end
end
