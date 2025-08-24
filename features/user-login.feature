# This is a comment within the feature file.
Feature: User Login Functionality

  As a registered user
  I want to be able to log in to my account
  So that I can access my personalized content

  Scenario: Successful Login with Valid Credentials
    Given I am on the login page
    When I enter my valid username and password
    And I click the "Login" button
    Then I should be redirected to my dashboard

  Scenario Outline: Login with Invalid Credentials
    Given I am on the login page
    When I enter "<username>" and "<password>"
    And I click the "Login" button
    Then I should see an error message "Invalid credentials"

    Examples:
      | username       | password   |
      | invalid_user_1 | wrong_pass |
      | invalid_user_2 | 12345      |
