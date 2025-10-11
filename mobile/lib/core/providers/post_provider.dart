import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import '../models/post_model.dart';
import '../services/api_service.dart';

class PostProvider extends ChangeNotifier {
  List<Post> _posts = [];
  bool _isLoading = false;
  String? _error;
  final ImagePicker _imagePicker = ImagePicker();

  // Store comments per post
  final Map<String, List<Map<String, dynamic>>> _postComments = {};

  // Getters
  List<Post> get posts => _posts;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Initialize posts (load from API or local storage)
  Future<void> loadPosts() async {
    _setLoading(true);
    _clearError();

    try {
      // Only load mock posts if the list is empty (first time)
      if (_posts.isEmpty) {
        await _loadMockPosts();
      }

      // TODO: Replace with actual API call
      // final postsData = await ApiService.getArtworks();
      // _posts = postsData.map((data) => Post.fromJson(data)).toList();
    } catch (e) {
      _setError('Failed to load posts: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  // Create a new post
  Future<bool> createPost({
    required String artworkTitle,
    String? artworkDescription,
    File? imageFile,
    List<String>? tags,
    String? location,
    double? price,
    bool isForSale = false,
    String? category,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      String? imageUrl;

      // Upload image if provided
      if (imageFile != null) {
        imageUrl = await ApiService.uploadImage(imageFile, 'artwork');
      } else {
        // Use a special placeholder for posts without images
        imageUrl = 'no_image_placeholder';
      }

      // For now, create a mock post locally (in production, this would be an API call)
      final newPost = Post(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        userId: 'current_user', // Mock current user ID
        userName: 'You', // Mock current user name
        userAvatar: null,
        artworkTitle: artworkTitle,
        artworkDescription: artworkDescription,
        artworkImageUrl: imageUrl,
        tags: tags ?? [],
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        location: location,
        price: price,
        isForSale: isForSale,
        category: category,
      );

      // Add to local list
      _posts.insert(0, newPost);

      notifyListeners();
      return true;
    } catch (e) {
      _setError('Failed to create post: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Toggle like on a post
  Future<void> toggleLike(String postId) async {
    try {
      final postIndex = _posts.indexWhere((post) => post.id == postId);
      if (postIndex == -1) return;

      final post = _posts[postIndex];
      final newIsLiked = !post.isLiked;
      final newLikesCount =
          newIsLiked ? post.likesCount + 1 : post.likesCount - 1;

      // Update local state immediately for better UX
      _posts[postIndex] = post.copyWith(
        isLiked: newIsLiked,
        likesCount: newLikesCount,
      );
      notifyListeners();

      // TODO: Make API call to like/unlike
      // await ApiService.likePost(postId, newIsLiked);
    } catch (e) {
      _setError('Failed to update like: ${e.toString()}');
      // Revert the change on error
      await loadPosts();
    }
  }

  // Get comments for a specific post
  List<Map<String, dynamic>> getCommentsForPost(String postId) {
    // Ensure comments are initialized for this post
    if (_postComments[postId] == null) {
      _initializeCommentsForPost(postId);
    }
    return _postComments[postId] ?? [];
  }

  // Add comment to a post
  void addComment(String postId, Map<String, dynamic> comment) {
    // Add comment to the post's comment list
    if (_postComments[postId] == null) {
      _postComments[postId] = [];
    }
    _postComments[postId]!.insert(0, comment);

    // Update the post's comment count
    final postIndex = _posts.indexWhere((post) => post.id == postId);
    if (postIndex != -1) {
      final post = _posts[postIndex];
      _posts[postIndex] = post.copyWith(
        commentsCount: _postComments[postId]!.length,
      );
      notifyListeners();
    }
  }

  // Delete a post (only if it belongs to the current user)
  Future<bool> deletePost(String postId) async {
    try {
      final postIndex = _posts.indexWhere((post) => post.id == postId);
      if (postIndex == -1) return false;

      final post = _posts[postIndex];

      // Check if the post belongs to the current user
      if (post.userId != 'current_user') {
        return false; // Can't delete other users' posts
      }

      // Remove the post from the list
      _posts.removeAt(postIndex);

      // Remove associated comments
      _postComments.remove(postId);

      notifyListeners();
      return true;
    } catch (e) {
      _setError('Failed to delete post: ${e.toString()}');
      return false;
    }
  }

  // Check if a post belongs to the current user
  bool isCurrentUserPost(String postId) {
    final post = _posts.firstWhere(
      (post) => post.id == postId,
      orElse: () => throw Exception('Post not found'),
    );
    return post.userId == 'current_user';
  }

  // Refresh comment counts for all posts
  void refreshCommentCounts() {
    for (int i = 0; i < _posts.length; i++) {
      final post = _posts[i];
      final comments = getCommentsForPost(post.id);
      _posts[i] = post.copyWith(
        commentsCount: comments.length,
      );
    }
    notifyListeners();
  }

  // Initialize comments for a post (mock data)
  void _initializeCommentsForPost(String postId) {
    if (_postComments[postId] == null) {
      // Generate different number of comments for each post based on post ID
      final commentCounts = {
        '1': 3,
        '2': 7,
        '3': 12,
        '4': 5,
        '5': 9,
      };
      final commentCount = commentCounts[postId] ?? 5;

      _postComments[postId] = List.generate(commentCount, (index) {
        final users = [
          {
            'name': 'Michael Angelo',
            'avatar': 'https://i.pravatar.cc/150?img=6'
          },
          {'name': 'Sarah Wilson', 'avatar': 'https://i.pravatar.cc/150?img=7'},
          {'name': 'David Chen', 'avatar': 'https://i.pravatar.cc/150?img=8'},
          {
            'name': 'Emma Rodriguez',
            'avatar': 'https://i.pravatar.cc/150?img=9'
          },
          {
            'name': 'James Thompson',
            'avatar': 'https://i.pravatar.cc/150?img=10'
          },
          {'name': 'Lisa Park', 'avatar': 'https://i.pravatar.cc/150?img=11'},
          {
            'name': 'Alex Johnson',
            'avatar': 'https://i.pravatar.cc/150?img=12'
          },
          {
            'name': 'Maria Garcia',
            'avatar': 'https://i.pravatar.cc/150?img=13'
          },
          {
            'name': 'Tom Anderson',
            'avatar': 'https://i.pravatar.cc/150?img=14'
          },
          {'name': 'Rachel Kim', 'avatar': 'https://i.pravatar.cc/150?img=15'},
        ];

        final user = users[index % users.length];
        final comments = [
          'Love the strokes!',
          'Amazing work! The colors are so vibrant.',
          'This is incredible! How long did it take?',
          'The detail in this piece is outstanding.',
          'Beautiful composition and lighting!',
          'I love the texture and depth in this artwork.',
          'This reminds me of the Renaissance masters.',
          'The emotion in this piece is palpable.',
          'Absolutely stunning! Do you sell prints?',
          'The technique here is masterful.',
          'Incredible attention to detail!',
          'This piece really speaks to me.',
          'Wonderful use of color and form.',
          'The lighting in this is perfect.',
          'Such a beautiful interpretation!',
        ];

        return {
          'id': '${postId}_comment_$index',
          'userName': user['name'],
          'userAvatar': user['avatar'],
          'comment': comments[index % comments.length],
          'timestamp': '${index + 1} hours ago',
        };
      });
    }
  }

  // Search posts
  List<Post> searchPosts(String query) {
    if (query.isEmpty) return _posts;

    final lowercaseQuery = query.toLowerCase();
    return _posts.where((post) {
      return post.artworkTitle.toLowerCase().contains(lowercaseQuery) ||
          post.artworkDescription?.toLowerCase().contains(lowercaseQuery) ==
              true ||
          post.userName.toLowerCase().contains(lowercaseQuery) ||
          post.tags.any((tag) => tag.toLowerCase().contains(lowercaseQuery));
    }).toList();
  }

  // Pick image from gallery
  Future<File?> pickImageFromGallery() async {
    try {
      final XFile? image = await _imagePicker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 85,
      );

      if (image != null) {
        return File(image.path);
      }
      return null;
    } catch (e) {
      _setError('Failed to pick image: ${e.toString()}');
      return null;
    }
  }

  // Pick image from camera
  Future<File?> pickImageFromCamera() async {
    try {
      final XFile? image = await _imagePicker.pickImage(
        source: ImageSource.camera,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 85,
      );

      if (image != null) {
        return File(image.path);
      }
      return null;
    } catch (e) {
      _setError('Failed to take photo: ${e.toString()}');
      return null;
    }
  }

  // Load mock posts for development
  Future<void> _loadMockPosts() async {
    await Future.delayed(const Duration(seconds: 1)); // Simulate network delay

    _posts = [
      Post(
        id: '1',
        userId: 'user1',
        userName: 'Alice Johnson',
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        artworkTitle: 'Digital Sunset',
        artworkDescription:
            'A beautiful digital painting of a sunset over the mountains.',
        artworkImageUrl: 'https://picsum.photos/400/300?random=1',
        tags: ['digital', 'sunset', 'landscape'],
        likesCount: 1523,
        commentsCount: 3,
        isLiked: false,
        createdAt: DateTime.now().subtract(const Duration(hours: 2)),
        updatedAt: DateTime.now().subtract(const Duration(hours: 2)),
        location: 'New York, NY',
        price: 150.0,
        isForSale: true,
        category: 'Digital Art',
      ),
      Post(
        id: '2',
        userId: 'user2',
        userName: 'Bob Smith',
        userAvatar: 'https://i.pravatar.cc/150?img=2',
        artworkTitle: 'Abstract Dreams',
        artworkDescription:
            'An abstract piece exploring the depths of imagination.',
        artworkImageUrl: 'https://picsum.photos/400/300?random=2',
        tags: ['abstract', 'colorful', 'modern'],
        likesCount: 892,
        commentsCount: 7,
        isLiked: true,
        createdAt: DateTime.now().subtract(const Duration(hours: 5)),
        updatedAt: DateTime.now().subtract(const Duration(hours: 5)),
        location: 'Los Angeles, CA',
        price: 200.0,
        isForSale: true,
        category: 'Abstract Art',
      ),
      Post(
        id: '3',
        userId: 'user3',
        userName: 'Carol Davis',
        userAvatar: 'https://i.pravatar.cc/150?img=3',
        artworkTitle: 'Portrait Study',
        artworkDescription: 'A detailed portrait study in oil paints.',
        artworkImageUrl: 'https://picsum.photos/400/300?random=3',
        tags: ['portrait', 'oil', 'traditional'],
        likesCount: 2341,
        commentsCount: 12,
        isLiked: false,
        createdAt: DateTime.now().subtract(const Duration(days: 1)),
        updatedAt: DateTime.now().subtract(const Duration(days: 1)),
        location: 'Chicago, IL',
        price: 300.0,
        isForSale: true,
        category: 'Portrait',
      ),
      Post(
        id: '4',
        userId: 'user4',
        userName: 'David Wilson',
        userAvatar: 'https://i.pravatar.cc/150?img=4',
        artworkTitle: 'Urban Sketch',
        artworkDescription: 'Quick sketch of downtown city life.',
        artworkImageUrl: 'https://picsum.photos/400/300?random=4',
        tags: ['sketch', 'urban', 'pen'],
        likesCount: 567,
        commentsCount: 5,
        isLiked: false,
        createdAt: DateTime.now().subtract(const Duration(days: 2)),
        updatedAt: DateTime.now().subtract(const Duration(days: 2)),
        location: 'Seattle, WA',
        price: 75.0,
        isForSale: true,
        category: 'Sketch',
      ),
      Post(
        id: '5',
        userId: 'user5',
        userName: 'Emma Brown',
        userAvatar: 'https://i.pravatar.cc/150?img=5',
        artworkTitle: 'Nature\'s Palette',
        artworkDescription: 'Watercolor painting inspired by autumn colors.',
        artworkImageUrl: 'https://picsum.photos/400/300?random=5',
        tags: ['watercolor', 'nature', 'autumn'],
        likesCount: 1234,
        commentsCount: 9,
        isLiked: true,
        createdAt: DateTime.now().subtract(const Duration(days: 3)),
        updatedAt: DateTime.now().subtract(const Duration(days: 3)),
        location: 'Portland, OR',
        price: 120.0,
        isForSale: true,
        category: 'Watercolor',
      ),
    ];

    // Initialize comments for each post and update comment counts
    for (int i = 0; i < _posts.length; i++) {
      final post = _posts[i];
      _initializeCommentsForPost(post.id);
      // Update the post's comment count to match the actual comments
      final commentCount = _postComments[post.id]!.length;
      _posts[i] = post.copyWith(
        commentsCount: commentCount,
      );
    }
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

  // Format likes count for display
  String formatLikes(int likes) {
    if (likes >= 1000000) {
      return '${(likes / 1000000).toStringAsFixed(1)}M';
    } else if (likes >= 1000) {
      return '${(likes / 1000).toStringAsFixed(1)}K';
    }
    return likes.toString();
  }

  // Format time ago for display
  String formatTimeAgo(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 7) {
      return '${difference.inDays ~/ 7}w ago';
    } else if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }

  // Get user profile data with realistic follower counts
  Map<String, dynamic> getUserProfileData(
      String userId, String userName, String? userAvatar) {
    // Mock user data with different follower counts
    final userData = {
      'user1': {
        'followers': 1247,
        'following': 89,
        'bio':
            'Digital artist specializing in landscapes and nature scenes. Based in NYC.',
        'socials': {
          'facebook': 'https://facebook.com/alicejohnson',
          'twitter': 'https://twitter.com/alicejohnson',
          'pinterest': 'https://pinterest.com/alicejohnson',
        },
        'isFollowing': false,
      },
      'user2': {
        'followers': 892,
        'following': 156,
        'bio': 'Abstract artist exploring the boundaries of color and form.',
        'socials': {
          'facebook': 'https://facebook.com/bobsmith',
          'twitter': 'https://twitter.com/bobsmith',
          'pinterest': 'https://pinterest.com/bobsmith',
        },
        'isFollowing': false,
      },
      'user3': {
        'followers': 2341,
        'following': 67,
        'bio': 'Portrait artist with a passion for capturing human emotion.',
        'socials': {
          'facebook': 'https://facebook.com/caroldavis',
          'twitter': 'https://twitter.com/caroldavis',
          'pinterest': 'https://pinterest.com/caroldavis',
        },
        'isFollowing': false,
      },
      'user4': {
        'followers': 567,
        'following': 234,
        'bio': 'Urban sketcher documenting city life one drawing at a time.',
        'socials': {
          'facebook': 'https://facebook.com/davidwilson',
          'twitter': 'https://twitter.com/davidwilson',
          'pinterest': 'https://pinterest.com/davidwilson',
        },
        'isFollowing': false,
      },
      'user5': {
        'followers': 1234,
        'following': 45,
        'bio': 'Watercolor artist inspired by nature and seasonal changes.',
        'socials': {
          'facebook': 'https://facebook.com/emmabrown',
          'twitter': 'https://twitter.com/emmabrown',
          'pinterest': 'https://pinterest.com/emmabrown',
        },
        'isFollowing': false,
      },
    };

    final userProfile = userData[userId] ??
        {
          'followers': 0,
          'following': 0,
          'bio': 'Artist and creative professional',
          'socials': {
            'facebook': '',
            'twitter': '',
            'pinterest': '',
          },
          'isFollowing': false,
        };

    return {
      'userId': userId,
      'userName': userName,
      'userAvatar': userAvatar,
      'followers': userProfile['followers'],
      'following': userProfile['following'],
      'bio': userProfile['bio'],
      'socials': userProfile['socials'],
      'isFollowing': userProfile['isFollowing'],
    };
  }
}
