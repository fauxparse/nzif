# frozen_string_literal: true

require 'mini_magick'

# ImageMagick 7 deprecates the `convert` command (and `magick convert`); only
# bare `magick <args>` is warning-free. mini_magick always emits
# `magick convert ...` under IM7, so `Tool::Convert` is patched to drop the
# `convert` subcommand. `magick` with no subcommand is the IM7 convert tool.
# ponytail: monkeypatch — revisit if mini_magick gains native support for the
# bare-`magick` form. Only affects `convert`; `identify`/`mogrify` already warn.
return unless MiniMagick.imagemagick7?

MiniMagick::Tool::Convert.class_eval do
  def executable
    exe = Array(MiniMagick.cli_prefix).dup
    exe << 'magick'
    exe.unshift(File.join(MiniMagick.cli_path, exe.shift)) if MiniMagick.cli_path
    exe
  end
end
