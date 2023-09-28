class CreateMessages < ActiveRecord::Migration[7.0]
  def change
    create_table :messages do |t|
      t.belongs_to :messageable, null: false, polymorphic: true
      t.belongs_to :sender, null: false, foreign_key: { to_table: :users }
      t.string :subject
      t.text :content

      t.timestamps
    end
  end
end
