/**
 * Analytics events definition for El Molino.
 * These events are documented for future integration with Google Analytics or similar.
 * Currently no analytics provider is loaded — this file serves as documentation and stubs.
 */

export type AnalyticsEvent =
  | { name: "page_view"; page: string }
  | { name: "click_create_game" }
  | { name: "click_join_game"; code: string }
  | { name: "join_error"; code: string; error_type: "not_found" | "full" | "finished" | "network" }
  | { name: "game_created"; code: string }
  | { name: "game_joined"; code: string }
  | { name: "waiting_room_view"; code: string }
  | { name: "copy_link"; code: string }
  | { name: "copy_code"; code: string }
  | { name: "opponent_joined"; code: string }
  | { name: "waiting_room_exit"; code: string }
  | { name: "auto_join_attempt"; code: string }
  | { name: "auto_join_success"; code: string }
  | { name: "auto_join_error"; code: string; error_type: "full" | "finished" | "network" | "unknown" }
  | { name: "join_via_form"; code: string }
  | { name: "game_board_view"; code: string }
  | { name: "piece_placed"; code: string; position: number; player: string; pieces_remaining: number }
  | { name: "phase_changed"; code: string; from: string; to: string }
  | { name: "mill_formed"; code: string; player: string }
  | { name: "invalid_move_attempt"; code: string; reason: string }
  | { name: "piece_removed"; code: string; position: number; player_who_removed: string; pieces_remaining_rival: number }
  | { name: "invalid_remove_attempt"; code: string; reason: string }
  | { name: "game_ended_by_elimination"; code: string; winner: string }
  | { name: "piece_moved"; code: string; from: number; to: number; player: string }
  | { name: "piece_selected"; code: string; position: number }
  | { name: "piece_deselected"; code: string }
  | { name: "game_ended_by_block"; code: string; winner: string }
  | { name: "fly_phase_entered"; code: string; player: string; pieces_remaining: number }
  | { name: "piece_flew"; code: string; from: number; to: number; player: string }
  | { name: "game_result_view"; code: string; result: "win" | "loss"; reason: string }
  | { name: "click_new_game_from_result"; code: string }
  | { name: "click_home_from_result"; code: string }
  | { name: "sse_connected"; code: string }
  | { name: "sse_disconnected"; code: string }
  | { name: "sse_reconnected"; code: string }
  | { name: "state_sync"; code: string }
  | { name: "rival_disconnected"; code: string }
  | { name: "rival_reconnected"; code: string }
  | { name: "claim_victory_shown"; code: string }
  | { name: "claim_victory_clicked"; code: string }
  | { name: "game_ended_by_abandon"; code: string; winner: string };

/**
 * Track an analytics event. Currently a no-op stub.
 * Replace the body of this function when integrating an analytics provider.
 */
export function trackEvent(_event: AnalyticsEvent): void {
  // No-op: analytics provider not yet integrated
}
