class Show < Activity
  has_one :show_workshop, dependent: :destroy
  has_one :workshop, through: :show_workshop
end
