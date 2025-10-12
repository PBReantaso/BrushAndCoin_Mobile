// Shared post types - matches shared/types/post.ts

class Post {
  final String id;
  final String userId;
  final String userName;
  final String userAvatar;
  final String title;
  final String description;
  final String imageUrl;
  final int likes;
  final int comments;
  final bool isLiked;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<String> tags;
  final String category;

  Post({
    required this.id,
    required this.userId,
    required this.userName,
    required this.userAvatar,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.likes,
    required this.comments,
    required this.isLiked,
    required this.createdAt,
    required this.updatedAt,
    required this.tags,
    required this.category,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'],
      userId: json['userId'],
      userName: json['userName'],
      userAvatar: json['userAvatar'],
      title: json['title'],
      description: json['description'],
      imageUrl: json['imageUrl'],
      likes: json['likes'],
      comments: json['comments'],
      isLiked: json['isLiked'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      tags: List<String>.from(json['tags']),
      category: json['category'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'userName': userName,
      'userAvatar': userAvatar,
      'title': title,
      'description': description,
      'imageUrl': imageUrl,
      'likes': likes,
      'comments': comments,
      'isLiked': isLiked,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'tags': tags,
      'category': category,
    };
  }
}

class CreatePostData {
  final String title;
  final String description;
  final String imageUrl;
  final List<String> tags;
  final String category;

  CreatePostData({
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.tags,
    required this.category,
  });

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'description': description,
      'imageUrl': imageUrl,
      'tags': tags,
      'category': category,
    };
  }
}

class PostFilters {
  final String? category;
  final List<String>? tags;
  final String? search;

  PostFilters({
    this.category,
    this.tags,
    this.search,
  });

  Map<String, dynamic> toJson() {
    return {
      'category': category,
      'tags': tags,
      'search': search,
    };
  }
}

class PostResponse {
  final bool success;
  final List<Post> data;
  final PostPagination pagination;

  PostResponse({
    required this.success,
    required this.data,
    required this.pagination,
  });

  factory PostResponse.fromJson(Map<String, dynamic> json) {
    return PostResponse(
      success: json['success'],
      data: (json['data'] as List).map((post) => Post.fromJson(post)).toList(),
      pagination: PostPagination.fromJson(json['pagination']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'data': data.map((post) => post.toJson()).toList(),
      'pagination': pagination.toJson(),
    };
  }
}

class PostPagination {
  final int page;
  final int limit;
  final int total;
  final int totalPages;

  PostPagination({
    required this.page,
    required this.limit,
    required this.total,
    required this.totalPages,
  });

  factory PostPagination.fromJson(Map<String, dynamic> json) {
    return PostPagination(
      page: json['page'],
      limit: json['limit'],
      total: json['total'],
      totalPages: json['totalPages'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'page': page,
      'limit': limit,
      'total': total,
      'totalPages': totalPages,
    };
  }
}
