module Activities
  class FetchFromAirtable < ApplicationInteractor
    AIRTABLE_CREDENTIALS = Rails.application.credentials.airtable
    Airrecord.api_key = AIRTABLE_CREDENTIALS[:api_key]

    class Record < Airrecord::Table
      include ActiveModel::Validations

      self.base_key = AIRTABLE_CREDENTIALS[:base_key]
      self.table_name = AIRTABLE_CREDENTIALS[:table_name]

      validates :name, presence: true
      validates :klass, presence: true

      def name
        self['Show / Workshop Name']
      end

      def tags
        self['Tags'] || []
      end

      def klass
        if tags.include?('Show')
          Show
        elsif tags.include?('Workshop')
          Workshop
        end
      end

      def description
        self['Full Blurb'] || ''
      end

      def tagline
        self['One-liner'] || ''
      end

      def quotes
        self['Quotes'] || ''
      end

      def slug
        self['URL'].split('/').last if self['URL'].present?
      end

      def suitability
        self['What experience, ability, skills or interests are participants expected to bring to this workshop?'] || ''
      end

      def teacher_names
        (self['Workshop Teacher(s)'] || '').split(%r{\s*[/&]\s*}).map(&:strip)
      end

      def email
        self['Email Address']
      end

      def attributes
        {
          name:,
          description:,
          tagline:,
          quotes:,
          suitability:,
        }
      end

      def date
        return if self['Date'].blank?

        Time.zone.parse(self['Date'])
      end

      def times
        @times ||=
          if self['Time'].blank? || date.blank?
            []
          else
            self['Time'].split(/\s*-\s*/).map do |time|
              Time.zone.parse("#{self['Date']} #{time.split(/\s+\(/).first}")
            end
          end
      end

      def start_time
        times.first
      end

      def end_time
        return nil if times.empty?

        return times[1] if times.size > 1

        start_time + 1.hour
      end

      def venue
        self['Venue']
      end
    end

    def call
      skip_authorization! # only called from jobs

      Activity.transaction do
        records.each do |record|
          create_activity_from_record(record)
          # activity = festival.activities.find_or_initialize_by(slug: record.slug, festival:)
          # puts "#{record.slug} => #{activity.persisted?}"
        end
      end
    end

    private

    def create_activity_from_record(record) # rubocop:disable Metrics/MethodLength
      return unless record.valid?

      record.klass.find_or_initialize_by(slug: record.slug, festival:).tap do |activity|
        activity.attributes = record.attributes

        association = activity.is_a?(Workshop) ? activity.tutors : activity.directors
        people[record.id].each do |profile|
          association.build(profile:) unless association.detect { |t| t.profile_id == profile.id }
        end

        session = activity.sessions.find_or_initialize_by(
          activity_type: activity.class.name,
          festival:,
          starts_at: record.start_time,
          ends_at: record.end_time,
        )

        session.venue = venues_by_name[record.venue] if record.venue.present?

        activity.save!

        url = "https://my.improvfest.nz/#{activity.class.to_param}/#{activity.slug}"
        if record['URL'] != url
          record['URL'] = url
          record.save
        end
      end
    end

    def festival
      context.festival ||= Festival.current
    end

    def records
      @records ||= Record.all.select(&:valid?)
    end

    def teachers
      @teachers ||= begin
        profiles = Profile.all.index_by(&:name)
        records.each.with_object({}) do |record, teachers|
          names = record.teacher_names
          names.each do |name|
            teachers[name] ||= profiles[name]
          end

          if names.one? && teachers[names.first].blank? && record.email.present?
            teachers[names.first] = User.includes(:profile).find_by(email: record.email).profile
          end
        end
      end
    end

    def people
      @people ||=
        records.each.with_object({}) do |record, people|
          people[record.id] = extract_people_from_record(record)
        end
    end

    def extract_people_from_record(record)
      raw = record['Workshop Teacher(s)'].presence || record['Contact Name'] || ''
      names = raw.split(%r{\s*[/&]\s*}).map(&:strip).compact_blank

      names.map do |name|
        Profile.find_or_initialize_by(name:).tap do |profile|
          profile.bio = record['Company / Credit Bio'] unless names.many?
          profile.save!
        end
      end
    end

    def venues_by_name
      @venues_by_name ||= Venue.all.index_by(&:room)
    end
  end
end
