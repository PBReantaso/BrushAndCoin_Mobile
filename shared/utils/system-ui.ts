// System UI utilities for consistent theming across platforms

export interface SystemUITheme {
  statusBarColor: string;
  statusBarIconBrightness: 'light' | 'dark';
  statusBarBrightness: 'light' | 'dark';
  systemNavigationBarColor: string;
  systemNavigationBarIconBrightness: 'light' | 'dark';
  systemNavigationBarDividerColor: string;
}

export const SYSTEM_UI_THEMES = {
  RED: {
    statusBarColor: '#FF3C3C',
    statusBarIconBrightness: 'light' as const,
    statusBarBrightness: 'dark' as const,
    systemNavigationBarColor: 'transparent',
    systemNavigationBarIconBrightness: 'light' as const,
    systemNavigationBarDividerColor: 'transparent',
  },
  TRANSPARENT: {
    statusBarColor: 'transparent',
    statusBarIconBrightness: 'light' as const,
    statusBarBrightness: 'dark' as const,
    systemNavigationBarColor: 'transparent',
    systemNavigationBarIconBrightness: 'light' as const,
    systemNavigationBarDividerColor: 'transparent',
  },
  LIGHT: {
    statusBarColor: '#FFFFFF',
    statusBarIconBrightness: 'dark' as const,
    statusBarBrightness: 'light' as const,
    systemNavigationBarColor: '#FFFFFF',
    systemNavigationBarIconBrightness: 'dark' as const,
    systemNavigationBarDividerColor: '#FFFFFF',
  },
} as const;

export const applySystemUITheme = (theme: SystemUITheme): void => {
  // Platform-specific implementation would go here
  // This is a placeholder for the actual system UI styling logic
  console.log('Applying system UI theme:', theme);
};
