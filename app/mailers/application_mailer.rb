class ApplicationMailer < ActionMailer::Base
  helper EmailHelper

  default from: 'registrations+2023@improvfest.nz'
  layout 'mailer'
end
