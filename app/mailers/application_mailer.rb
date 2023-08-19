class ApplicationMailer < ActionMailer::Base
  helper EmailHelper

  default from: 'registrations@improvfest.nz'
  layout 'mailer'
end
