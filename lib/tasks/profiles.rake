namespace :profiles do
  desc 'Find and merge duplicate profiles'
  task merge: :environment do
    Profile
      .select('profiles."name", ARRAY_AGG(profiles.id) AS ids')
      .group(:name)
      .having('COUNT(profiles.id) > 1')
      .each do |row|
        puts "#{row.name} has #{row.ids.size} profiles"

        profiles = Profile.where(id: row.ids)
        Profiles::Merge.call!(profiles:)
      end
  end
end
