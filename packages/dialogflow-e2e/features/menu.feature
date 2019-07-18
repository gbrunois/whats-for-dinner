Feature: User schedule a menu
    The user schedule a menu
    @debugging
    Scenario: Plan a menu
        When User say "Je veux planifer les plats du 22 juillet"
        Then Bot say "C'est parti. Planifions les repas de <2019-07-22:dddd DD MMMM>. Que veux-tu manger le midi ?"
        And User say "Je ne sais pas"
        And Bot answer one of this phrases
            | Ok, on verra ça plus tard.                  |
            | On peut se laisser du temps pour réfléchir. |
            | ça marche, passons à autre chose            |