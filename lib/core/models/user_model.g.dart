// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class UserAdapter extends TypeAdapter<User> {
  @override
  final int typeId = 0;

  @override
  User read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return User(
      id: fields[0] as String,
      email: fields[1] as String,
      username: fields[2] as String,
      fullName: fields[3] as String,
      profileImage: fields[4] as String?,
      bio: fields[5] as String?,
      userType: fields[6] as String,
      specializations: (fields[7] as List).cast<String>(),
      rating: fields[8] as double,
      reviewCount: fields[9] as int,
      location: fields[10] as String?,
      latitude: fields[11] as double?,
      longitude: fields[12] as double?,
      isVerified: fields[13] as bool,
      createdAt: fields[14] as DateTime,
      updatedAt: fields[15] as DateTime,
      socialLinks: (fields[16] as Map?)?.cast<String, dynamic>(),
      portfolioImages: (fields[17] as List?)?.cast<String>(),
      pricingInfo: (fields[18] as Map?)?.cast<String, dynamic>(),
      isOnline: fields[19] as bool,
      lastSeen: fields[20] as DateTime?,
    );
  }

  @override
  void write(BinaryWriter writer, User obj) {
    writer
      ..writeByte(21)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.email)
      ..writeByte(2)
      ..write(obj.username)
      ..writeByte(3)
      ..write(obj.fullName)
      ..writeByte(4)
      ..write(obj.profileImage)
      ..writeByte(5)
      ..write(obj.bio)
      ..writeByte(6)
      ..write(obj.userType)
      ..writeByte(7)
      ..write(obj.specializations)
      ..writeByte(8)
      ..write(obj.rating)
      ..writeByte(9)
      ..write(obj.reviewCount)
      ..writeByte(10)
      ..write(obj.location)
      ..writeByte(11)
      ..write(obj.latitude)
      ..writeByte(12)
      ..write(obj.longitude)
      ..writeByte(13)
      ..write(obj.isVerified)
      ..writeByte(14)
      ..write(obj.createdAt)
      ..writeByte(15)
      ..write(obj.updatedAt)
      ..writeByte(16)
      ..write(obj.socialLinks)
      ..writeByte(17)
      ..write(obj.portfolioImages)
      ..writeByte(18)
      ..write(obj.pricingInfo)
      ..writeByte(19)
      ..write(obj.isOnline)
      ..writeByte(20)
      ..write(obj.lastSeen);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
