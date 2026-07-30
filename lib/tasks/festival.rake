# frozen_string_literal: true

require 'open-uri'

namespace :dev do
  desc <<~DESC
    Seed a festival's schedule (activities, sessions, cast, images) from a previous year.

    Defaults: FROM=2025 TO=2026. Reuses existing profiles (presenters) and venues,
    but invents new fake activity names/taglines and attaches a placeholder image
    (picsum.photos) to each. Set FORCE=1 to wipe the target festival first.

      rake dev:seed_festival            # 2025 -> 2026
      rake dev:seed_festival FROM=2024 TO=2025
      rake dev:seed_festival FORCE=1    # clear target activities first
  DESC
  task seed_festival: :environment do
    from_year = ENV.fetch('FROM', '2025').to_s
    to_year = ENV.fetch('TO', '2026').to_s

    source = Festival.find(from_year)
    target = Festival.find(to_year)

    if target.activities.exists?
      if ENV['FORCE']
        puts "Clearing existing activities for #{target.year}..."
        # Sessions are dependent: :nullify on Activity, so remove them explicitly.
        target.sessions.destroy_all
        target.activities.destroy_all
      else
        abort "#{target.year} already has activities. Set FORCE=1 to replace them."
      end
    end

    seeder = FestivalSeeder.new(source, target)
    seeder.run
    SessionSlot.refresh_view!
    puts "Seeded #{seeder.created_count} activities for #{target.year}."
  end
end

