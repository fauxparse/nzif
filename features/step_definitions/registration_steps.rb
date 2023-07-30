module RegistrationHelpers
  def user
    @user ||= FactoryBot.create(:user, email: 'lauren@ipsum.com')
  end

  def festival
    @festival ||= FactoryBot.create(:festival, :with_workshops)
  end

  def current_email_address
    user.email
  end

  def registration
    @registration ||=
      FactoryBot.create(:registration, :code_of_conduct_accepted, user:, festival:)
  end
end

World(RegistrationHelpers)

ParameterType(
  name: 'ordinal',
  regexp: /first|second|third/,
  type: Integer,
  transformer: ->(s) { %w[zeroth first second third].index(s) },
)

Given('earlybird registration is open') do
  travel_to festival.earlybird_opens_at + 1.day
end

Given('I am on the registration page') do
  visit '/register'
  sleep 1
end

Given('I am on the workshop selection page') do
  visit '/register/workshops'
  sleep 1
end

Given('I am a new user') do
  expect(User.count).to be_zero
end

Given('I am an existing user') do
  user
end

Given('I am teaching a workshop') do
  festival.workshops.first.cast.create!(profile: user.profile, role: :tutor)
end

Given('I am logged in') do
  festival
  visit '/'
  click_button 'Log in'
  fill_in 'Email address', with: user.email
  fill_in 'Password', with: 'P4$$w0rd'
  sleep 1
  within('#login-form') do
    click_button 'Log in'
  end
  sleep 1
  expect(page).not_to have_content('New here?')
end

Given('I am registered for the festival') do
  registration
end

When('I fill in my name') do
  fill_in 'Your name', with: 'Lauren Ipsum'
end

When('I fill in my email address') do
  fill_in 'Your email address', with: 'lauren@ipsum.com'
end

When('I fill in my password') do
  fill_in('password', with: 'P4$$w0rd')
end

When('I fill in my password incorrectly') do
  fill_in('password', with: 'wrong move')
end

When('I fill in my pronouns') do
  fill_in('pronouns', with: 'she/her')
end

When('I fill in my city') do
  fill_in('city', with: 'Wellington')
end

When('I click the {string} button') do |button_name|
  click_button button_name
end

When('I read the code of conduct') do
  expect(page).to have_field('codeOfConductAccepted', disabled: true)
  expect(page).to have_content('What is the Code of Conduct?')

  page.execute_script <<~JS
    document.querySelector('.end-of-page').scrollIntoView()
  JS
  expect(page).to have_field('codeOfConductAccepted', disabled: false)

  check('codeOfConductAccepted')
end

When('I choose the {ordinal} workshop as my {ordinal} choice') do |a, b|
  within(".workshop:nth-child(#{a})") do
    click_button("#{%w[Zeroth First Second Third][b]} choice")
  end
end

Then('I should be logged in') do
  @user = User.last!
  expect(User.where(id: user.id)).to exist
  expect(page).not_to have_content('Log in')
end

Then('I should see {string}') do |string|
  expect(page).to have_content(string)
end

Then('I should have my preferences recorded') do
  registration = user
    .registrations
    .includes(preferences: :workshop)
    .last
  workshops = festival.workshops.all
  expect(registration.preferences.sort_by(&:position).map(&:workshop))
    .to eq([workshops.second, workshops.first])
end

Then('workshops in my slot should be disabled') do
  within('.workshop-selection__slot:first-of-type') do
    expect(page).to have_button('First choice', disabled: true)
  end
end
