import 'package:flutter/material.dart';
import '../models/commission_model.dart';
import 'dart:math';

class CommissionProvider extends ChangeNotifier {
  bool _isLoading = false;
  String? _error;
  final List<Commission> _commissions = [];
  double _artistEarnings = 0.0; // mock earnings accumulator
  final Map<String, Map<String, dynamic>> _artistCommissionSettings = {};

  // Getters
  bool get isLoading => _isLoading;
  String? get error => _error;
  List<Commission> get commissions => List.unmodifiable(_commissions);
  double get artistEarnings => _artistEarnings;
  Map<String, dynamic>? getCommissionSettings(String artistId) =>
      _artistCommissionSettings[artistId];

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

  // UI-only: submit commission request
  Future<Commission> submitCommission({
    required String artistId,
    required String clientId,
    required String title,
    required String description,
    required double amount,
    required DateTime deadline,
    CommissionType type = CommissionType.custom,
    Map<String, dynamic>? requirements,
  }) async {
    setLoading(true);
    await Future.delayed(const Duration(milliseconds: 400));
    final id =
        'c_${DateTime.now().millisecondsSinceEpoch}_${Random().nextInt(9999)}';
    final commission = Commission(
      id: id,
      title: title,
      description: description,
      artistId: artistId,
      clientId: clientId,
      amount: amount,
      status: CommissionStatus.pending,
      deadline: deadline,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      requirements: requirements,
      type: type,
      currency: 'PHP',
    );
    _commissions.add(commission);
    setLoading(false);
    return commission;
  }

  // UI-only: artist accepts/declines
  Future<void> respondToCommission(String commissionId, bool accept) async {
    final idx = _commissions.indexWhere((c) => c.id == commissionId);
    if (idx == -1) return;
    setLoading(true);
    await Future.delayed(const Duration(milliseconds: 300));
    final status =
        accept ? CommissionStatus.accepted : CommissionStatus.cancelled;
    _commissions[idx] = _commissions[idx].copyWith(
      status: status,
      updatedAt: DateTime.now(),
    );
    setLoading(false);
  }

  // UI-only: simulate tipping - instantly adds to artist earnings
  Future<void> tipArtist(
      {required String artistId, required double amount}) async {
    setLoading(true);
    await Future.delayed(const Duration(milliseconds: 250));
    _artistEarnings += amount;
    setLoading(false);
  }

  // UI-only: simulate escrow deposit after acceptance
  Future<void> depositToEscrow(String commissionId) async {
    setLoading(true);
    await Future.delayed(const Duration(milliseconds: 400));
    // For demo, mark as inProgress and count 10% to artist earnings immediately
    final idx = _commissions.indexWhere((c) => c.id == commissionId);
    if (idx != -1) {
      _commissions[idx] = _commissions[idx].copyWith(
        status: CommissionStatus.inProgress,
        updatedAt: DateTime.now(),
      );
      _artistEarnings += _commissions[idx].amount * 0.1;
    }
    setLoading(false);
  }

  // UI-only: update an artist's commission settings (visible on profile)
  Future<void> updateCommissionSettings(
      {required String artistId,
      required Map<String, dynamic> settings}) async {
    setLoading(true);
    await Future.delayed(const Duration(milliseconds: 300));
    _artistCommissionSettings[artistId] = settings;
    setLoading(false);
  }
}
