class Role < ApplicationRecord
  belongs_to :user

  validates :name, presence: true

  enum :name,
    admin: 'admin',
    participant_liaison: 'participant_liaison'

  def name=(value)
    super(value.to_s)
  end

  def name
    super.to_sym
  end
end
