import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

class AuthProvider extends ChangeNotifier {
  User? _currentUser;
  bool _isLoading = false;
  String? _error;
  bool _isAuthenticated = false;

  // Getters
  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _isAuthenticated;

  // Login method
  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await ApiService.login(email, password);

      if (response['success'] == true) {
        final userData = response['data']['user'];
        final token = response['data']['token'];

        _currentUser = User.fromJson(userData);
        _isAuthenticated = true;

        // Save token to local storage
        await _saveAuthToken(token);

        _setLoading(false);
        notifyListeners();
        return true;
      } else {
        _setError(response['message'] ?? 'Login failed');
        return false;
      }
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  // Register method
  Future<bool> register({
    required String email,
    required String password,
    required String username,
    required String fullName,
    required String userType,
    List<String>? specializations,
    String? location,
    double? latitude,
    double? longitude,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      final userData = {
        'email': email,
        'password': password,
        'username': username,
        'full_name': fullName,
        'user_type': userType,
        if (specializations != null) 'specializations': specializations,
        if (location != null) 'location': location,
        if (latitude != null) 'latitude': latitude,
        if (longitude != null) 'longitude': longitude,
      };

      final response = await ApiService.register(userData);

      if (response['success'] == true) {
        final userData = response['data']['user'];
        final token = response['data']['token'];

        _currentUser = User.fromJson(userData);
        _isAuthenticated = true;

        // Save token to local storage
        await _saveAuthToken(token);

        _setLoading(false);
        notifyListeners();
        return true;
      } else {
        _setError(response['message'] ?? 'Registration failed');
        return false;
      }
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  // Logout method
  Future<void> logout() async {
    try {
      await ApiService.logout();
    } catch (e) {
      // Continue with logout even if API call fails
      print('Logout API error: $e');
    }

    _currentUser = null;
    _isAuthenticated = false;

    // Clear token from local storage
    await _clearAuthToken();

    notifyListeners();
  }

  // Check if user is already authenticated
  Future<bool> checkAuthStatus() async {
    try {
      final token = await _getAuthToken();
      if (token != null) {
        // Verify token with backend
        // For now, we'll assume token is valid if it exists
        _isAuthenticated = true;
        notifyListeners();
        return true;
      }
    } catch (e) {
      print('Auth status check error: $e');
    }

    _isAuthenticated = false;
    notifyListeners();
    return false;
  }

  // Update user profile
  Future<bool> updateProfile(Map<String, dynamic> profileData) async {
    if (_currentUser == null) return false;

    _setLoading(true);
    _clearError();

    try {
      final response =
          await ApiService.updateUserProfile(_currentUser!.id, profileData);

      if (response['success'] == true) {
        final updatedUserData = response['data'];
        _currentUser = User.fromJson(updatedUserData);

        _setLoading(false);
        notifyListeners();
        return true;
      } else {
        _setError(response['message'] ?? 'Profile update failed');
        return false;
      }
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  // Helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    _isLoading = false;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
    notifyListeners();
  }

  // Local storage methods
  Future<void> _saveAuthToken(String token) async {
    await StorageService.saveAuthToken(token);
  }

  Future<String?> _getAuthToken() async {
    return StorageService.getAuthToken();
  }

  Future<void> _clearAuthToken() async {
    await StorageService.clearAuthToken();
  }

  // Clear error manually
  void clearError() {
    _clearError();
  }
}
