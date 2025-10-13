// Navigation types for consistent navigation handling

class NavigationItem {
  final String icon;
  final String label;

  const NavigationItem({
    required this.icon,
    required this.label,
  });
}

class NavigationState {
  final int currentIndex;
  final String selectedTab;

  const NavigationState({
    required this.currentIndex,
    required this.selectedTab,
  });
}

class NavigationConfig {
  final List<NavigationItem> items;
  final Function(int) onTabChange;

  const NavigationConfig({
    required this.items,
    required this.onTabChange,
  });
}

class NavigationRoutes {
  static const String home = '/home';
  static const String events = '/events';
  static const String messaging = '/messaging';
  static const String profile = '/profile';
  static const String settings = '/settings';
}
