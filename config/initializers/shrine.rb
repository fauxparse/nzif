require 'shrine'
require 'shrine/storage/file_system'

Shrine.storages = {
  cache: Shrine::Storage::FileSystem.new('public', prefix: 'uploads/cache'), # temporary
  store: Shrine::Storage::FileSystem.new('public', prefix: 'uploads'),       # permanent
}

Shrine.plugin :activerecord
Shrine.plugin :derivatives, create_on_promote: true
Shrine.plugin :validation_helpers
