import 'package:flutter/foundation.dart';
import '../services/postgresql_service.dart';
import '../models/user_model.dart';
import '../models/commission_model.dart';

/// Provider for managing database operations
/// This provider integrates the PostgreSQL service with Flutter's state management
class DatabaseProvider extends ChangeNotifier {
  bool _isLoading = false;
  String? _error;
  List<User> _users = [];
  List<Commission> _commissions = [];

  // Getters
  bool get isLoading => _isLoading;
  String? get error => _error;
  List<User> get users => _users;
  List<Commission> get commissions => _commissions;

  /// Initialize the database service
  Future<void> initialize() async {
    try {
      await PostgreSQLService.init();
      _error = null;
    } catch (e) {
      _error = 'Failed to initialize database: ${e.toString()}';
      notifyListeners();
    }
  }

  /// Set loading state
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  /// Set error state
  void _setError(String? error) {
    _error = error;
    notifyListeners();
  }

  /// Clear error state
  void clearError() {
    _error = null;
    notifyListeners();
  }

  // User Operations
  Future<User?> createUser(Map<String, dynamic> userData) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await PostgreSQLService.createUser(userData);
      final user = User.fromJson(response);
      _users.add(user);
      notifyListeners();
      return user;
    } catch (e) {
      _setError('Failed to create user: ${e.toString()}');
      return null;
    } finally {
      _setLoading(false);
    }
  }

  Future<User?> getUserById(String userId) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await PostgreSQLService.getUserById(userId);
      final user = User.fromJson(response);
      return user;
    } catch (e) {
      _setError('Failed to get user: ${e.toString()}');
      return null;
    } finally {
      _setLoading(false);
    }
  }

  Future<User?> getUserByEmail(String email) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await PostgreSQLService.getUserByEmail(email);
      final user = User.fromJson(response);
      return user;
    } catch (e) {
      _setError('Failed to get user by email: ${e.toString()}');
      return null;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> loadUsers({
    String? userType,
    double? lat,
    double? lng,
    double? radius,
  }) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await PostgreSQLService.getUsers(
        userType: userType,
        lat: lat,
        lng: lng,
        radius: radius,
      );

      _users = response.map((json) => User.fromJson(json)).toList();
      notifyListeners();
    } catch (e) {
      _setError('Failed to load users: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> updateUser(String userId, Map<String, dynamic> data) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await PostgreSQLService.updateUser(userId, data);
      final updatedUser = User.fromJson(response);

      // Update user in local list
      final index = _users.indexWhere((user) => user.id == userId);
      if (index != -1) {
        _users[index] = updatedUser;
        notifyListeners();
      }

      return true;
    } catch (e) {
      _setError('Failed to update user: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Commission Operations
  Future<Commission?> createCommission(
      Map<String, dynamic> commissionData) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await PostgreSQLService.createCommission(commissionData);
      final commission = Commission.fromJson(response);
      _commissions.add(commission);
      notifyListeners();
      return commission;
    } catch (e) {
      _setError('Failed to create commission: ${e.toString()}');
      return null;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> loadCommissions({
    String? clientId,
    String? artistId,
    String? status,
  }) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await PostgreSQLService.getCommissions(
        clientId: clientId,
        artistId: artistId,
        status: status,
      );

      _commissions = response.map((json) => Commission.fromJson(json)).toList();
      notifyListeners();
    } catch (e) {
      _setError('Failed to load commissions: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  Future<Commission?> getCommissionById(String commissionId) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await PostgreSQLService.getCommissionById(commissionId);
      final commission = Commission.fromJson(response);
      return commission;
    } catch (e) {
      _setError('Failed to get commission: ${e.toString()}');
      return null;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> updateCommissionStatus(
      String commissionId, String status) async {
    _setLoading(true);
    _setError(null);

    try {
      final response =
          await PostgreSQLService.updateCommissionStatus(commissionId, status);
      final updatedCommission = Commission.fromJson(response);

      // Update commission in local list
      final index = _commissions
          .indexWhere((commission) => commission.id == commissionId);
      if (index != -1) {
        _commissions[index] = updatedCommission;
        notifyListeners();
      }

      return true;
    } catch (e) {
      _setError('Failed to update commission status: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Health Check
  Future<bool> checkDatabaseHealth() async {
    try {
      final response = await PostgreSQLService.healthCheck();
      return response['status'] == 'healthy';
    } catch (e) {
      _setError('Database health check failed: ${e.toString()}');
      return false;
    }
  }

  // Clear all data
  void clearData() {
    _users.clear();
    _commissions.clear();
    _error = null;
    notifyListeners();
  }
}
