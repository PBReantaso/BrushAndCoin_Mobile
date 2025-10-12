import 'package:dio/dio.dart';

import '../config/env.dart';

/// PostgreSQL service for handling database operations
/// This service communicates with a backend API that uses PostgreSQL
class PostgreSQLService {
  static late Dio _dio;
  static final String _baseUrl = Environment.currentApiBaseUrl;
  static const String _dbEndpoint = '/db';

  static Future<void> init() async {
    _dio = Dio(BaseOptions(
  baseUrl: _baseUrl + _dbEndpoint,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Add interceptors
    _dio.interceptors.addAll([
      _AuthInterceptor(),
      _ErrorInterceptor(),
      _LoggingInterceptor(),
    ]);
  }

  // User Operations
  static Future<Map<String, dynamic>> createUser(
      Map<String, dynamic> userData) async {
    try {
      final response = await _dio.post('/users', data: userData);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> getUserById(String userId) async {
    try {
      final response = await _dio.get('/users/$userId');
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> getUserByEmail(String email) async {
    try {
      final response = await _dio.get('/users/email/$email');
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<List<Map<String, dynamic>>> getUsers({
    String? userType,
    double? lat,
    double? lng,
    double? radius,
    int? limit,
    int? offset,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (userType != null) queryParams['user_type'] = userType;
      if (lat != null) queryParams['lat'] = lat;
      if (lng != null) queryParams['lng'] = lng;
      if (radius != null) queryParams['radius'] = radius;
      if (limit != null) queryParams['limit'] = limit;
      if (offset != null) queryParams['offset'] = offset;

      final response = await _dio.get('/users', queryParameters: queryParams);
      return List<Map<String, dynamic>>.from(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> updateUser(
      String userId, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put('/users/$userId', data: data);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> deleteUser(String userId) async {
    try {
      await _dio.delete('/users/$userId');
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Artwork Operations
  static Future<Map<String, dynamic>> createArtwork(
      Map<String, dynamic> artworkData) async {
    try {
      final response = await _dio.post('/artworks', data: artworkData);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<List<Map<String, dynamic>>> getArtworks({
    String? userId,
    String? category,
    List<String>? tags,
    double? minPrice,
    double? maxPrice,
    bool? isCommission,
    bool? isAvailable,
    int? limit,
    int? offset,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (userId != null) queryParams['user_id'] = userId;
      if (category != null) queryParams['category'] = category;
      if (tags != null) queryParams['tags'] = tags.join(',');
      if (minPrice != null) queryParams['min_price'] = minPrice;
      if (maxPrice != null) queryParams['max_price'] = maxPrice;
      if (isCommission != null) queryParams['is_commission'] = isCommission;
      if (isAvailable != null) queryParams['is_available'] = isAvailable;
      if (limit != null) queryParams['limit'] = limit;
      if (offset != null) queryParams['offset'] = offset;

      final response =
          await _dio.get('/artworks', queryParameters: queryParams);
      return List<Map<String, dynamic>>.from(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> getArtworkById(String artworkId) async {
    try {
      final response = await _dio.get('/artworks/$artworkId');
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> updateArtwork(
      String artworkId, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put('/artworks/$artworkId', data: data);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> deleteArtwork(String artworkId) async {
    try {
      await _dio.delete('/artworks/$artworkId');
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Commission Operations
  static Future<Map<String, dynamic>> createCommission(
      Map<String, dynamic> commissionData) async {
    try {
      final response = await _dio.post('/commissions', data: commissionData);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<List<Map<String, dynamic>>> getCommissions({
    String? clientId,
    String? artistId,
    String? status,
    int? limit,
    int? offset,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (clientId != null) queryParams['client_id'] = clientId;
      if (artistId != null) queryParams['artist_id'] = artistId;
      if (status != null) queryParams['status'] = status;
      if (limit != null) queryParams['limit'] = limit;
      if (offset != null) queryParams['offset'] = offset;

      final response =
          await _dio.get('/commissions', queryParameters: queryParams);
      return List<Map<String, dynamic>>.from(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> getCommissionById(
      String commissionId) async {
    try {
      final response = await _dio.get('/commissions/$commissionId');
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> updateCommissionStatus(
      String commissionId, String status) async {
    try {
      final response = await _dio
          .patch('/commissions/$commissionId/status', data: {'status': status});
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> updateCommission(
      String commissionId, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put('/commissions/$commissionId', data: data);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Payment Operations
  static Future<Map<String, dynamic>> createPayment(
      Map<String, dynamic> paymentData) async {
    try {
      final response = await _dio.post('/payments', data: paymentData);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<List<Map<String, dynamic>>> getPayments({
    String? commissionId,
    String? status,
    int? limit,
    int? offset,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (commissionId != null) queryParams['commission_id'] = commissionId;
      if (status != null) queryParams['status'] = status;
      if (limit != null) queryParams['limit'] = limit;
      if (offset != null) queryParams['offset'] = offset;

      final response =
          await _dio.get('/payments', queryParameters: queryParams);
      return List<Map<String, dynamic>>.from(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> getPaymentById(String paymentId) async {
    try {
      final response = await _dio.get('/payments/$paymentId');
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> updatePaymentStatus(
      String paymentId, String status) async {
    try {
      final response = await _dio
          .patch('/payments/$paymentId/status', data: {'status': status});
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Message Operations
  static Future<List<Map<String, dynamic>>> getMessages({
    String? conversationId,
    String? senderId,
    String? receiverId,
    int? limit,
    int? offset,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (conversationId != null)
        queryParams['conversation_id'] = conversationId;
      if (senderId != null) queryParams['sender_id'] = senderId;
      if (receiverId != null) queryParams['receiver_id'] = receiverId;
      if (limit != null) queryParams['limit'] = limit;
      if (offset != null) queryParams['offset'] = offset;

      final response =
          await _dio.get('/messages', queryParameters: queryParams);
      return List<Map<String, dynamic>>.from(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> sendMessage(
      Map<String, dynamic> messageData) async {
    try {
      final response = await _dio.post('/messages', data: messageData);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> markMessageAsRead(String messageId) async {
    try {
      await _dio.patch('/messages/$messageId/read');
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Review Operations
  static Future<List<Map<String, dynamic>>> getReviews({
    String? revieweeId,
    String? reviewerId,
    int? limit,
    int? offset,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (revieweeId != null) queryParams['reviewee_id'] = revieweeId;
      if (reviewerId != null) queryParams['reviewer_id'] = reviewerId;
      if (limit != null) queryParams['limit'] = limit;
      if (offset != null) queryParams['offset'] = offset;

      final response = await _dio.get('/reviews', queryParameters: queryParams);
      return List<Map<String, dynamic>>.from(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> createReview(
      Map<String, dynamic> reviewData) async {
    try {
      final response = await _dio.post('/reviews', data: reviewData);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Event Operations
  static Future<Map<String, dynamic>> createEvent(
      Map<String, dynamic> eventData) async {
    try {
      final response = await _dio.post('/events', data: eventData);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<List<Map<String, dynamic>>> getEvents({
    String? organizerId,
    DateTime? startDate,
    DateTime? endDate,
    double? lat,
    double? lng,
    double? radius,
    int? limit,
    int? offset,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (organizerId != null) queryParams['organizer_id'] = organizerId;
      if (startDate != null)
        queryParams['start_date'] = startDate.toIso8601String();
      if (endDate != null) queryParams['end_date'] = endDate.toIso8601String();
      if (lat != null) queryParams['lat'] = lat;
      if (lng != null) queryParams['lng'] = lng;
      if (radius != null) queryParams['radius'] = radius;
      if (limit != null) queryParams['limit'] = limit;
      if (offset != null) queryParams['offset'] = offset;

      final response = await _dio.get('/events', queryParameters: queryParams);
      return List<Map<String, dynamic>>.from(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> getEventById(String eventId) async {
    try {
      final response = await _dio.get('/events/$eventId');
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Map<String, dynamic>> updateEvent(
      String eventId, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put('/events/$eventId', data: data);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> deleteEvent(String eventId) async {
    try {
      await _dio.delete('/events/$eventId');
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Event Attendee Operations
  static Future<Map<String, dynamic>> registerForEvent(
      String eventId, String userId) async {
    try {
      final response = await _dio
          .post('/events/$eventId/attendees', data: {'user_id': userId});
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<List<Map<String, dynamic>>> getEventAttendees(
      String eventId) async {
    try {
      final response = await _dio.get('/events/$eventId/attendees');
      return List<Map<String, dynamic>>.from(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> unregisterFromEvent(String eventId, String userId) async {
    try {
      await _dio.delete('/events/$eventId/attendees/$userId');
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Database Health Check
  static Future<Map<String, dynamic>> healthCheck() async {
    try {
      final response = await _dio.get('/health');
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Helper methods
  static Exception _handleError(dynamic error) {
    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          return Exception(
              'Database connection timeout. Please check your internet connection.');
        case DioExceptionType.badResponse:
          final statusCode = error.response?.statusCode;
          final message =
              error.response?.data['message'] ?? 'Database error occurred';
          return Exception('Database Error $statusCode: $message');
        case DioExceptionType.cancel:
          return Exception('Database request was cancelled');
        default:
          return Exception('Database connection error occurred');
      }
    }
    return Exception('An unexpected database error occurred');
  }
}

// Interceptors (reusing from ApiService)
class _AuthInterceptor extends Interceptor {
  @override
  void onRequest(
      RequestOptions options, RequestInterceptorHandler handler) async {
    // Add authentication token if available
    // This would integrate with your existing auth system
    handler.next(options);
  }
}

class _ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      // Handle unauthorized access
      // Clear auth token and redirect to login
    }
    handler.next(err);
  }
}

class _LoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    print('DB REQUEST[${options.method}] => PATH: ${options.path}');
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    print(
        'DB RESPONSE[${response.statusCode}] => PATH: ${response.requestOptions.path}');
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    print(
        'DB ERROR[${err.response?.statusCode}] => PATH: ${err.requestOptions.path}');
    handler.next(err);
  }
}
