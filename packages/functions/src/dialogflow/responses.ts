import { MealPeriod } from '../entities/meal-periods'

const mealPeriods = new Map<MealPeriod, string>([['lunch', 'midi'], ['dinner', 'soir']])

export const responses = {
  signInError: "Une erreur s'est produite pendant le processus d'authentification.",
  greetUser: (username: string) =>
    `Bienvenue sur Pyms ${username}, je peux te donner le menu ou nous pouvons planifier quelque chose.`,
  sayTodayMeal: (mealPeriod: MealPeriod, meal: string) => `Ce ${mealPeriods.get(mealPeriod)}, tu as prévu ${meal}.`,
  sayTodayMeals: (meals: string[]) => `Tu as prévu ${meals[0]} pour ce midi et ${meals[1]} pour ce soir.`,
  sayTomorrowMeal: (mealPeriod: MealPeriod, meal: string) =>
    `Demain ${mealPeriods.get(mealPeriod)}, tu as prévu ${meal}.`,
  sayTomorrowMeals: (meals: string[]) => `Tu as prévu ${meals[0]} pour demain midi et ${meals[1]} pour demain soir.`,
  sayMeals: (dayOfWeek: string, meals: string[]) =>
    `Tu as prévu ${meals[0]} pour ${dayOfWeek} midi et ${meals[1]} pour ${dayOfWeek} soir.`,
  sayMeal: (dayOfWeek: string, mealPeriod: MealPeriod, meals: string[]) =>
    `Tu as prévu ${meals[0]} pour ${dayOfWeek} ${mealPeriods.get(mealPeriod)}.`,
  sayOKMealCreated: (dayOfWeek: string, mealPeriod: MealPeriod, mealDescription: string) =>
    `OK, j'ai ajouté ${mealDescription} pour ${dayOfWeek} ${mealPeriods.get(mealPeriod)}.`,
  sayMealAlreadyPlanned: (dayOfWeek: string, mealPeriod: MealPeriod, mealDescription: string) =>
    `Tu as déjà planifié ${mealDescription} pour ${dayOfWeek} ${mealPeriods.get(mealPeriod)}.`,
  unhandledError: "Une erreur s'est produite.",
  sayGoodBye: 'Ok, on réesayera plus tard.',
  sayNothingIsPlannedToday: (mealPeriod: MealPeriod | undefined) => {
    if (!mealPeriod) return `Rien n'a été planifié pour aujourd'hui.`
    else return `Rien n'a été planifié pour ce ${mealPeriods.get(mealPeriod)}.`
  },
  sayNothingIsPlannedTomorrow: (mealPeriod: MealPeriod | undefined) => {
    if (!mealPeriod) return `Rien n'a été planifié pour demain.`
    else return `Rien n'a été planifié pour demain ${mealPeriods.get(mealPeriod)}.`
  },
  sayNothingIsPlanned: (dayOfWeek: string, mealPeriod: MealPeriod | undefined) => {
    if (!mealPeriod) return `Rien n'a été planifié pour ${dayOfWeek}.`
    else return `Rien n'a été planifié pour ${dayOfWeek} ${mealPeriods.get(mealPeriod)}.`
  },
  sayTodayMealAndNothingIsPlannedForLunch: (meal: string) =>
    `Rien n'a été planifié pour ce midi et tu as prévu ${meal} pour ce soir.`,
  sayTodayMealAndNothingIsPlannedForDinner: (meal: string) =>
    `Rien n'a été planifié pour ce soir et tu as prévu ${meal} pour ce midi.`,
  sayTomorrowMealAndNothingIsPlannedForLunch: (meal: string) =>
    `Rien n'a été planifié pour demain midi et tu as prévu ${meal} pour demain soir.`,
  sayTomorrowMealAndNothingIsPlannedForDinner: (meal: string) =>
    `Rien n'a été planifié pour demain soir et tu as prévu ${meal} pour demain midi.`,
  sayMealAndNothingIsPlannedForLunch: (dayOfWeek: string, meal: string) =>
    `Rien n'a été planifié pour ${dayOfWeek} midi et tu as prévu ${meal} pour ${dayOfWeek} soir.`,
  sayMealAndNothingIsPlannedForDinner: (dayOfWeek: string, meal: string) =>
    `Rien n'a été planifié pour ${dayOfWeek} soir et tu as prévu ${meal} pour ${dayOfWeek} midi.`,
  askForPlanAMeal: 'Veux-tu ajouter un repas ?',
}
const PLAN_A_MEAL = 'Planifier un repas'
const CONSULT_MY_MENU = 'Consulter mon menu'
const LEAVE = 'Quitter'

export const welcome_suggestions = [PLAN_A_MEAL, CONSULT_MY_MENU, LEAVE]

export const yesOrNoSuggestions = ['oui', 'non']
