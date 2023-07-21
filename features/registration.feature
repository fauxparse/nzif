Feature: Registration
  Scenario: Register a new user
    Given I am a new user
    And I am on the registration page
    When I fill in my name
    And I fill in my email address
    And I fill in my password
    And I click the "Continue" button
    Then I should be logged in
    And I should see "pronouns"

  Scenario: Register an existing user
    Given I am an existing user
    And I am on the registration page
    And I fill in my name
    And I fill in my email address
    And I fill in my password
    And I click the "Continue" button
    Then I should be logged in

    When I fill in my pronouns
    And I fill in my city
    And I read the code of conduct
    And I click the "next" button
    Then I should see "How workshop selection works"

    When I choose the second workshop as my first choice
    And I choose the first workshop as my second choice
    Then I should see "1 workshop selected"

    When I click the "next" button
    Then I should see "1 workshop @ $60"
    And I should see "Total amount due $60"
    And I should have my preferences recorded

    When I click the "Finalise registration" button
    Then I should see "You’re coming to NZIF!"

  Scenario: Register with a bad password
    Given I am an existing user
    And I am on the registration page
    And I fill in my name
    And I fill in my email address
    And I fill in my password incorrectly
    And I click the "Continue" button
    Then I should see "Sorry"

