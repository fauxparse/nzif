namespace :shrine do
  namespace :cache do
    task clear: :environment do
      Shrine.storages[:cache].clear! do |object|
        object.last_modified < 1.week.ago
      end
    end
  end
end
