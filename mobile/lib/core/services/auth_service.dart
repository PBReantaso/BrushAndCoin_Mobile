import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../models/user_model.dart';
import 'auth_response.dart';

class AuthService {
  //static const String baseUrl = 'http://10.0.2.2:3000/api'; // For Android emulator
  // static const String baseUrl = 'http://localhost:3000/api'; // For iOS simulator
  static const String baseUrl = 'http://3000:3000/api'; // For real device

  Future<AuthResponse> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String userType
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/register'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'email': email,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
        'usertype': userType,
      }),
    );

    if (response.statusCode == 201) {
      final data = json.decode(response.body);
      final authResponse = AuthResponse.fromJson(data);
      
      // Save token
      await _saveToken(authResponse.token);
      await _saveUser(authResponse.user);
      
      return authResponse;
    } else {
      final error = json.decode(response.body);
      throw Exception(error['error'] ?? 'Registration failed');
    }
  }

  Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final authResponse = AuthResponse.fromJson(data);
      
      // Save token and user
      await _saveToken(authResponse.token);
      await _saveUser(authResponse.user);
      
      return authResponse;
    } else {
      final error = json.decode(response.body);
      throw Exception(error['error'] ?? 'Login failed');
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('user');
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<User?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userString = prefs.getString('user');
    if (userString != null) {
      final userMap = json.decode(userString);
      return User.fromJson(userMap);
    }
    return null;
  }

  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null;
  }

  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }

  Future<void> _saveUser(User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user', json.encode({
      'id': user.id,
      'email': user.email,
      'firstName': user.firstName,
      'lastName': user.lastName,
    }));
  }
}