import { MealPeriod } from './entities/meal-periods'

const mealPeriods = new Map([['lunch', 'midi'], ['dinner', 'soir']])

export const responses = {
  signInError: 'Vous devez vous authentifier pour continuer.',
  greetUser: (username: string) =>
    `Bienvenue sur What's for dinner ${username}, je peux te donner le menu ou nous pouvons planifier quelque chose.`,
  sayTodayMeal: (mealPeriod: MealPeriod, meal: string) => `Ce ${mealPeriods[mealPeriod]}, tu as prévu ${meal}.`,
  sayTodayMeals: (meals: string[]) => `Tu as prévu ${meals[0]} pour ce midi et ${meals[1]} pour ce soir.`,
  sayTomorrowMeal: (mealPeriod: MealPeriod, meal: string) => `Demain ${mealPeriods[mealPeriod]}, tu as prévu ${meal}.`,
  sayTomorrowMeals: (meals: string[]) => `Tu as prévu ${meals[0]} pour demain midi et ${meals[1]} pour demain soir.`,
  sayMeals: (dayOfWeek: string, meals: string[]) =>
    `Tu as prévu ${meals[0]} pour ${dayOfWeek} midi et ${meals[1]} pour ${dayOfWeek} soir.`,
  sayMeal: (dayOfWeek: string, mealPeriod: MealPeriod, meals: string[]) =>
    `Tu as prévu ${meals[0]} pour ${dayOfWeek} ${mealPeriods[mealPeriod]}.`,
  sayOKMealCreated: (dayOfWeek: string, mealPeriod: MealPeriod, mealDescription: string) =>
    `OK, j'ai ajouté ${mealDescription} pour ${dayOfWeek} ${mealPeriods[mealPeriod]}.`,
  sayMealAlreadyPlanned: (dayOfWeek: string, mealPeriod: MealPeriod, mealDescription: string) =>
    `Tu as déjà planifié ${mealDescription} pour ${dayOfWeek} ${mealPeriods[mealPeriod]}.`,
  sorryNothingPlanned: `Désolé, rien n'a été planifié.`,
  unhandledError: "Une erreur s'est produite.",
  sayGoodBye: 'Ok, on réeesayera plus tard.',
}
const PLAN_A_MEAL = 'Planifier un repas'
const CONSULT_MY_MENU = 'Consulter mon menu'

export const suggestions = [PLAN_A_MEAL, CONSULT_MY_MENU]
