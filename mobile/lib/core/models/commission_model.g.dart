// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'commission_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class CommissionAdapter extends TypeAdapter<Commission> {
  @override
  final int typeId = 1;

  @override
  Commission read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Commission(
      id: fields[0] as String,
      title: fields[1] as String,
      description: fields[2] as String,
      artistId: fields[3] as String,
      clientId: fields[4] as String,
      amount: fields[5] as double,
      currency: fields[6] as String,
      status: fields[7] as CommissionStatus,
      deadline: fields[8] as DateTime,
      createdAt: fields[9] as DateTime,
      updatedAt: fields[10] as DateTime,
      referenceImages: (fields[11] as List?)?.cast<String>(),
      requirements: (fields[12] as Map?)?.cast<String, dynamic>(),
      milestones: (fields[13] as List).cast<Milestone>(),
      contractId: fields[14] as String?,
      paymentId: fields[15] as String?,
      artworkDetails: (fields[16] as Map?)?.cast<String, dynamic>(),
      finalArtworkUrl: fields[17] as String?,
      tags: (fields[18] as List?)?.cast<String>(),
      type: fields[19] as CommissionType,
      category: fields[20] as String?,
    );
  }

  @override
  void write(BinaryWriter writer, Commission obj) {
    writer
      ..writeByte(21)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.title)
      ..writeByte(2)
      ..write(obj.description)
      ..writeByte(3)
      ..write(obj.artistId)
      ..writeByte(4)
      ..write(obj.clientId)
      ..writeByte(5)
      ..write(obj.amount)
      ..writeByte(6)
      ..write(obj.currency)
      ..writeByte(7)
      ..write(obj.status)
      ..writeByte(8)
      ..write(obj.deadline)
      ..writeByte(9)
      ..write(obj.createdAt)
      ..writeByte(10)
      ..write(obj.updatedAt)
      ..writeByte(11)
      ..write(obj.referenceImages)
      ..writeByte(12)
      ..write(obj.requirements)
      ..writeByte(13)
      ..write(obj.milestones)
      ..writeByte(14)
      ..write(obj.contractId)
      ..writeByte(15)
      ..write(obj.paymentId)
      ..writeByte(16)
      ..write(obj.artworkDetails)
      ..writeByte(17)
      ..write(obj.finalArtworkUrl)
      ..writeByte(18)
      ..write(obj.tags)
      ..writeByte(19)
      ..write(obj.type)
      ..writeByte(20)
      ..write(obj.category);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CommissionAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class MilestoneAdapter extends TypeAdapter<Milestone> {
  @override
  final int typeId = 4;

  @override
  Milestone read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Milestone(
      id: fields[0] as String,
      title: fields[1] as String,
      description: fields[2] as String,
      percentage: fields[3] as double,
      dueDate: fields[4] as DateTime,
      isCompleted: fields[5] as bool,
      completedAt: fields[6] as DateTime?,
      deliverableUrl: fields[7] as String?,
    );
  }

  @override
  void write(BinaryWriter writer, Milestone obj) {
    writer
      ..writeByte(8)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.title)
      ..writeByte(2)
      ..write(obj.description)
      ..writeByte(3)
      ..write(obj.percentage)
      ..writeByte(4)
      ..write(obj.dueDate)
      ..writeByte(5)
      ..write(obj.isCompleted)
      ..writeByte(6)
      ..write(obj.completedAt)
      ..writeByte(7)
      ..write(obj.deliverableUrl);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is MilestoneAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class CommissionStatusAdapter extends TypeAdapter<CommissionStatus> {
  @override
  final int typeId = 2;

  @override
  CommissionStatus read(BinaryReader reader) {
    switch (reader.readByte()) {
      case 0:
        return CommissionStatus.pending;
      case 1:
        return CommissionStatus.accepted;
      case 2:
        return CommissionStatus.inProgress;
      case 3:
        return CommissionStatus.review;
      case 4:
        return CommissionStatus.completed;
      case 5:
        return CommissionStatus.cancelled;
      case 6:
        return CommissionStatus.disputed;
      default:
        return CommissionStatus.pending;
    }
  }

  @override
  void write(BinaryWriter writer, CommissionStatus obj) {
    switch (obj) {
      case CommissionStatus.pending:
        writer.writeByte(0);
        break;
      case CommissionStatus.accepted:
        writer.writeByte(1);
        break;
      case CommissionStatus.inProgress:
        writer.writeByte(2);
        break;
      case CommissionStatus.review:
        writer.writeByte(3);
        break;
      case CommissionStatus.completed:
        writer.writeByte(4);
        break;
      case CommissionStatus.cancelled:
        writer.writeByte(5);
        break;
      case CommissionStatus.disputed:
        writer.writeByte(6);
        break;
    }
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CommissionStatusAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class CommissionTypeAdapter extends TypeAdapter<CommissionType> {
  @override
  final int typeId = 3;

  @override
  CommissionType read(BinaryReader reader) {
    switch (reader.readByte()) {
      case 0:
        return CommissionType.portrait;
      case 1:
        return CommissionType.landscape;
      case 2:
        return CommissionType.character;
      case 3:
        return CommissionType.logo;
      case 4:
        return CommissionType.illustration;
      case 5:
        return CommissionType.custom;
      default:
        return CommissionType.portrait;
    }
  }

  @override
  void write(BinaryWriter writer, CommissionType obj) {
    switch (obj) {
      case CommissionType.portrait:
        writer.writeByte(0);
        break;
      case CommissionType.landscape:
        writer.writeByte(1);
        break;
      case CommissionType.character:
        writer.writeByte(2);
        break;
      case CommissionType.logo:
        writer.writeByte(3);
        break;
      case CommissionType.illustration:
        writer.writeByte(4);
        break;
      case CommissionType.custom:
        writer.writeByte(5);
        break;
    }
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CommissionTypeAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
