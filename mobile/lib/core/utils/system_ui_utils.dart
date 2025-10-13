// System UI overlay style utilities for consistent theming

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class SystemUIUtils {
  // Red theme system UI overlay style
  static const SystemUiOverlayStyle redTheme = SystemUiOverlayStyle(
    statusBarColor: Color.fromARGB(255, 255, 60, 60), // Red status bar
    statusBarIconBrightness:
        Brightness.light, // White icons for dark background
    statusBarBrightness: Brightness.dark, // For iOS
    systemNavigationBarColor:
        Colors.transparent, // Transparent navigation bar for custom rounded bar
    systemNavigationBarIconBrightness:
        Brightness.light, // White navigation icons
    systemNavigationBarDividerColor:
        Colors.transparent, // Transparent navigation divider
  );

  // Transparent status bar style
  static const SystemUiOverlayStyle transparent = SystemUiOverlayStyle(
    statusBarColor: Colors.transparent, // Transparent status bar
    statusBarIconBrightness: Brightness.light, // White icons
    statusBarBrightness: Brightness.dark, // For iOS
    systemNavigationBarColor: Colors.transparent, // Transparent navigation bar
    systemNavigationBarIconBrightness:
        Brightness.light, // White navigation icons
  );

  // Default light theme
  static const SystemUiOverlayStyle light = SystemUiOverlayStyle(
    statusBarColor: Colors.white,
    statusBarIconBrightness: Brightness.dark, // Dark icons for light background
    statusBarBrightness: Brightness.light, // For iOS
    systemNavigationBarColor: Colors.white,
    systemNavigationBarIconBrightness: Brightness.dark, // Dark navigation icons
  );

  // Apply red theme to status bar and navigation bar
  static void applyRedTheme() {
    SystemChrome.setSystemUIOverlayStyle(redTheme);
  }

  // Apply transparent theme
  static void applyTransparentTheme() {
    SystemChrome.setSystemUIOverlayStyle(transparent);
  }

  // Apply light theme
  static void applyLightTheme() {
    SystemChrome.setSystemUIOverlayStyle(light);
  }
}
