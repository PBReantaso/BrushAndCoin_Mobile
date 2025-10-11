import 'package:flutter/material.dart';
import '../models/post_model.dart';
import '../services/api_service.dart';

class ArtworkProvider extends ChangeNotifier {
  List<Post> _artworks = [];
  bool _isLoading = false;
  String? _error;
  String _searchQuery = '';
  String? _selectedCategory;

  // Getters
  List<Post> get artworks => _artworks;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get searchQuery => _searchQuery;
  String? get selectedCategory => _selectedCategory;

  // Load artworks from API
  Future<void> loadArtworks({Map<String, dynamic>? filters}) async {
    _setLoading(true);
    _clearError();

    try {
      final artworksData = await ApiService.getArtworks(filters: filters);
      _artworks = artworksData.map((data) => Post.fromJson(data)).toList();
    } catch (e) {
      _setError('Failed to load artworks: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  // Search artworks
  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  // Filter by category
  void setCategory(String? category) {
    _selectedCategory = category;
    notifyListeners();
  }

  // Get filtered artworks
  List<Post> get filteredArtworks {
    List<Post> filtered = _artworks;

    if (_searchQuery.isNotEmpty) {
      final query = _searchQuery.toLowerCase();
      filtered = filtered.where((artwork) {
        return artwork.artworkTitle.toLowerCase().contains(query) ||
            (artwork.artworkDescription?.toLowerCase().contains(query) ??
                false) ||
            artwork.userName.toLowerCase().contains(query) ||
            artwork.tags.any((tag) => tag.toLowerCase().contains(query));
      }).toList();
    }

    if (_selectedCategory != null) {
      filtered = filtered
          .where((artwork) => artwork.category == _selectedCategory)
          .toList();
    }

    return filtered;
  }

  // Get available categories
  List<String> get categories {
    final categorySet = <String>{};
    for (final artwork in _artworks) {
      if (artwork.category != null) {
        categorySet.add(artwork.category!);
      }
    }
    return categorySet.toList()..sort();
  }

  // Helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
    notifyListeners();
  }
}
