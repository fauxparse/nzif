class AddCounterToShortUrls < ActiveRecord::Migration[7.1]
  def change
    add_column :short_urls, :counter, :integer, null: false, default: 0
  end
end
