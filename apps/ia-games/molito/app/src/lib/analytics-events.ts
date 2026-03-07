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
  | { name: "game_joined"; code: string };

/**
 * Track an analytics event. Currently a no-op stub.
 * Replace the body of this function when integrating an analytics provider.
 */
export function trackEvent(_event: AnalyticsEvent): void {
  // No-op: analytics provider not yet integrated
}
