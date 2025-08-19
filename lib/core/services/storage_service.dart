import 'package:shared_preferences/shared_preferences.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../config/env.dart';

class StorageService {
  static late SharedPreferences _prefs;
  static late Box _authBox;
  static late Box _userBox;
  static late Box _settingsBox;

  static Future<void> init() async {
    // Initialize SharedPreferences
    _prefs = await SharedPreferences.getInstance();

    // Initialize Hive boxes
    _authBox = await Hive.openBox('auth');
    _userBox = await Hive.openBox('user');
    _settingsBox = await Hive.openBox('settings');
  }

  // Authentication Token Management
  static Future<void> saveAuthToken(String token) async {
    await _prefs.setString(Environment.authTokenKey, token);
  }

  static String? getAuthToken() {
    return _prefs.getString(Environment.authTokenKey);
  }

  static Future<void> clearAuthToken() async {
    await _prefs.remove(Environment.authTokenKey);
  }

  // User Data Management
  static Future<void> saveUserData(Map<String, dynamic> userData) async {
    await _prefs.setString(Environment.userDataKey, userData.toString());
    await _userBox.put('current_user', userData);
  }

  static Map<String, dynamic>? getUserData() {
    return _userBox.get('current_user');
  }

  static Future<void> clearUserData() async {
    await _prefs.remove(Environment.userDataKey);
    await _userBox.delete('current_user');
  }

  // App Settings Management
  static Future<void> saveAppSettings(Map<String, dynamic> settings) async {
    await _prefs.setString(Environment.appSettingsKey, settings.toString());
    await _settingsBox.put('app_settings', settings);
  }

  static Map<String, dynamic>? getAppSettings() {
    return _settingsBox.get('app_settings');
  }

  static Future<void> updateAppSetting(String key, dynamic value) async {
    final settings = getAppSettings() ?? {};
    settings[key] = value;
    await saveAppSettings(settings);
  }

  // Cache Management
  static Future<void> saveCacheData(String key, dynamic data) async {
    await _prefs.setString('${Environment.cacheKey}_$key', data.toString());
  }

  static String? getCacheData(String key) {
    return _prefs.getString('${Environment.cacheKey}_$key');
  }

  static Future<void> clearCacheData(String key) async {
    await _prefs.remove('${Environment.cacheKey}_$key');
  }

  static Future<void> clearAllCache() async {
    final keys = _prefs.getKeys();
    for (final key in keys) {
      if (key.startsWith(Environment.cacheKey)) {
        await _prefs.remove(key);
      }
    }
  }

  // Theme and UI Preferences
  static Future<void> saveThemeMode(String themeMode) async {
    await _prefs.setString('theme_mode', themeMode);
  }

  static String getThemeMode() {
    return _prefs.getString('theme_mode') ?? 'system';
  }

  static Future<void> saveLanguage(String language) async {
    await _prefs.setString('language', language);
  }

  static String getLanguage() {
    return _prefs.getString('language') ?? 'en';
  }

  // Notification Settings
  static Future<void> saveNotificationSettings(
      Map<String, bool> settings) async {
    for (final entry in settings.entries) {
      await _prefs.setBool('notification_${entry.key}', entry.value);
    }
  }

  static bool getNotificationSetting(String key, {bool defaultValue = true}) {
    return _prefs.getBool('notification_$key') ?? defaultValue;
  }

  // Location Settings
  static Future<void> saveLocationPermission(bool granted) async {
    await _prefs.setBool('location_permission', granted);
  }

  static bool getLocationPermission() {
    return _prefs.getBool('location_permission') ?? false;
  }

  // First Launch Detection
  static Future<void> setFirstLaunchComplete() async {
    await _prefs.setBool('first_launch_complete', true);
  }

  static bool isFirstLaunch() {
    return !(_prefs.getBool('first_launch_complete') ?? false);
  }

  // Onboarding Status
  static Future<void> setOnboardingComplete() async {
    await _prefs.setBool('onboarding_complete', true);
  }

  static bool isOnboardingComplete() {
    return _prefs.getBool('onboarding_complete') ?? false;
  }

  // Clear All Data (for logout)
  static Future<void> clearAllData() async {
    await _prefs.clear();
    await _authBox.clear();
    await _userBox.clear();
    await _settingsBox.clear();
  }

  // Data Export (for backup)
  static Map<String, dynamic> exportData() {
    return {
      'user_data': getUserData(),
      'app_settings': getAppSettings(),
      'theme_mode': getThemeMode(),
      'language': getLanguage(),
    };
  }

  // Data Import (for restore)
  static Future<void> importData(Map<String, dynamic> data) async {
    if (data['user_data'] != null) {
      await saveUserData(data['user_data']);
    }
    if (data['app_settings'] != null) {
      await saveAppSettings(data['app_settings']);
    }
    if (data['theme_mode'] != null) {
      await saveThemeMode(data['theme_mode']);
    }
    if (data['language'] != null) {
      await saveLanguage(data['language']);
    }
  }
}
