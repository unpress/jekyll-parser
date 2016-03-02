Feature: Post

  Scenario: Parse post
    Given file with content:
    """
    ---
    title: My cool post
    ---
    \# Some heading

    Body of post
    """
    When parsed as post
    Then the parsed post has following metadata:
      | title | My cool post |
    And the parsed post has following body:
    """markdown

    \# Some heading

    Body of post
    """
