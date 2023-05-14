class AddUniqueIndexToCast < ActiveRecord::Migration[7.0]
  def change
    add_index :cast, %i[activity_type activity_id profile_id role], unique: true,
      name: 'index_cast_uniquely'
  end
end
