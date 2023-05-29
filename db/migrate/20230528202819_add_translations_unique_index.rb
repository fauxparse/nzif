class AddTranslationsUniqueIndex < ActiveRecord::Migration[7.0]
  def change
    add_index :translations, %i[key locale], unique: true
  end
end
