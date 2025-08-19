import 'dart:convert';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static late Dio _dio;
  static const String _baseUrl = 'https://api.brushandcoin.com'; // Replace with your actual API URL
  static const String _apiVersion = '/api/v1';
  
  // API Endpoints
  static const String _auth = '/auth';
  static const String _users = '/users';
  static const String _artworks = '/artworks';
  static const String _commissions = '/commissions';
  static const String _payments = '/payments';
  static const String _messages = '/messages';
  static const String _reviews = '/reviews';
  static const String _events = '/events';
  
  static Future<void> init() async {
    _dio = Dio(BaseOptions(
      baseUrl: _baseUrl + _apiVersion,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));
    
    // Add interceptors for authentication and error handling
    _dio.interceptors.addAll([
      _AuthInterceptor(),
      _ErrorInterceptor(),
      _LoggingInterceptor(),
    ]);
  }
  
  // Authentication
  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _dio.post('$_auth/login', data: {
        'email': email,
        'password': password,
      });
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  static Future<Map<String, dynamic>> register(Map<String, dynamic> userData) async {
    try {
      final response = await _dio.post('$_auth/register', data: userData);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  static Future<void> logout() async {
    try {
      await _dio.post('$_auth/logout');
      await _clearAuthToken();
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  // User Management
  static Future<Map<String, dynamic>> getUserProfile(String userId) async {
    try {
      final response = await _dio.get('$_users/$userId');
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  static Future<Map<String, dynamic>> updateUserProfile(String userId, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put('$_users/$userId', data: data);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  // Artwork Management
  static Future<List<Map<String, dynamic>>> getArtworks({Map<String, dynamic>? filters}) async {
    try {
      final response = await _dio.get(_artworks, queryParameters: filters);
      return List<Map<String, dynamic>>.from(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  static Future<Map<String, dynamic>> createArtwork(Map<String, dynamic> artworkData) async {
    try {
      final response = await _dio.post(_artworks, data: artworkData);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  static Future<Map<String, dynamic>> updateArtwork(String artworkId, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put('$_artworks/$artworkId', data: data);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  static Future<void> deleteArtwork(String artworkId) async {
    try {
      await _dio.delete('$_artworks/$artworkId');
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  // Commission Management
  static Future<List<Map<String, dynamic>>> getCommissions({Map<String, dynamic>? filters}) async {
    try {
      final response = await _dio.get(_commissions, queryParameters: filters);
      return List<Map<String, dynamic>>.from(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  static Future<Map<String, dynamic>> createCommission(Map<String, dynamic> commissionData) async {
    try {
      final response = await _dio.post(_commissions, data: commissionData);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  static Future<Map<String, dynamic>> updateCommissionStatus(String commissionId, String status) async {
    try {
      final response = await _dio.patch('$_commissions/$commissionId/status', data: {'status': status});
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  // Payment Management
  static Future<Map<String, dynamic>> createPayment(Map<String, dynamic> paymentData) async {
    try {
      final response = await _dio.post(_payments, data: paymentData);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  static Future<Map<String, dynamic>> getPaymentStatus(String paymentId) async {
    try {
      final response = await _dio.get('$_payments/$paymentId');
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  // Messaging
  static Future<List<Map<String, dynamic>>> getMessages(String conversationId) async {
    try {
      final response = await _dio.get('$_messages/$conversationId');
      return List<Map<String, dynamic>>.from(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  static Future<Map<String, dynamic>> sendMessage(Map<String, dynamic> messageData) async {
    try {
      final response = await _dio.post(_messages, data: messageData);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  // Reviews
  static Future<List<Map<String, dynamic>>> getReviews(String userId) async {
    try {
      final response = await _dio.get('$_reviews/$userId');
      return List<Map<String, dynamic>>.from(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  static Future<Map<String, dynamic>> createReview(Map<String, dynamic> reviewData) async {
    try {
      final response = await _dio.post(_reviews, data: reviewData);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  // Events
  static Future<List<Map<String, dynamic>>> getEvents({Map<String, dynamic>? filters}) async {
    try {
      final response = await _dio.get(_events, queryParameters: filters);
      return List<Map<String, dynamic>>.from(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  // File Upload
  static Future<String> uploadImage(File imageFile, String type) async {
    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(imageFile.path),
        'type': type,
      });
      
      final response = await _dio.post('/upload/image', data: formData);
      return response.data['url'];
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  // Real-time updates (WebSocket connection)
  static void connectWebSocket(String userId) {
    // Implementation for real-time updates
    // This would connect to your WebSocket server for live updates
  }
  
  // Helper methods
  static Future<void> _saveAuthToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }
  
  static Future<String?> _getAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }
  
  static Future<void> _clearAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }
  
  static Exception _handleError(dynamic error) {
    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          return Exception('Connection timeout. Please check your internet connection.');
        case DioExceptionType.badResponse:
          final statusCode = error.response?.statusCode;
          final message = error.response?.data['message'] ?? 'Server error occurred';
          return Exception('Error $statusCode: $message');
        case DioExceptionType.cancel:
          return Exception('Request was cancelled');
        default:
          return Exception('Network error occurred');
      }
    }
    return Exception('An unexpected error occurred');
  }
}

// Interceptors
class _AuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await ApiService._getAuthToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }
}

class _ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      // Handle unauthorized access
      ApiService._clearAuthToken();
    }
    handler.next(err);
  }
}

class _LoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    print('REQUEST[${options.method}] => PATH: ${options.path}');
    handler.next(options);
  }
  
  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    print('RESPONSE[${response.statusCode}] => PATH: ${response.requestOptions.path}');
    handler.next(response);
  }
  
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    print('ERROR[${err.response?.statusCode}] => PATH: ${err.requestOptions.path}');
    handler.next(err);
  }
}
