// UI Theme constants for consistent styling across platforms

export const UI_THEME = {
  // Primary Colors
  PRIMARY_RED: '#FF3C3C', // Color.fromARGB(255, 255, 60, 60)
  WHITE: '#FFFFFF',
  BACKGROUND_GRAY: '#F5F5F5',
  
  // Navigation
  NAVIGATION_HEIGHT: 60,
  NAVIGATION_BORDER_RADIUS: 20,
  NAVIGATION_ICON_SIZE: 24,
  
  // Header
  HEADER_BORDER_RADIUS: 20,
  HEADER_PADDING: 16,
  
  // Search Bar
  SEARCH_BAR_HEIGHT: 40,
  SEARCH_BAR_BORDER_RADIUS: 20,
  
  // Shadows
  CARD_SHADOW: '0px 2px 10px rgba(0, 0, 0, 0.05)',
  NAVIGATION_SHADOW: '0px -2px 10px rgba(0, 0, 0, 0.1)',
  
  // Spacing
  STANDARD_PADDING: 16,
  SMALL_PADDING: 8,
  LARGE_PADDING: 24,
} as const;

export const NAVIGATION_ITEMS = [
  { icon: 'home', label: 'Home' },
  { icon: 'map', label: 'Events' },
  { icon: 'chat_bubble_outline', label: 'Messages' },
  { icon: 'person_outline', label: 'Profile' },
] as const;
