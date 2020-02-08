export const INTENTS = {
  WELCOME: 'Default Welcome Intent',
  SIGN_IN: 'Get Sign In',

  SCHEDULE_MENU_WAITING_MEAL: 'schedule-menu:waiting-meal',
  SCHEDULE_MENU_WAITING_MEAL_CONTEXT_WAITING_DAY: 'schedule-menu:waiting-meal - context:schedule-menu-waiting-day',
  SCHEDULE_MENU_WAITING_MEAL_CONTEXT: 'schedule-menu - context:schedule-menu-waiting-meal',
  SCHEDULE_MENU_WAITING_DATE_FALLBACK: 'schedule-menu:waiting-date - context:schedule-menu-waiting-date - fallback',
  SCHEDULE_MENU_MENU_CREATE: 'schedule-menu - menu.create',
  SCHEDULE_MENU_MENU_REPLACE: 'schedule-menu - menu.replace',
  SCHEDULE_MENU_REPLACE_MEAL_FALLBACK: 'schedule-menu - context:replace-meal - fallback',
  SCHEDULE_MENU_REPLACE_MEAL_NO: 'schedule-menu - context:replace-meal - no',
  SCHEDULE_MENU_REPLACE_MEAL_YES: 'schedule-menu - context:replace-meal - yes',
  SCHEDULE_MENU_MENU_ASK_FOLLOWUP_YES: 'schedule-menu - context:menuask-followup - yes',
  SCHEDULE_MENU_MENU_ASK_FOLLOWUP_NO: 'schedule-menu - context:menuask-followup - no',
}
