class ApplicationMailer < ActionMailer::Base
  helper EmailHelper

  default from: 'matt@improvfest.nz'
  layout 'mailer'
end
