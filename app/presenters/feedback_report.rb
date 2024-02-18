# rubocop:disable Metrics/MethodLength Metrics/ClassLength Metrics/LineLength
require 'prawn/measurement_extensions'

class FeedbackReport
  attr_reader :festival

  def initialize(festival:)
    @festival = festival
  end

  def generate(filename:)
    Prawn::Document.generate(filename, page_size: 'A4') do |pdf|
      load_fonts(pdf:)

      pdf.font 'DINRoundPro' do
        activities.each.with_index do |activity, index|
          pdf.start_new_page unless index.zero?
          pdf.text activity.name, size: 24, style: :bold
          presenters = activity.tutors.map do |p|
            p.profile.name
          end
          pdf.text presenters.to_sentence, size: 18

          star_rating pdf, activity

          write_feedback pdf, activity
        end
      end
    end
  end

  def activities
    @activities ||= festival.activities
      .joins('INNER JOIN sessions ON sessions.activity_id = activities.id')
      .includes(:feedback)
      .where(type: 'Workshop')
      .group('activities.id')
      .order('activities.name ASC')
  end

  def sessions
    @sessions ||= festival.sessions
      .includes(:feedback, :activity)
      .where(activity_type: 'Workshop')
  end

  private

  FONT_DIR = Rails.root.join('app/frontend/fonts')

  def load_fonts(pdf:)
    pdf.font_families.update(
      'DINRoundPro' => {
        normal: "#{FONT_DIR}/DINRoundPro.ttf",
        bold: "#{FONT_DIR}/DINRoundPro-Bold.ttf",
      },
    )
  end

  def star_points(x, y) # rubocop:disable Naming/MethodParameterName
    (0...5).map do |i|
      [x + (6.mm * Math.sin(i * 4 * Math::PI / 5)), y + (6.mm * Math.cos(i * 4 * Math::PI / 5))]
    end
  end

  def star_rating(pdf, session)
    ratings = session.feedback.map(&:rating).compact
    return if ratings.empty?

    rating = ratings.sum.to_f / ratings.size

    pdf.bounding_box([0, pdf.cursor], width: 7.cm, height: 1.cm) do
      pdf.fill_color 'eeeeee'

      7.times do |i|
        pdf.fill_rounded_polygon(5, *star_points((i + 0.5).cm, 0.5.cm))
      end

      pdf.save_graphics_state do
        pdf.soft_mask do
          pdf.fill_color 'ffffff'
          pdf.fill_rectangle([0, 10.mm], rating.cm, 10.mm)
        end

        pdf.fill_color '000000'
        7.times do |i|
          pdf.fill_rounded_polygon(5, *star_points((i + 0.5).cm, 0.5.cm))
        end
      end

      pdf.fill_color '000000'
    end

    pdf.move_down 6.pt
    pdf.text "#{rating.round(1)}/7 (#{ratings.length} #{'rating'.pluralize(ratings.length)})"
  end

  def write_feedback(pdf, session)
    feedback_section(
      pdf,
      session,
      'What do you think went really well in this workshop?',
      :positive,
    )
    feedback_section(
      pdf,
      session,
      'Could anything have helped you get more out of this workshop?',
      :constructive,
    )
    feedback_section(
      pdf,
      session,
      'Would you like to provide a testimonial for the workshop tutor? ' \
      'This can help them bring the work to new groups at other festivals.',
      :testimonial,
    )
  end

  def feedback_section(pdf, session, heading, field)
    pdf.move_down 24.pt

    pdf.text heading, size: 18, style: :bold
    feedback = session.feedback.map(&field).map(&:strip).compact_blank.shuffle

    if feedback.any?
      feedback.each do |line|
        pdf.move_down 6.pt
        pdf.text line.chomp.gsub(/\n+/, "\n"), size: 12.pt, leading: 6.pt
      end
    else
      pdf.save_graphics_state do
        pdf.fill_color 'cccccc'
        pdf.text '(No feedback in this section)'
      end
    end
  end
end

# rubocop:enable Metrics/MethodLength Metrics/ClassLength Metrics/LineLength
