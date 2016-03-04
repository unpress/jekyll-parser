Feature: Project

  Scenario: Project with one layout

    Given project with following file structure:
      | filename              |
      | _layouts/default.html |
    When I parse the project
    Then the parsed project should have 1 layout
    And the first layout should be named "default"
  Scenario: Project with posts

    Given project
    And file "_posts/2016-03-04-a-post.md" with content:
    """
    ---
    title: A post
    ---
    
    Content
    """
    When I parse the project
    Then the parsed project should have 1 post
    And the first post should have title "A post"

