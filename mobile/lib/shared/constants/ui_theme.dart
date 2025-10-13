// UI Theme constants for consistent styling across platforms

class UITheme {
  // Primary Colors
  static const String primaryRed =
      '#FF3C3C'; // Color.fromARGB(255, 255, 60, 60)
  static const String white = '#FFFFFF';
  static const String backgroundGray = '#F5F5F5';

  // Navigation
  static const double navigationHeight = 60;
  static const double navigationBorderRadius = 20;
  static const double navigationIconSize = 24;

  // Header
  static const double headerBorderRadius = 20;
  static const double headerPadding = 16;

  // Search Bar
  static const double searchBarHeight = 40;
  static const double searchBarBorderRadius = 20;

  // Shadows
  static const String cardShadow = '0px 2px 10px rgba(0, 0, 0, 0.05)';
  static const String navigationShadow = '0px -2px 10px rgba(0, 0, 0, 0.1)';

  // Spacing
  static const double standardPadding = 16;
  static const double smallPadding = 8;
  static const double largePadding = 24;
}

class NavigationItems {
  static const List<Map<String, String>> items = [
    {'icon': 'home', 'label': 'Home'},
    {'icon': 'map', 'label': 'Events'},
    {'icon': 'chat_bubble_outline', 'label': 'Messages'},
    {'icon': 'person_outline', 'label': 'Profile'},
  ];
}
