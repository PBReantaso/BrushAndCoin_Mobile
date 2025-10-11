import 'package:hive/hive.dart';

part 'commission_model.g.dart';

@HiveType(typeId: 1)
class Commission extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String title;
  
  @HiveField(2)
  final String description;
  
  @HiveField(3)
  final String artistId;
  
  @HiveField(4)
  final String clientId;
  
  @HiveField(5)
  final double amount;
  
  @HiveField(6)
  final String currency;
  
  @HiveField(7)
  final CommissionStatus status;
  
  @HiveField(8)
  final DateTime deadline;
  
  @HiveField(9)
  final DateTime createdAt;
  
  @HiveField(10)
  final DateTime updatedAt;
  
  @HiveField(11)
  final List<String>? referenceImages;
  
  @HiveField(12)
  final Map<String, dynamic>? requirements;
  
  @HiveField(13)
  final List<Milestone> milestones;
  
  @HiveField(14)
  final String? contractId;
  
  @HiveField(15)
  final String? paymentId;
  
  @HiveField(16)
  final Map<String, dynamic>? artworkDetails;
  
  @HiveField(17)
  final String? finalArtworkUrl;
  
  @HiveField(18)
  final List<String>? tags;
  
  @HiveField(19)
  final CommissionType type;
  
  @HiveField(20)
  final String? category;

  Commission({
    required this.id,
    required this.title,
    required this.description,
    required this.artistId,
    required this.clientId,
    required this.amount,
    this.currency = 'PHP',
    required this.status,
    required this.deadline,
    required this.createdAt,
    required this.updatedAt,
    this.referenceImages,
    this.requirements,
    this.milestones = const [],
    this.contractId,
    this.paymentId,
    this.artworkDetails,
    this.finalArtworkUrl,
    this.tags,
    required this.type,
    this.category,
  });

  factory Commission.fromJson(Map<String, dynamic> json) {
    return Commission(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      artistId: json['artist_id'],
      clientId: json['client_id'],
      amount: (json['amount'] ?? 0.0).toDouble(),
      currency: json['currency'] ?? 'PHP',
      status: CommissionStatus.values.firstWhere(
        (e) => e.toString().split('.').last == json['status'],
        orElse: () => CommissionStatus.pending,
      ),
      deadline: DateTime.parse(json['deadline']),
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
      referenceImages: List<String>.from(json['reference_images'] ?? []),
      requirements: json['requirements'],
      milestones: (json['milestones'] as List<dynamic>?)
          ?.map((e) => Milestone.fromJson(e))
          .toList() ?? [],
      contractId: json['contract_id'],
      paymentId: json['payment_id'],
      artworkDetails: json['artwork_details'],
      finalArtworkUrl: json['final_artwork_url'],
      tags: List<String>.from(json['tags'] ?? []),
      type: CommissionType.values.firstWhere(
        (e) => e.toString().split('.').last == json['type'],
        orElse: () => CommissionType.custom,
      ),
      category: json['category'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'artist_id': artistId,
      'client_id': clientId,
      'amount': amount,
      'currency': currency,
      'status': status.toString().split('.').last,
      'deadline': deadline.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'reference_images': referenceImages,
      'requirements': requirements,
      'milestones': milestones.map((e) => e.toJson()).toList(),
      'contract_id': contractId,
      'payment_id': paymentId,
      'artwork_details': artworkDetails,
      'final_artwork_url': finalArtworkUrl,
      'tags': tags,
      'type': type.toString().split('.').last,
      'category': category,
    };
  }

  Commission copyWith({
    String? id,
    String? title,
    String? description,
    String? artistId,
    String? clientId,
    double? amount,
    String? currency,
    CommissionStatus? status,
    DateTime? deadline,
    DateTime? createdAt,
    DateTime? updatedAt,
    List<String>? referenceImages,
    Map<String, dynamic>? requirements,
    List<Milestone>? milestones,
    String? contractId,
    String? paymentId,
    Map<String, dynamic>? artworkDetails,
    String? finalArtworkUrl,
    List<String>? tags,
    CommissionType? type,
    String? category,
  }) {
    return Commission(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      artistId: artistId ?? this.artistId,
      clientId: clientId ?? this.clientId,
      amount: amount ?? this.amount,
      currency: currency ?? this.currency,
      status: status ?? this.status,
      deadline: deadline ?? this.deadline,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      referenceImages: referenceImages ?? this.referenceImages,
      requirements: requirements ?? this.requirements,
      milestones: milestones ?? this.milestones,
      contractId: contractId ?? this.contractId,
      paymentId: paymentId ?? this.paymentId,
      artworkDetails: artworkDetails ?? this.artworkDetails,
      finalArtworkUrl: finalArtworkUrl ?? this.finalArtworkUrl,
      tags: tags ?? this.tags,
      type: type ?? this.type,
      category: category ?? this.category,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Commission && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'Commission(id: $id, title: $title, status: $status, amount: $amount $currency)';
  }
}

@HiveType(typeId: 2)
enum CommissionStatus {
  @HiveField(0)
  pending,
  @HiveField(1)
  accepted,
  @HiveField(2)
  inProgress,
  @HiveField(3)
  review,
  @HiveField(4)
  completed,
  @HiveField(5)
  cancelled,
  @HiveField(6)
  disputed,
}

@HiveType(typeId: 3)
enum CommissionType {
  @HiveField(0)
  portrait,
  @HiveField(1)
  landscape,
  @HiveField(2)
  character,
  @HiveField(3)
  logo,
  @HiveField(4)
  illustration,
  @HiveField(5)
  custom,
}

@HiveType(typeId: 4)
class Milestone extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String title;
  
  @HiveField(2)
  final String description;
  
  @HiveField(3)
  final double percentage;
  
  @HiveField(4)
  final DateTime dueDate;
  
  @HiveField(5)
  final bool isCompleted;
  
  @HiveField(6)
  final DateTime? completedAt;
  
  @HiveField(7)
  final String? deliverableUrl;

  Milestone({
    required this.id,
    required this.title,
    required this.description,
    required this.percentage,
    required this.dueDate,
    this.isCompleted = false,
    this.completedAt,
    this.deliverableUrl,
  });

  factory Milestone.fromJson(Map<String, dynamic> json) {
    return Milestone(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      percentage: (json['percentage'] ?? 0.0).toDouble(),
      dueDate: DateTime.parse(json['due_date']),
      isCompleted: json['is_completed'] ?? false,
      completedAt: json['completed_at'] != null ? DateTime.parse(json['completed_at']) : null,
      deliverableUrl: json['deliverable_url'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'percentage': percentage,
      'due_date': dueDate.toIso8601String(),
      'is_completed': isCompleted,
      'completed_at': completedAt?.toIso8601String(),
      'deliverable_url': deliverableUrl,
    };
  }

  Milestone copyWith({
    String? id,
    String? title,
    String? description,
    double? percentage,
    DateTime? dueDate,
    bool? isCompleted,
    DateTime? completedAt,
    String? deliverableUrl,
  }) {
    return Milestone(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      percentage: percentage ?? this.percentage,
      dueDate: dueDate ?? this.dueDate,
      isCompleted: isCompleted ?? this.isCompleted,
      completedAt: completedAt ?? this.completedAt,
      deliverableUrl: deliverableUrl ?? this.deliverableUrl,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Milestone && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'Milestone(id: $id, title: $title, percentage: $percentage%, completed: $isCompleted)';
  }
}
