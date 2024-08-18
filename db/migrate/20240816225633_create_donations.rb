class CreateDonations < ActiveRecord::Migration[7.1]
  def change
    create_table :donations do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :message
      t.integer :amount_cents, null: false, default: 0
      t.boolean :anonymous, null: false, default: false
      t.boolean :newsletter, null: false, default: false
      t.enum :state, enum_type: :payment_state, null: false, default: 'pending'
      t.string :reference
      t.timestamps
    end
  end
end
