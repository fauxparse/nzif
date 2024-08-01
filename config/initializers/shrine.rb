require 'shrine'
require 'shrine/storage/file_system'
require 'shrine/storage/s3'

S3_OPTIONS = {
  public: true,
  force_path_style: false,
  endpoint: Rails.application.credentials.dig(:storage, :endpoint),
  region: Rails.application.credentials.dig(:storage, :region), # required
  bucket: Rails.application.credentials.dig(:storage, :bucket), # required
  access_key_id: Rails.application.credentials.dig(:storage, :key),
  secret_access_key: Rails.application.credentials.dig(:storage, :secret),
  upload_options: {
    acl: 'public-read',
    # expires_in: 24 * 60 * 60,
  },
}.freeze

external = Shrine::Storage::S3.new(**S3_OPTIONS)

Shrine.storages = {
  cache: Shrine::Storage::S3.new(prefix: 'cache', **S3_OPTIONS),
  store: external,
}

Shrine.plugin :activerecord
Shrine.plugin :derivatives, create_on_promote: true
Shrine.plugin :validation_helpers
Shrine.plugin :add_metadata
# Shrine.plugin :url_options, store: { expires_in: 1.week.to_i }

Shrine.plugin :presign_endpoint, presign_options: lambda { |request|
  # Uppy will send the "filename" and "type" query parameters
  filename = request.params['filename']
  type     = request.params['type']

  {
    content_disposition: ContentDisposition.inline(filename), # set download filename
    content_type: type, # set content type (required if using DigitalOcean Spaces)
    content_length_range: 0..(10 * 1024 * 1024), # limit upload size to 10 MB
  }
}
