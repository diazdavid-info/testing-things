export type AnalyticsEvent =
  | 'page_view'
  | 'click_new_game'
  | 'click_how_to_play'
  | 'game_started'
  | 'game_restarted'
  | 'game_finished'
  | 'move_attack'
  | 'move_split'
  | 'split_cancelled'
  | 'split_panel_opened'
  | 'hand_eliminated'
  | 'invalid_move_attempted'
  | 'rematch_started'
  | 'return_to_home'
  | 'tutorial_opened'
  | 'tutorial_closed'
  | 'help_overlay_opened'
  | 'help_overlay_closed'

export function trackEvent(_event: AnalyticsEvent, _data?: Record<string, unknown>): void {
  // Stub — no analytics loaded yet
}
