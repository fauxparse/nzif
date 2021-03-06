# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_09_13_025029) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_trgm"
  enable_extension "plpgsql"
  enable_extension "unaccent"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "activities", force: :cascade do |t|
    t.bigint "festival_id"
    t.string "type"
    t.string "name"
    t.string "slug"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "experience_levels", default: [], array: true
    t.bigint "pitch_id"
    t.index ["festival_id", "type", "slug"], name: "index_activities_on_festival_id_and_type_and_slug"
    t.index ["festival_id"], name: "index_activities_on_festival_id"
    t.index ["pitch_id"], name: "index_activities_on_pitch_id"
  end

  create_table "availabilities", force: :cascade do |t|
    t.bigint "session_id", null: false
    t.bigint "registration_id", null: false
    t.string "role"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["registration_id", "session_id", "role"], name: "index_availabilities_on_registration_id_and_session_id_and_role", unique: true
    t.index ["registration_id"], name: "index_availabilities_on_registration_id"
    t.index ["session_id"], name: "index_availabilities_on_session_id"
  end

  create_table "calendar_exclusions", force: :cascade do |t|
    t.bigint "session_id", null: false
    t.bigint "registration_id", null: false
    t.index ["registration_id", "session_id"], name: "index_calendar_exclusions_on_registration_id_and_session_id", unique: true
    t.index ["registration_id"], name: "index_calendar_exclusions_on_registration_id"
    t.index ["session_id"], name: "index_calendar_exclusions_on_session_id"
  end

  create_table "contents", force: :cascade do |t|
    t.string "slug"
    t.text "raw"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "title"
    t.index ["slug"], name: "index_contents_on_slug", unique: true
  end

  create_table "festivals", force: :cascade do |t|
    t.date "start_date"
    t.date "end_date"
    t.datetime "pitches_open_at"
    t.datetime "pitches_close_at"
    t.datetime "registrations_open_at"
    t.datetime "earlybird_cutoff"
    t.boolean "panic", default: false
    t.datetime "allocation_finalized_at"
    t.index "date_part('year'::text, start_date)", name: "festivals_by_year", unique: true
  end

  create_table "history_items", force: :cascade do |t|
    t.string "type"
    t.string "description"
    t.text "data"
    t.datetime "created_at"
  end

  create_table "history_mentions", force: :cascade do |t|
    t.bigint "item_id", null: false
    t.string "subject_type", null: false
    t.bigint "subject_id", null: false
    t.string "relationship"
    t.index ["item_id", "relationship"], name: "index_history_mentions_on_item_id_and_relationship"
    t.index ["item_id"], name: "index_history_mentions_on_item_id"
    t.index ["subject_type", "subject_id"], name: "index_history_mentions_on_subject_type_and_subject_id"
  end

  create_table "identities", force: :cascade do |t|
    t.bigint "user_id"
    t.string "type"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "uid", limit: 64
    t.string "reset_token"
    t.index ["reset_token"], name: "index_identities_on_reset_token", unique: true
    t.index ["type", "uid"], name: "index_identities_on_type_and_uid", unique: true
    t.index ["user_id"], name: "index_identities_on_user_id"
  end

  create_table "incidents", force: :cascade do |t|
    t.bigint "festival_id", null: false
    t.bigint "user_id"
    t.text "body"
    t.string "state", default: "open", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["festival_id", "state"], name: "index_incidents_on_festival_id_and_state"
    t.index ["festival_id"], name: "index_incidents_on_festival_id"
    t.index ["user_id"], name: "index_incidents_on_user_id"
  end

  create_table "messages", force: :cascade do |t|
    t.string "messageable_type", null: false
    t.bigint "messageable_id", null: false
    t.bigint "sender_id", null: false
    t.string "subject"
    t.text "body"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["messageable_type", "messageable_id", "created_at"], name: "messages_on_messageable"
    t.index ["messageable_type", "messageable_id"], name: "index_messages_on_messageable_type_and_messageable_id"
    t.index ["sender_id"], name: "index_messages_on_sender_id"
  end

  create_table "payments", force: :cascade do |t|
    t.string "type"
    t.bigint "registration_id", null: false
    t.integer "amount_cents"
    t.string "state", default: "pending", null: false
    t.string "reference"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "description"
    t.index ["registration_id"], name: "index_payments_on_registration_id"
  end

  create_table "pitches", force: :cascade do |t|
    t.bigint "festival_id"
    t.bigint "user_id"
    t.string "state", default: "draft", null: false
    t.text "data", default: "{}", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.datetime "submitted_at"
    t.index "COALESCE(submitted_at, updated_at)", name: "index_pitches_on_submission"
    t.index ["festival_id", "user_id", "state"], name: "index_pitches_on_festival_id_and_user_id_and_state"
    t.index ["festival_id"], name: "index_pitches_on_festival_id"
    t.index ["user_id"], name: "index_pitches_on_user_id"
  end

  create_table "placements", force: :cascade do |t|
    t.bigint "registration_id", null: false
    t.bigint "session_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["registration_id"], name: "index_placements_on_registration_id"
    t.index ["session_id"], name: "index_placements_on_session_id"
  end

  create_table "preferences", force: :cascade do |t|
    t.bigint "registration_id", null: false
    t.bigint "session_id", null: false
    t.integer "position"
    t.datetime "starts_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["registration_id", "session_id"], name: "index_preferences_on_registration_id_and_session_id", unique: true
    t.index ["registration_id"], name: "index_preferences_on_registration_id"
    t.index ["session_id"], name: "index_preferences_on_session_id"
  end

  create_table "presenters", force: :cascade do |t|
    t.bigint "activity_id"
    t.bigint "user_id"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["activity_id"], name: "index_presenters_on_activity_id"
    t.index ["user_id"], name: "index_presenters_on_user_id"
  end

  create_table "prices", force: :cascade do |t|
    t.bigint "festival_id", null: false
    t.string "activity_type"
    t.integer "quantity"
    t.integer "amount_cents"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["festival_id"], name: "index_prices_on_festival_id"
  end

  create_table "registrations", force: :cascade do |t|
    t.bigint "festival_id", null: false
    t.bigint "user_id", null: false
    t.string "state", default: "pending", null: false
    t.datetime "code_of_conduct_accepted_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "completed_at"
    t.integer "placements_count", default: 0
    t.index ["festival_id", "state"], name: "index_registrations_on_festival_id_and_state"
    t.index ["festival_id", "user_id"], name: "index_registrations_on_festival_id_and_user_id", unique: true
    t.index ["festival_id"], name: "index_registrations_on_festival_id"
    t.index ["user_id"], name: "index_registrations_on_user_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.bigint "activity_id"
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "venue_id"
    t.integer "capacity"
    t.integer "placements_count", default: 0
    t.datetime "feedback_requested_at"
    t.index ["activity_id"], name: "index_sessions_on_activity_id"
    t.index ["feedback_requested_at"], name: "index_sessions_on_feedback_requested_at"
    t.index ["starts_at", "ends_at"], name: "index_sessions_on_starts_at_and_ends_at"
    t.index ["venue_id"], name: "index_sessions_on_venue_id"
  end

  create_table "slots", force: :cascade do |t|
    t.bigint "festival_id", null: false
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.string "activity_type"
    t.index ["festival_id", "activity_type", "starts_at"], name: "index_slots_on_festival_id_and_activity_type_and_starts_at", unique: true
    t.index ["festival_id"], name: "index_slots_on_festival_id"
  end

  create_table "stripe_customers", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "stripe_customer_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["stripe_customer_id"], name: "index_stripe_customers_on_stripe_customer_id", unique: true
    t.index ["user_id"], name: "index_stripe_customers_on_user_id"
  end

  create_table "survey_responses", force: :cascade do |t|
    t.bigint "registration_id", null: false
    t.bigint "session_id", null: false
    t.integer "expectations"
    t.integer "difficulty"
    t.text "good"
    t.text "bad"
    t.text "testimonial"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["registration_id"], name: "index_survey_responses_on_registration_id"
    t.index ["session_id"], name: "index_survey_responses_on_session_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "authorised_roles", default: [], array: true
    t.string "city"
    t.string "country_code", limit: 4
    t.text "bio"
    t.string "phone"
    t.index "lower((email)::text)", name: "index_users_on_lowercase_email", unique: true
  end

  create_table "venues", force: :cascade do |t|
    t.string "name"
    t.string "address"
    t.decimal "latitude", precision: 15, scale: 10
    t.decimal "longitude", precision: 15, scale: 10
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["latitude", "longitude"], name: "index_venues_on_latitude_and_longitude"
  end

  create_table "versions", force: :cascade do |t|
    t.string "item_type", null: false
    t.bigint "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object"
    t.datetime "created_at"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
  end

  create_table "waitlists", force: :cascade do |t|
    t.bigint "session_id", null: false
    t.bigint "registration_id", null: false
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["registration_id"], name: "index_waitlists_on_registration_id"
    t.index ["session_id", "registration_id"], name: "index_waitlists_on_session_id_and_registration_id", unique: true
    t.index ["session_id"], name: "index_waitlists_on_session_id"
  end

  add_foreign_key "activities", "festivals", on_delete: :cascade
  add_foreign_key "activities", "pitches"
  add_foreign_key "availabilities", "registrations"
  add_foreign_key "availabilities", "sessions"
  add_foreign_key "calendar_exclusions", "registrations", on_delete: :cascade
  add_foreign_key "calendar_exclusions", "sessions", on_delete: :cascade
  add_foreign_key "history_mentions", "history_items", column: "item_id", on_delete: :cascade
  add_foreign_key "identities", "users", on_delete: :cascade
  add_foreign_key "incidents", "festivals", on_delete: :cascade
  add_foreign_key "incidents", "users"
  add_foreign_key "messages", "users", column: "sender_id", on_delete: :restrict
  add_foreign_key "payments", "registrations"
  add_foreign_key "pitches", "festivals", on_delete: :cascade
  add_foreign_key "pitches", "users", on_delete: :cascade
  add_foreign_key "placements", "registrations", on_delete: :cascade
  add_foreign_key "placements", "sessions", on_delete: :cascade
  add_foreign_key "preferences", "registrations"
  add_foreign_key "preferences", "sessions"
  add_foreign_key "presenters", "activities"
  add_foreign_key "presenters", "users"
  add_foreign_key "prices", "festivals"
  add_foreign_key "registrations", "festivals"
  add_foreign_key "registrations", "users"
  add_foreign_key "sessions", "activities", on_delete: :cascade
  add_foreign_key "sessions", "venues", on_delete: :nullify
  add_foreign_key "slots", "festivals", on_delete: :cascade
  add_foreign_key "stripe_customers", "users", on_delete: :cascade
  add_foreign_key "survey_responses", "registrations"
  add_foreign_key "survey_responses", "sessions"
  add_foreign_key "waitlists", "registrations", on_delete: :cascade
  add_foreign_key "waitlists", "sessions", on_delete: :cascade
end
