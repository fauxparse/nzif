require 'csv'

class PrintablePitch
  attr_reader :row

  class Presenter
    attr_reader :name, :email, :pronouns, :location, :bio, :restrictions, :group, :identity, :others,
      :availability, :accessibility

    def initialize(pitch)
      @name = pitch[/your name/i]
      @email = pitch[/email/i]
      @pronouns = pitch[/pronouns/i]
      @identity = pitch[/identify as/i]
      @location = pitch[/you based/i]
      @bio = pitch[/bio or introduction/i]
      @group = pitch[/group or company/i]
      @others = pitch[/collaborators/i]
      @availability = pitch[/limitations on your availability/i]
      @accessibility = pitch[/accessibility requirements/i]
    end
  end

  class Idea
    attr_reader :what, :outline, :structure, :participant_experience, :audience, :previous,
      :vibe, :accessibility, :requirements, :cast, :mentoring, :anything_else

    def initialize(pitch)
      @what = pitch[/what sort of thing/i]
      @outline = pitch[/brief outline/i]
      @structure = pitch[/our regular structure/i]
      @participant_experience = pitch[/like for participants/i]
      @audience = pitch[/intended audience/i]
      @previous = pitch[/done this thing before/i]
      @vibe = pitch[/vibe with/i]
      @accessibility = pitch[/accessible to/i]
      @requirements = pitch[/space or technical/i]
      @cast = pitch[/cast or personnel/i]
      @mentoring = pitch[/help developing/i]
      @anything_else = pitch[/anything else/i]
    end
  end

  class Company
    attr_reader :name, :location, :blurb, :access_requirements, :presented

    def initialize(pitch)
      @name = pitch[/company name/i]
      @location = pitch[/where are you based/i]
      @blurb = pitch[/blurb for your company/i]
      @access_requirements = pitch[/company have any access/i]
      @presented = pitch[/company presented/i]
    end
  end

  class Show
    attr_reader :title, :description, :casting, :who, :tech, :previous, :audience, :why,
      :accessible, :workshop

    def initialize(pitch)
      @title = pitch[/name of show/i]
      @description = pitch[/synopsis/i]
      @casting = pitch[/pre-cast/i]
      @who = pitch[/who is involved/i]
      @tech = pitch[/show.+technical/i]
      @previous = pitch[/performed.+before/i]
      @audience = pitch[/ideal audience/i]
      @why = pitch[/show should be included/i]
      @accessible = pitch[/show accessible/i]
      @workshop = pitch[/have a workshop attached/i] =~ /yes/i ? Workshop.new(pitch) : nil
    end

    def workshop?
      workshop.present?
    end
  end

  class Workshop
    attr_reader :title, :description, :previous, :size, :experience, :takeaways, :accessibility

    def initialize(pitch)
      @title = pitch[/name of your workshop/i]
      @description = pitch[/workshop outline/i]
      @previous = pitch[/taught.+before/i]
      @size = pitch[/workshop size/i]
      @experience = pitch[/experience level/i]
      @takeaways = pitch[/take away/i]
      @accessibility = pitch[/access considerations or limitations/i]
    end
  end

  class Conference
    attr_reader :topic, :format, :involvement

    def initialize(pitch)
      @topic = pitch[/the topic/i]
      @format = pitch[/format.+discussion/i]
      @involvement = pitch[/lead.+participate.+watch/i]
    end
  end

  class Other
    attr_reader :idea

    def initialize(pitch)
      @idea = pitch[/your other idea/i]
    end
  end

  def self.load(csv_file)
    CSV.read(csv_file, headers: true).map do |row|
      new(row)
    end
  end

  def initialize(row)
    @row = row.to_h
  end

  def [](key)
    if key.is_a?(Regexp)
      keys = row.keys.grep(key)
      raise "No matching key: #{key}" if keys.empty?
      raise "Ambiguous key: #{key}" if keys.size > 1

      key = keys.first
    end
    row[key]
  end

  def presenter
    @presenter ||= Presenter.new(self)
  end

  def idea
    @idea ||= Idea.new(self)
  end

  def company
    @company ||= self[/representing\?/] == 'Myself' ? nil : Company.new(self)
  end

  def type
    @type ||=
      case self[/what.s your idea/i]
      when /a show/i
        self[/have a workshop attached/i] =~ /yes/i ? :workshop_to_show : :show

      when /stand-alone workshop/i then :workshop
      when /talk/i then :conference
      when /something else/i then :other
      else raise "Unknown type: #{self[/what.s your idea/i]}"
      end
  end

  def show
    return unless type == :workshop_to_show || type == :show

    @show ||= Show.new(self)
  end

  def workshop
    return unless type == :workshop_to_show || type == :workshop

    @workshop ||= Workshop.new(self)
  end

  def conference
    return unless type == :conference

    @conference ||= Conference.new(self)
  end

  def other
    return unless type == :other

    @other ||= Other.new(self)
  end

  def title
    show&.title || workshop&.title || self[/what.s your idea/i]
  end
end
