class CreateFeedback < ActiveRecord::Migration[7.0]
  def change
    create_table :feedback do |t|
      t.belongs_to :registration, null: false, foreign_key: true
      t.belongs_to :session, null: false, foreign_key: true
      t.integer :rating
      t.text :positive
      t.text :constructive
      t.text :testimonial

      t.timestamps

      t.index %i[registration_id session_id], unique: true
    end
  end
end
