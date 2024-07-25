class AddShowExplainerToRegistrations < ActiveRecord::Migration[7.0]
  def change
    add_column :registrations, :show_explainer, :boolean, null: false, default: true
  end
end
