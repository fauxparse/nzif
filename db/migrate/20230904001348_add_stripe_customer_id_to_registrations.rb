class AddStripeCustomerIdToRegistrations < ActiveRecord::Migration[7.0]
  def change
    change_table :registrations do |t|
      t.string :stripe_customer_id
    end
  end
end
