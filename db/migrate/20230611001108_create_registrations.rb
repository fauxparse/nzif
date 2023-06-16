class CreateRegistrations < ActiveRecord::Migration[7.0]
  def change
    create_table :registrations do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.belongs_to :festival, null: false, foreign_key: true
      t.timestamp :code_of_conduct_accepted_at

      t.timestamps

      t.index %w[user_id festival_id], unique: true
    end
  end
end
