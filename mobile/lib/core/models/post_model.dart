class Post {
  final String id;
  final String userId;
  final String userName;
  final String? userAvatar;
  final String artworkTitle;
  final String? artworkDescription;
  final String artworkImageUrl;
  final List<String> tags;
  final int likesCount;
  final int commentsCount;
  final bool isLiked;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String? location;
  final double? price;
  final bool isForSale;
  final String? category;
  final Map<String, dynamic>? metadata;

  Post({
    required this.id,
    required this.userId,
    required this.userName,
    this.userAvatar,
    required this.artworkTitle,
    this.artworkDescription,
    required this.artworkImageUrl,
    this.tags = const [],
    this.likesCount = 0,
    this.commentsCount = 0,
    this.isLiked = false,
    required this.createdAt,
    required this.updatedAt,
    this.location,
    this.price,
    this.isForSale = false,
    this.category,
    this.metadata,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'],
      userId: json['user_id'],
      userName: json['user_name'],
      userAvatar: json['user_avatar'],
      artworkTitle: json['artwork_title'],
      artworkDescription: json['artwork_description'],
      artworkImageUrl: json['artwork_image_url'],
      tags: List<String>.from(json['tags'] ?? []),
      likesCount: json['likes_count'] ?? 0,
      commentsCount: json['comments_count'] ?? 0,
      isLiked: json['is_liked'] ?? false,
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
      location: json['location'],
      price: json['price']?.toDouble(),
      isForSale: json['is_for_sale'] ?? false,
      category: json['category'],
      metadata: json['metadata'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'user_name': userName,
      'user_avatar': userAvatar,
      'artwork_title': artworkTitle,
      'artwork_description': artworkDescription,
      'artwork_image_url': artworkImageUrl,
      'tags': tags,
      'likes_count': likesCount,
      'comments_count': commentsCount,
      'is_liked': isLiked,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'location': location,
      'price': price,
      'is_for_sale': isForSale,
      'category': category,
      'metadata': metadata,
    };
  }

  Post copyWith({
    String? id,
    String? userId,
    String? userName,
    String? userAvatar,
    String? artworkTitle,
    String? artworkDescription,
    String? artworkImageUrl,
    List<String>? tags,
    int? likesCount,
    int? commentsCount,
    bool? isLiked,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? location,
    double? price,
    bool? isForSale,
    String? category,
    Map<String, dynamic>? metadata,
  }) {
    return Post(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      userName: userName ?? this.userName,
      userAvatar: userAvatar ?? this.userAvatar,
      artworkTitle: artworkTitle ?? this.artworkTitle,
      artworkDescription: artworkDescription ?? this.artworkDescription,
      artworkImageUrl: artworkImageUrl ?? this.artworkImageUrl,
      tags: tags ?? this.tags,
      likesCount: likesCount ?? this.likesCount,
      commentsCount: commentsCount ?? this.commentsCount,
      isLiked: isLiked ?? this.isLiked,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      location: location ?? this.location,
      price: price ?? this.price,
      isForSale: isForSale ?? this.isForSale,
      category: category ?? this.category,
      metadata: metadata ?? this.metadata,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Post && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'Post(id: $id, artworkTitle: $artworkTitle, userName: $userName)';
  }
}
