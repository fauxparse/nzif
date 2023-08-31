class AddOfferedAtToWaitlist < ActiveRecord::Migration[7.0]
  def change
    change_table :waitlist do |t|
      t.timestamp :offered_at, null: true

      t.index %i[offered_at registration_id], unique: true
    end
  end
end
