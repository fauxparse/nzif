class AddDonateDiscountToRegistrations < ActiveRecord::Migration[7.1]
  def change
    add_column :registrations, :donate_discount, :boolean, null: false, default: false
  end
end
