import 'package:flutter/material.dart';
import '../../shared/types/commission.dart';
import '../services/api_service.dart';

class CommissionProvider extends ChangeNotifier {
  bool _isLoading = false;
  String? _error;
  List<Commission> _commissions = [];
  List<Commission> _pendingRequests = [];

  // Getters
  bool get isLoading => _isLoading;
  String? get error => _error;
  List<Commission> get commissions => _commissions;
  List<Commission> get pendingRequests => _pendingRequests;

  // Set loading state
  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  // Set error
  void setError(String? error) {
    _error = error;
    notifyListeners();
  }

  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Accept commission with escrow payment
  Future<bool> acceptCommission({
    required String commissionId,
    required String paymentMethod,
    String? message,
  }) async {
    setLoading(true);
    clearError();

    try {
      final response = await ApiService.acceptCommission(
        commissionId: commissionId,
        paymentMethod: paymentMethod,
        message: message,
      );

      if (response['success'] == true) {
        // Update local commission status
        final index = _commissions.indexWhere((c) => c.id == commissionId);
        if (index != -1) {
          _commissions[index] = Commission.fromJson(response['data']);
        }

        // Remove from pending requests
        _pendingRequests.removeWhere((c) => c.id == commissionId);

        notifyListeners();
        return true;
      } else {
        setError(response['message'] ?? 'Failed to accept commission');
        return false;
      }
    } catch (e) {
      setError('Failed to accept commission: ${e.toString()}');
      return false;
    } finally {
      setLoading(false);
    }
  }

  // Decline commission
  Future<bool> declineCommission(String commissionId, String reason) async {
    setLoading(true);
    clearError();

    try {
      final response = await ApiService.declineCommission(
        commissionId: commissionId,
        reason: reason,
      );

      if (response['success'] == true) {
        // Remove from pending requests
        _pendingRequests.removeWhere((c) => c.id == commissionId);
        notifyListeners();
        return true;
      } else {
        setError(response['message'] ?? 'Failed to decline commission');
        return false;
      }
    } catch (e) {
      setError('Failed to decline commission: ${e.toString()}');
      return false;
    } finally {
      setLoading(false);
    }
  }

  // Load pending commission requests
  Future<void> loadPendingRequests() async {
    setLoading(true);
    clearError();

    try {
      final response = await ApiService.getPendingCommissions();
      _pendingRequests =
          response.map((data) => Commission.fromJson(data)).toList();
      notifyListeners();
    } catch (e) {
      setError('Failed to load pending requests: ${e.toString()}');
    } finally {
      setLoading(false);
    }
  }

  // Load user's commissions
  Future<void> loadUserCommissions({String? status}) async {
    setLoading(true);
    clearError();

    try {
      final response = await ApiService.getUserCommissions(status: status);
      _commissions = response.map((data) => Commission.fromJson(data)).toList();
      notifyListeners();
    } catch (e) {
      setError('Failed to load commissions: ${e.toString()}');
    } finally {
      setLoading(false);
    }
  }

  // Submit work for approval
  Future<bool> submitWork({
    required String commissionId,
    required String workUrl,
    String? description,
  }) async {
    setLoading(true);
    clearError();

    try {
      final response = await ApiService.submitWork(
        commissionId: commissionId,
        workUrl: workUrl,
        description: description,
      );

      if (response['success'] == true) {
        // Update commission status
        final index = _commissions.indexWhere((c) => c.id == commissionId);
        if (index != -1) {
          _commissions[index] = Commission.fromJson(response['data']);
        }
        notifyListeners();
        return true;
      } else {
        setError(response['message'] ?? 'Failed to submit work');
        return false;
      }
    } catch (e) {
      setError('Failed to submit work: ${e.toString()}');
      return false;
    } finally {
      setLoading(false);
    }
  }

  // Client approves work (releases escrow payment)
  Future<bool> approveWork(String commissionId) async {
    setLoading(true);
    clearError();

    try {
      final response = await ApiService.approveWork(commissionId);

      if (response['success'] == true) {
        // Update commission status
        final index = _commissions.indexWhere((c) => c.id == commissionId);
        if (index != -1) {
          _commissions[index] = Commission.fromJson(response['data']);
        }
        notifyListeners();
        return true;
      } else {
        setError(response['message'] ?? 'Failed to approve work');
        return false;
      }
    } catch (e) {
      setError('Failed to approve work: ${e.toString()}');
      return false;
    } finally {
      setLoading(false);
    }
  }

  // Client requests revision
  Future<bool> requestRevision({
    required String commissionId,
    required String feedback,
  }) async {
    setLoading(true);
    clearError();

    try {
      final response = await ApiService.requestRevision(
        commissionId: commissionId,
        feedback: feedback,
      );

      if (response['success'] == true) {
        // Update commission status
        final index = _commissions.indexWhere((c) => c.id == commissionId);
        if (index != -1) {
          _commissions[index] = Commission.fromJson(response['data']);
        }
        notifyListeners();
        return true;
      } else {
        setError(response['message'] ?? 'Failed to request revision');
        return false;
      }
    } catch (e) {
      setError('Failed to request revision: ${e.toString()}');
      return false;
    } finally {
      setLoading(false);
    }
  }

  // Get escrow payment status
  Future<Map<String, dynamic>?> getEscrowStatus(String commissionId) async {
    try {
      final response = await ApiService.getEscrowStatus(commissionId);
      return response['data'];
    } catch (e) {
      setError('Failed to get escrow status: ${e.toString()}');
      return null;
    }
  }
}
