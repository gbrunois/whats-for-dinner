@schedule-menu
Feature: User schedule a menu
    The user schedule a menu

    Background: A planning:
        Given A planning

    Scenario: Ask to plan a menu and say no
        When User say "Je veux planifer les plats de demain"
        Then Bot say "Les menus du <J+1:dddd DD MMMM> ont déjà été planifiés. Veux-tu planifier un autre jour ou consulter le menu ?"
        And User say "Non"
        And Bot say "A bientôt"

    @debugging
    Scenario: Plan a menu
        When User say "Je veux planifer les plats de demain"
        Then Bot say "Les menus du <J+1:dddd DD MMMM> ont déjà été planifiés. Veux-tu planifier un autre jour ou consulter le menu ?"
        And User say "Je veux planifer les plats du 22 juillet"
        And Bot say "C'est parti. Planifions les repas de <2019-07-22:dddd DD MMMM>. Que veux-tu manger le midi ?"
        And User say "Des pâtes carbonara"
        And Bot say "OK, j'ai ajouté pâtes carbonara pour <2019-07-22:dddd DD MMMM> midi. Que veux-tu manger le soir ?"
        And User say "de la soupe aux oignons avec pain et fromage"
        And Bot say "OK, j'ai ajouté soupe aux oignons avec pain et fromage pour <2019-07-22:dddd DD MMMM> soir. Veux-tu planifier un autre jour ou consulter le menu ?"
        And User say "Non"
        And Bot say "A bientôt"

    Scenario: Plan a menu
        When User say "Je veux planifer les plats du 22 juillet"
        Then Bot say "C'est parti. Planifions les repas de <2019-07-22:dddd DD MMMM>. Que veux-tu manger le midi ?"
        And User say "Je ne sais pas"
        And Bot answer one of this phrases
            | Ok, on verra ça plus tard.                  |
            | On peut se laisser du temps pour réfléchir. |
            | ça marche, passons à autre chose            |