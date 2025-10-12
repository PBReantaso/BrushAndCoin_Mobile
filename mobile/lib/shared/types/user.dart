// Shared user types - matches shared/types/user.ts

class User {
  final String id;
  final String email;
  final String username;
  final String fullName;
  final String userType; // 'artist' or 'client'
  final List<String>? specializations;
  final UserLocation? location;
  final String? profileImage;
  final String? bio;
  final double? rating;
  final bool isVerified;
  final DateTime createdAt;
  final DateTime updatedAt;

  User({
    required this.id,
    required this.email,
    required this.username,
    required this.fullName,
    required this.userType,
    this.specializations,
    this.location,
    this.profileImage,
    this.bio,
    this.rating,
    required this.isVerified,
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      username: json['username'],
      fullName: json['fullName'],
      userType: json['userType'],
      specializations: json['specializations']?.cast<String>(),
      location: json['location'] != null
          ? UserLocation.fromJson(json['location'])
          : null,
      profileImage: json['profileImage'],
      bio: json['bio'],
      rating: json['rating']?.toDouble(),
      isVerified: json['isVerified'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'username': username,
      'fullName': fullName,
      'userType': userType,
      'specializations': specializations,
      'location': location?.toJson(),
      'profileImage': profileImage,
      'bio': bio,
      'rating': rating,
      'isVerified': isVerified,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

class UserLocation {
  final String address;
  final double latitude;
  final double longitude;

  UserLocation({
    required this.address,
    required this.latitude,
    required this.longitude,
  });

  factory UserLocation.fromJson(Map<String, dynamic> json) {
    return UserLocation(
      address: json['address'],
      latitude: json['latitude'].toDouble(),
      longitude: json['longitude'].toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'address': address,
      'latitude': latitude,
      'longitude': longitude,
    };
  }
}

class AuthResponse {
  final bool success;
  final String message;
  final AuthData data;

  AuthResponse({
    required this.success,
    required this.message,
    required this.data,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      success: json['success'],
      message: json['message'],
      data: AuthData.fromJson(json['data']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'message': message,
      'data': data.toJson(),
    };
  }
}

class AuthData {
  final User user;
  final String token;

  AuthData({
    required this.user,
    required this.token,
  });

  factory AuthData.fromJson(Map<String, dynamic> json) {
    return AuthData(
      user: User.fromJson(json['user']),
      token: json['token'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user': user.toJson(),
      'token': token,
    };
  }
}

class LoginRequest {
  final String email;
  final String password;

  LoginRequest({
    required this.email,
    required this.password,
  });

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'password': password,
    };
  }
}

class RegisterRequest {
  final String email;
  final String password;
  final String username;
  final String fullName;
  final String userType;
  final List<String>? specializations;
  final UserLocation? location;

  RegisterRequest({
    required this.email,
    required this.password,
    required this.username,
    required this.fullName,
    required this.userType,
    this.specializations,
    this.location,
  });

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'password': password,
      'username': username,
      'fullName': fullName,
      'userType': userType,
      'specializations': specializations,
      'location': location?.toJson(),
    };
  }
}

