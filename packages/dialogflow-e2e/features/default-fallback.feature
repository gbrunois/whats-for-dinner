@default-fallback
Feature: User say unknow intents

  Background: A planning:
    Given A planning
      | Date | Lunch | Dinner           |
      | J    | YY    | Croques monsieur |

  Scenario: Say anything
    When User say "Prout"
    And Bot answer one of this phrases
      | Désolé, je n'ai pas compris ta demande. |
      | Comment ? Je n'ai pas tout compris.     |

  Scenario: Say anything two time
    When User say "Prout"
    And Bot answer one of this phrases
      | Désolé, je n'ai pas compris ta demande. |
      | Comment ? Je n'ai pas tout compris.     |
    When User say "Restaurant"
    And Bot answer one of this phrases
      | Désolé, je n'ai pas compris ta demande. |
      | Comment ? Je n'ai pas tout compris.     |

  Scenario: Say anything and say reconized intents
    When User say "Prout"
    And Bot answer one of this phrases
      | Désolé, je n'ai pas compris ta demande. |
      | Comment ? Je n'ai pas tout compris.     |
    When User say "Je veux savoir ce qu'on mange ce soir"
    And Bot say "Ce soir, tu as prévu Croques monsieur."