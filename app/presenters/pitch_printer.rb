require 'prawn'

class PitchPrinter
  attr_reader :pitches, :pdf, :pitches_by_page

  def initialize(pitches)
    @pitches = pitches
    @pdf = Prawn::Document.new(page_size: 'A4', margin: [30, 30, 90, 30],
      skip_page_generation: true)
    @pitches_by_page = []

    register_fonts
    print_pitches
  end

  delegate :render_file, to: :pdf

  private

  def print_pitches
    pdf.repeat(:all, dynamic: true) do
      footer
    end

    pitches.each.with_index do |pitch, i|
      if i.positive?
        pdf.start_new_page
        pdf.start_new_page if pdf.page_number.even?
      end
      pitches_by_page << [pdf.page_number, pitch]

      print_pitch(pitch)
    end
  end

  def footer
    _, pitch = pitches_by_page.reject { |n, _| n > pdf.page_number }.last
    return unless pitch

    pdf.bounding_box([pdf.bounds.left, pdf.bounds.bottom - 30], width: pdf.bounds.width,
      height: 30) do
      pdf.stroke_horizontal_rule
      pdf.font_size(10) do
        move_down
        pdf.text pitch.presenter.name
      end
    end
  end

  def move_down(amount = 1)
    amount.times { pdf.move_down 12 }
  end

  def print_pitch(pitch)
    @current_pitch = pitch
    pdf.font_size(16) do
      pdf.text "#{pitch.presenter.name} #{pitch.presenter.pronouns.present? ? "(#{pitch.presenter.pronouns.downcase})" : ''}"
      pdf.text pitch.presenter.location
    end
    move_down
    # print_title(pitch)

    print_presenter(pitch.presenter)
    print_idea(pitch.idea)

    # print_show(pitch.show)
    # print_workshop(pitch.workshop)
    # print_conference(pitch.conference)
    # print_other(pitch.other)
  end

  def print_title(pitch)
    return if pitch.type == :other || pitch.type == :conference

    pdf.font_size(32) { pdf.text pitch.title }
    move_down
  end

  def print_show(show)
    return if show.blank?

    pdf.stroke_horizontal_rule
    move_down

    pdf.font_size(16) { pdf.text 'Show' }
    move_down

    pdf.text show.description
    move_down

    field 'Casting', show.casting
    field 'Who is involved?', show.who
    field 'Technical requirements', show.tech
    field 'Have you performed this show before?', show.previous
    field 'Who is your ideal audience for this show?', show.audience
    field 'Why do you think this show should be included?', show.why
    field 'How is your show accessible?', show.accessible

    move_down(2)
  end

  def print_workshop(workshop)
    return if workshop.blank?

    pdf.stroke_horizontal_rule
    move_down

    pdf.font_size(16) { pdf.text 'Workshop' }
    move_down

    pdf.text workshop.description
    move_down

    field 'Have you taught this workshop before?', workshop.previous
    field 'Workshop size', workshop.size
    field 'Required experience/skills', workshop.experience
    field 'Takeaways', workshop.takeaways
    field 'Access considerations', workshop.accessibility

    move_down(2)
  end

  def print_conference(conference)
    return if conference.blank?

    pdf.stroke_horizontal_rule
    move_down

    pdf.font_size(16) { pdf.text 'Conference' }
    move_down

    pdf.text conference.topic
    move_down

    field 'Format', conference.format
    field 'How would you like to be involved?', conference.involvement

    move_down(2)
  end

  def print_other(other)
    return if other.blank?

    pdf.stroke_horizontal_rule
    move_down

    pdf.font_size(16) { pdf.text 'Other idea' }
    move_down

    pdf.text other.idea

    move_down(2)
  end

  def print_presenter(presenter)
    pdf.stroke_horizontal_rule
    move_down

    field 'Introduction', presenter.bio
    field 'My group/company', presenter.group
    field 'Inclusivity', presenter.identity
    field 'Collaborators', presenter.others
    field 'Availability', presenter.availability
    field 'Accessibility', presenter.accessibility
  end

  def print_idea(idea)
    pdf.stroke_horizontal_rule
    move_down

    field 'What sort of thing are you thinking of?', idea.what
    field 'Brief outline', idea.outline
    field 'Does it fit our regular structure?', idea.structure
    field 'Participant experience', idea.participant_experience
    field 'Ideal audience', idea.audience
    field 'Have you done this before?', idea.previous
    field 'How does your idea vibe with our core themes?', idea.vibe
    field 'Accessibility', idea.accessibility
    field 'Space/technical requirements', idea.requirements
    field 'Cast/personnel', idea.cast
    field 'Would you like help developing your idea?', idea.mentoring
    field 'Anything else', idea.anything_else

    move_down(2)
  end

  def field(label, value)
    pdf.formatted_text [{ text: label, styles: [:bold] }]
    if value.present?
      pdf.text value
    else
      pdf.text '(No response)', color: [0, 0, 0, 50]
    end
    move_down
  end

  def register_fonts
    pdf.font_families.update(
      'Barlow' => {
        normal: Rails.root.join('app/presenters/fonts/Barlow-Regular.ttf'),
        bold: Rails.root.join('app/presenters/fonts/Barlow-Bold.ttf'),
      },
    )

    pdf.font 'Barlow'
    pdf.font_size 10
    pdf.default_leading 3
  end
end
