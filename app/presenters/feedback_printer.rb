require 'prawn'

class FeedbackPrinter
  attr_reader :workshops, :pdf, :workshops_by_page

  def initialize(workshops)
    @workshops = workshops
    @pdf = Prawn::Document.new(page_size: 'A4', margin: [30, 30, 30, 30],
      skip_page_generation: true)
    @workshops_by_page = []

    register_fonts
    print_workshops
  end

  delegate :render_file, to: :pdf

  private

  def print_workshops
    workshops.each.with_index do |workshop, i|
      pdf.start_new_page if i.positive?
      workshops_by_page << [pdf.page_number, workshop]

      print_workshop(workshop)
    end
  end

  def move_down(amount = 1)
    amount.times { pdf.move_down 12 }
  end

  def print_workshop(workshop)
    @current_workshop = workshop
    pdf.font_size(16) do
      pdf.text workshop.cast.map { |c| c.profile.name }.to_sentence
    end
    move_down
    pdf.font_size(32) { pdf.text workshop.name }
    move_down
    print_feedback(
      workshop,
      :positive,
      'What did you like about this workshop? What did the tutor(s) do well?',
    )
    print_feedback(
      workshop,
      :constructive,
      'What could have gone better? What could the tutor improve for next time?',
    )
    print_feedback(
      workshop,
      :testimonial,
      'Would you like to leave a testimonial for the tutor(s) to use in future marketing?',
    )
  end

  def print_feedback(workshop, key, label)
    pdf.stroke_horizontal_rule
    move_down

    pdf.font_size(16) { pdf.text label }
    move_down

    responses = workshop.feedback.map(&key).compact_blank.shuffle
    if responses.any?
      responses.each do |response|
        pdf.text response
        move_down
      end
    else
      pdf.text '(No responses)', color: [0, 0, 0, 50]
      move_down
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
