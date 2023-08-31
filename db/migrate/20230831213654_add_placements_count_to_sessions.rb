class AddPlacementsCountToSessions < ActiveRecord::Migration[7.0]
  def change
    add_column :sessions, :placements_count, :integer, null: false, default: 0

    reversible do |dir|
      dir.up do
        execute <<~SQL.squish
          UPDATE sessions
          SET placements_count = (SELECT count(1) FROM placements WHERE placements.session_id = sessions.id)
        SQL
      end
    end
  end
end
