@consult-menu
Feature: User ask for the menu
  The user ask for a menu

  Background: A planning:
    Given A planning
      | Date | Lunch            | Dinner    |
      | J    | Saucisses frites | Camembert |
      | J+1  | Pâtes au thon    | Fajitas   |

  Scenario: Ask to consult what we eat tonight
    When User say "Je veux savoir ce que l'on mange ce soir"
    Then Bot say "Ce soir, tu as prévu Camembert."

  Scenario: Ask to consult what we eat for lunch
    When User say "Qu'est-ce qu'on mange demain midi"
    Then Bot say "Demain midi, tu as prévu Pâtes au thon."

  Scenario: Ask to consult what we eat today
    When User say "Qu'est-ce qu'on mange aujourd'hui"
    Then Bot say "Tu as prévu Saucisses frites pour ce midi et Camembert pour ce soir."

  Scenario: Ask to consult what we eat today. Lunch is not planned
    Given A planning
      | Date | Lunch | Dinner    |
      | J    |       | Camembert |
    When User say "Qu'est-ce qu'on mange aujourd'hui"
    Then Bot say "Rien n'a été planifié pour ce midi et tu as prévu Camembert pour ce soir."

  Scenario: Ask to consult menu
    When User say "Je veux consulter le menu"
    Then Bot say "Tu as prévu Saucisses frites pour ce midi et Camembert pour ce soir."

  Scenario: Ask to consult what we eat for lunch and follow-up
    When User say "Qu'est-ce qu'on mange demain midi"
    Then Bot say "Demain midi, tu as prévu Pâtes au thon."
    Then User say "Et qu'est qu'on mange demain soir ?"
    Then Bot say "Demain soir, tu as prévu Fajitas."
    Then User say "Et pour le midi ?"
    Then Bot say "Demain midi, tu as prévu Pâtes au thon."
    Then User say "Et pour <J+2:dddd> soir ?"
    Then Bot say "Rien n'a été planifié pour <J+2:dddd> soir. Veux-tu ajouter un repas ?"
    Then User say "Non"
    Then Bot say "Ok, on verra ça plus tard"

  Scenario: Nothing is planned. Don't want to plan something
    When User say "Qu'est-ce qu'on mange <J+2:dddd>"
    Then Bot say "Rien n'a été planifié pour <J+2:dddd>. Veux-tu ajouter un repas ?"
    Then User say "Non"
    Then Bot say "Ok, on verra ça plus tard"

  Scenario: Nothing is planned tonight. Don't want to plan something tonight
    When User say "Qu'est-ce qu'on mange <J+2:dddd> soir"
    Then Bot say "Rien n'a été planifié pour <J+2:dddd> soir. Veux-tu ajouter un repas ?"
    Then User say "Non"
    Then Bot say "Ok, on verra ça plus tard"

  Scenario: Nothing was planned. User plan the dinner
    When User say "Je veux consulter le menu du <J+2:dddd D MMMM> midi"
    Then Bot say "Rien n'a été planifié pour <J+2:dddd> midi. Veux-tu ajouter un repas ?"
    Then User say "Oui"
    And Bot say "Ok, quel plat veux-tu manger ?"
    And User say "des pâtes carbonara"
    And Bot say "OK, j'ai ajouté pâtes carbonara pour <J+2:dddd> midi. Veux-tu planifier autre chose ou consulter le menu ?"
    And User say "Non"
    And Bot say "Ok, à bientôt"
    And The planning is
      | Date | Lunch            | Dinner    |
      | J    | Saucisses frites | Camembert |
      | J+1  | Pâtes au thon    | Fajitas   |
      | J+2  | pâtes carbonara  |           |

  Scenario: Nothing was planned. User plan the dinner
    When User say "Je veux consulter le menu du <J+2:dddd D MMMM> au soir"
    Then Bot say "Rien n'a été planifié pour <J+2:dddd> soir. Veux-tu ajouter un repas ?"
    Then User say "Oui"
    And Bot say "Ok, quel plat veux-tu manger ?"
    And User say "des pâtes carbonara"
    And Bot say "OK, j'ai ajouté pâtes carbonara pour <J+2:dddd> soir. Veux-tu planifier autre chose ou consulter le menu ?"
    And User say "Non merci"
    And Bot say "Ok, à bientôt"
    And The planning is
      | Date | Lunch            | Dinner          |
      | J    | Saucisses frites | Camembert       |
      | J+1  | Pâtes au thon    | Fajitas         |
      | J+2  |                  | pâtes carbonara |

  Scenario: Nothing was planned. User want to planned something
    When User say "Je veux consulter le menu du <J+2:dddd D MMMM> "
    Then Bot say "Rien n'a été planifié pour <J+2:dddd>. Veux-tu ajouter un repas ?"
    Then User say "Oui"
    And Bot say "C'est parti. Planifions les repas de <J+2:dddd D MMMM>. Que veux-tu manger le midi ?"
    And User say "Des pâtes carbonara"
    And Bot say "OK, j'ai ajouté pâtes carbonara pour <J+2:dddd> midi. Que veux-tu manger le soir ?"
    And User say "de la soupe aux oignons avec pain et fromage"
    And Bot say "OK, j'ai ajouté soupe aux oignons avec pain et fromage pour <J+2:dddd> soir. Veux-tu planifier un autre jour ou consulter le menu ?"
    And User say "Non ça ira"
    And Bot say "Ok, à bientôt"
    And The planning is
      | Date | Lunch            | Dinner                                 |
      | J    | Saucisses frites | Camembert                              |
      | J+1  | Pâtes au thon    | Fajitas                                |
      | J+2  | pâtes carbonara  | soupe aux oignons avec pain et fromage |