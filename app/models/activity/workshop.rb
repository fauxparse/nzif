class Workshop < Activity
  has_one :show_workshop, dependent: :destroy
  has_one :show, through: :show_workshop
end
