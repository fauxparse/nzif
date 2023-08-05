require 'shrine'
require 'shrine/storage/file_system'
require 'shrine/storage/s3'

local = Shrine::Storage::FileSystem.new('public', prefix: 'uploads')
external = Shrine::Storage::S3.new(
  force_path_style: false,
  endpoint: Rails.application.credentials.dig(:storage, :endpoint),
  region: Rails.application.credentials.dig(:storage, :region), # required
  bucket: Rails.application.credentials.dig(:storage, :bucket), # required
  access_key_id: Rails.application.credentials.dig(:storage, :key),
  secret_access_key: Rails.application.credentials.dig(:storage, :secret),
)

Shrine.storages = {
  cache: Shrine::Storage::FileSystem.new('public', prefix: 'uploads/cache'), # temporary
  store: Rails.env.production? ? external : local, # permanent
}

Shrine.plugin :activerecord
Shrine.plugin :derivatives, create_on_promote: true
Shrine.plugin :validation_helpers
