class AddPreferencesToUsers < ActiveRecord::Migration[7.0]
  def change
    enable_extension 'hstore' unless extension_enabled?('hstore')
    add_column :users, :preferences, :hstore, null: false, default: {}
  end
end
