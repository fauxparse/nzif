class Role < ApplicationRecord
  belongs_to :user

  validates :name, presence: true

  def name=(value)
    super(value.to_s)
  end

  def name
    super.to_sym
  end
end
