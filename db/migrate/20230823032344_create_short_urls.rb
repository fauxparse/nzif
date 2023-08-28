class CreateShortUrls < ActiveRecord::Migration[7.0]
  def change
    create_table :short_urls do |t|
      t.string :url, null: false
      t.timestamps

      t.index :url, unique: true
    end
  end
end
