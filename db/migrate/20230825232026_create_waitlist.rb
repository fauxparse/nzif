class CreateWaitlist < ActiveRecord::Migration[7.0]
  def change
    create_table :waitlist do |t|
      t.belongs_to :session, null: false, foreign_key: { on_delete: :restrict }
      t.belongs_to :registration, null: false, foreign_key: { on_delete: :restrict }
      t.integer :position

      t.timestamps
      t.index %i[session_id registration_id], unique: true
    end
  end
end
