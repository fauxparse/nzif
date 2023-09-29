class Message < ApplicationRecord
  include ActiveSnapshot

  belongs_to :sender, class_name: 'User'
  belongs_to :messageable, polymorphic: true

  validates :subject, :content, presence: true

  has_snapshot_children do
    {
      recipients: messageable.message_recipients,
    }
  end

  before_destroy :destroy_snapshots
end
