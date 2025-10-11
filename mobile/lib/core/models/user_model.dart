import 'package:hive/hive.dart';

part 'user_model.g.dart';

@HiveType(typeId: 0)
class User extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String email;
  
  @HiveField(2)
  final String username;
  
  @HiveField(3)
  final String fullName;
  
  @HiveField(4)
  final String? profileImage;
  
  @HiveField(5)
  final String? bio;
  
  @HiveField(6)
  final String userType; // 'artist' or 'client'
  
  @HiveField(7)
  final List<String> specializations; // For artists
  
  @HiveField(8)
  final double rating;
  
  @HiveField(9)
  final int reviewCount;
  
  @HiveField(10)
  final String? location;
  
  @HiveField(11)
  final double? latitude;
  
  @HiveField(12)
  final double? longitude;
  
  @HiveField(13)
  final bool isVerified;
  
  @HiveField(14)
  final DateTime createdAt;
  
  @HiveField(15)
  final DateTime updatedAt;
  
  @HiveField(16)
  final Map<String, dynamic>? socialLinks;
  
  @HiveField(17)
  final List<String>? portfolioImages;
  
  @HiveField(18)
  final Map<String, dynamic>? pricingInfo; // For artists
  
  @HiveField(19)
  final bool isOnline;
  
  @HiveField(20)
  final DateTime? lastSeen;

  User({
    required this.id,
    required this.email,
    required this.username,
    required this.fullName,
    this.profileImage,
    this.bio,
    required this.userType,
    this.specializations = const [],
    this.rating = 0.0,
    this.reviewCount = 0,
    this.location,
    this.latitude,
    this.longitude,
    this.isVerified = false,
    required this.createdAt,
    required this.updatedAt,
    this.socialLinks,
    this.portfolioImages,
    this.pricingInfo,
    this.isOnline = false,
    this.lastSeen,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      username: json['username'],
      fullName: json['full_name'],
      profileImage: json['profile_image'],
      bio: json['bio'],
      userType: json['user_type'],
      specializations: List<String>.from(json['specializations'] ?? []),
      rating: (json['rating'] ?? 0.0).toDouble(),
      reviewCount: json['review_count'] ?? 0,
      location: json['location'],
      latitude: json['latitude']?.toDouble(),
      longitude: json['longitude']?.toDouble(),
      isVerified: json['is_verified'] ?? false,
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
      socialLinks: json['social_links'],
      portfolioImages: List<String>.from(json['portfolio_images'] ?? []),
      pricingInfo: json['pricing_info'],
      isOnline: json['is_online'] ?? false,
      lastSeen: json['last_seen'] != null ? DateTime.parse(json['last_seen']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'username': username,
      'full_name': fullName,
      'profile_image': profileImage,
      'bio': bio,
      'user_type': userType,
      'specializations': specializations,
      'rating': rating,
      'review_count': reviewCount,
      'location': location,
      'latitude': latitude,
      'longitude': longitude,
      'is_verified': isVerified,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'social_links': socialLinks,
      'portfolio_images': portfolioImages,
      'pricing_info': pricingInfo,
      'is_online': isOnline,
      'last_seen': lastSeen?.toIso8601String(),
    };
  }

  User copyWith({
    String? id,
    String? email,
    String? username,
    String? fullName,
    String? profileImage,
    String? bio,
    String? userType,
    List<String>? specializations,
    double? rating,
    int? reviewCount,
    String? location,
    double? latitude,
    double? longitude,
    bool? isVerified,
    DateTime? createdAt,
    DateTime? updatedAt,
    Map<String, dynamic>? socialLinks,
    List<String>? portfolioImages,
    Map<String, dynamic>? pricingInfo,
    bool? isOnline,
    DateTime? lastSeen,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      username: username ?? this.username,
      fullName: fullName ?? this.fullName,
      profileImage: profileImage ?? this.profileImage,
      bio: bio ?? this.bio,
      userType: userType ?? this.userType,
      specializations: specializations ?? this.specializations,
      rating: rating ?? this.rating,
      reviewCount: reviewCount ?? this.reviewCount,
      location: location ?? this.location,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      isVerified: isVerified ?? this.isVerified,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      socialLinks: socialLinks ?? this.socialLinks,
      portfolioImages: portfolioImages ?? this.portfolioImages,
      pricingInfo: pricingInfo ?? this.pricingInfo,
      isOnline: isOnline ?? this.isOnline,
      lastSeen: lastSeen ?? this.lastSeen,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is User && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'User(id: $id, username: $username, fullName: $fullName, userType: $userType)';
  }
}