# ponytail: a full seeder class rather than inline rake code so the generation
# logic is testable without booting the full Rake task. Upgrade path: swap the
# name/tagline generators for something richer (e.g. a Markov chain over past
# titles) if the fakes feel too samey.
class FestivalSeeder
  SHOW_ADJECTIVES = %w[
    Unexpected Late-Night Secret Midnight Improbable Tiny Giant Quiet Loud Delicate
    Clumsy Brilliant Forgotten Imagined Reluctant Magnificent Half-Baked Whispered
    Unlikely Borrowed Improvised
  ].freeze
  SHOW_NOUNS = [
    'Cabaret', 'Variations', 'Pantry', 'Detective', 'Hive', 'Weather Report', 'House Party', 'Time Machine', 'Casserole', 'Confessional', 'Mixtape', 'Antechamber', 'Slumber Party', 'Buffet', 'Rollercoaster', 'Pigeon', 'Monologue', 'Diorama', 'Footnotes', 'Broadcast', 'Feast', 'Petting Zoo', 'Specimen'
  ].freeze
  WORKSHOP_VERBS = %w[
    Building Breaking Sculpting Trusting Borrowing Undoing Stretching Wiring Tuning
    Rerouting Demolishing Planting Hosting Rewiring Composting Skating Surfing
  ].freeze
  WORKSHOP_SUBJECTS = [
    'the Offer', 'Status', 'Silence', 'the Group Mind', 'Your Voice', 'the Long Form', 'Failure', 'Relationships', 'the Edit', 'Character', 'the Audience', 'Tension', 'the Scene', 'Subtext', 'Genre'
  ].freeze
  SOCIAL_NAMES = [
    'Welcome Mixer', 'Late Karaoke', 'Awards Lunch', 'The Big Jam', 'Board Game Bonanza', 'Lightning Talks', 'Wind-Down Yoga', 'Morning Meditation', 'Grab Bag', 'Closing Night', 'Opening Night', 'Coffee & Chat', 'Sunset Stretch'
  ].freeze
  CONFERENCE_TOPICS = [
    'Risk & Reward', 'Listening Beyond Words', 'The Geometry of Scenes', 'Yes And Revisited', 'Finding the Game', 'Trust on Stage', 'The Empty Stage', 'Failure as Fuel'
  ].freeze

  TAGLINES = {
    'Show' => 'A brand-new improvised hour, never seen before.',
    'Workshop' => 'A hands-on session for curious improvisers.',
    'SocialEvent' => 'A chance to connect with the festival community.',
    'Conference' => 'A short talk on the craft of improvisation.',
  }.freeze

  attr_reader :created_count

  def initialize(source, target)
    @source = source
    @target = target
    @created_count = 0
    @used = Hash.new { |h, k| h[k] = Set.new }
    # Maps source activity id -> new activity, for show_workshop linking.
    @activity_map = {}
  end

  def run
    Activity.where(festival: @source).order(:id).each do |src|
      new_activity = create_activity(src)
      @activity_map[src.id] = new_activity
      copy_activity_cast(src, new_activity)
      copy_sessions(src, new_activity)
      attach_image(new_activity)
      @created_count += 1
    end

    copy_show_workshops
  end

  private

  def create_activity(src)
    name = unique_name(src.type, src.id)
    attrs = {
      festival: @target,
      name: name,
      tagline: TAGLINES[src.type],
      description: "#{name}. #{TAGLINES[src.type]}",
    }
    # suitability is only valid for workshops; booking_link only for shows.
    attrs[:suitability] = src.suitability if src.workshop? && src.suitability.present?
    src.type.constantize.create!(attrs)
  end

  def copy_activity_cast(src, dest)
    Cast.unscoped.where(activity_type: 'Activity', activity_id: src.id).order(:position).each do |c|
      Cast.create!(
        activity: dest,
        profile_id: c.profile_id,
        role: c.role,
        position: c.position,
      )
    end
  end

  def copy_sessions(src, dest)
    Session.where(activity: src).order(:starts_at).each do |s|
      new_session = Session.create!(
        festival: @target,
        activity: dest,
        activity_type: s.activity_type,
        venue: s.venue,
        starts_at: shifted(s.starts_at),
        ends_at: shifted(s.ends_at),
        capacity: s.capacity,
      )
      Cast.unscoped.where(activity_type: 'Session', activity_id: s.id).order(:position).each do |c|
        Cast.create!(
          activity: new_session,
          profile_id: c.profile_id,
          role: c.role,
          position: c.position,
        )
      end
    end
  end

  def attach_image(activity)
    # ponytail: pulls one image per activity from picsum.photos, seeded by slug
    # so re-runs are deterministic. Network-bound; skip gracefully on failure.
    URI.open("https://picsum.photos/seed/#{activity.slug}/1280/720") do |file|
      activity.picture = file
      activity.save!
    end
  rescue StandardError => e
    warn "  (no image for #{activity.name}: #{e.message})"
  end

  def copy_show_workshops
    source_show_ids = Show.where(festival: @source).pluck(:id)
    ShowWorkshop.where(show_id: source_show_ids).find_each do |sw|
      new_show = @activity_map[sw.show_id]
      new_workshop = @activity_map[sw.workshop_id]
      next unless new_show && new_workshop

      ShowWorkshop.create!(show: new_show, workshop: new_workshop)
    end
  end

  # Maps a source timestamp onto the same wall-clock time-of-day, on the same
  # day-of-festival relative to the target's start_date. Preserves local time
  # ponytail: ignores DST shifts; sessions are daytime/evening so this is safe.
  def shifted(time)
    date = @target.start_date + (time.to_date - @source.start_date)
    Time.zone.local(date.year, date.month, date.day, time.hour, time.min, time.sec)
  end

  def unique_name(type, seed)
    100.times do |attempt|
      name = generate_name(type, seed + attempt)
      slug = name.downcase.gsub(/[^a-z0-9]+/, '-').gsub(/^-|-$/, '')
      next if @used[type].include?(slug)

      @used[type] << slug
      return name
    end
    # Fall back to appending the source id; guaranteed unique.
    generate_name(type, seed) + " ##{seed}"
  end

  def generate_name(type, seed)
    case type
    when 'Show'
      "#{SHOW_ADJECTIVES.sample(random: rng(seed))} #{SHOW_NOUNS.sample(random: rng(seed))}"
    when 'Workshop'
      "#{WORKSHOP_VERBS.sample(random: rng(seed))} #{WORKSHOP_SUBJECTS.sample(random: rng(seed))}"
    when 'SocialEvent'
      SOCIAL_NAMES.sample(random: rng(seed))
    when 'Conference'
      "Talk: #{CONFERENCE_TOPICS.sample(random: rng(seed))}"
    else
      "Activity #{seed}"
    end
  end

  # Deterministic per-(source-activity, attempt) RNG so names are stable across
  # re-runs while still re-rolling on collision.
  def rng(seed)
    Random.new(seed.to_i + 2026)
  end
end
