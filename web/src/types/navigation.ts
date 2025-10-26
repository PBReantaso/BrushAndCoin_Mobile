// Navigation types for consistent navigation handling

export interface NavigationItem {
  icon: string;
  label: string;
}

export interface NavigationState {
  currentIndex: number;
  selectedTab: string;
}

export interface NavigationConfig {
  items: NavigationItem[];
  onTabChange: (index: number) => void;
}

export const NAVIGATION_ROUTES = {
  HOME: '/home',
  EVENTS: '/events',
  MESSAGING: '/messaging',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export type NavigationRoute = typeof NAVIGATION_ROUTES[keyof typeof NAVIGATION_ROUTES];
