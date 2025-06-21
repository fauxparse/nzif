namespace :pitches do
  desc 'Generate a printable version of the pitches'
  task print: :environment do
    input = '/Users/matt/Downloads/pitches2025.csv'
    output = Rails.root.join('tmp/pitches.pdf')

    pitches = PrintablePitch.load(input)

    printer = PitchPrinter.new(pitches)
    printer.render_file(output)
  end
end
