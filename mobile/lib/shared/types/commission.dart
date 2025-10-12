// Shared Commission Types for Mobile App

enum CommissionStatus {
  pending,
  accepted,
  inProgress,
  awaitingApproval,
  completed,
  cancelled,
  declined,
}

enum PaymentMethod {
  gcash,
  paymaya,
  paypal,
  stripe,
}

enum CommissionCategory {
  digitalArt,
  traditionalArt,
  portrait,
  characterDesign,
  logoDesign,
  illustration,
  photography,
  other,
}

enum EscrowStatus {
  pending,
  held,
  released,
  refunded,
}

class CommissionRequest {
  final String id;
  final String title;
  final String description;
  final CommissionCategory category;
  final double budget;
  final DateTime deadline;
  final String? requirements;
  final bool isUrgent;
  final List<String>? referenceImages;
  final String clientId;
  final String clientName;
  final String? clientAvatar;
  final String artistId;
  final String artistName;
  final String? artistAvatar;
  final CommissionStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;

  CommissionRequest({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.budget,
    required this.deadline,
    this.requirements,
    required this.isUrgent,
    this.referenceImages,
    required this.clientId,
    required this.clientName,
    this.clientAvatar,
    required this.artistId,
    required this.artistName,
    this.artistAvatar,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory CommissionRequest.fromJson(Map<String, dynamic> json) {
    return CommissionRequest(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      category: CommissionCategory.values.firstWhere(
        (e) => e.name == json['category'],
        orElse: () => CommissionCategory.other,
      ),
      budget: (json['budget'] as num).toDouble(),
      deadline: DateTime.parse(json['deadline']),
      requirements: json['requirements'],
      isUrgent: json['is_urgent'] ?? false,
      referenceImages: json['reference_images'] != null
          ? List<String>.from(json['reference_images'])
          : null,
      clientId: json['client_id'],
      clientName: json['client_name'],
      clientAvatar: json['client_avatar'],
      artistId: json['artist_id'],
      artistName: json['artist_name'],
      artistAvatar: json['artist_avatar'],
      status: CommissionStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => CommissionStatus.pending,
      ),
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category.name,
      'budget': budget,
      'deadline': deadline.toIso8601String(),
      'requirements': requirements,
      'is_urgent': isUrgent,
      'reference_images': referenceImages,
      'client_id': clientId,
      'client_name': clientName,
      'client_avatar': clientAvatar,
      'artist_id': artistId,
      'artist_name': artistName,
      'artist_avatar': artistAvatar,
      'status': status.name,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

class Commission {
  final String id;
  final String title;
  final String description;
  final CommissionCategory category;
  final double budget;
  final double? urgencyFee;
  final double platformFee;
  final double totalAmount;
  final DateTime deadline;
  final String? requirements;
  final List<String>? referenceImages;
  final String clientId;
  final String clientName;
  final String? clientAvatar;
  final String artistId;
  final String artistName;
  final String? artistAvatar;
  final CommissionStatus status;
  final PaymentMethod? paymentMethod;
  final EscrowStatus escrowStatus;
  final int progress; // 0-100
  final String? latestUpdate;
  final WorkSubmission? workSubmission;
  final List<Revision> revisions;
  final DateTime createdAt;
  final DateTime updatedAt;

  Commission({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.budget,
    this.urgencyFee,
    required this.platformFee,
    required this.totalAmount,
    required this.deadline,
    this.requirements,
    this.referenceImages,
    required this.clientId,
    required this.clientName,
    this.clientAvatar,
    required this.artistId,
    required this.artistName,
    this.artistAvatar,
    required this.status,
    this.paymentMethod,
    required this.escrowStatus,
    required this.progress,
    this.latestUpdate,
    this.workSubmission,
    required this.revisions,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Commission.fromJson(Map<String, dynamic> json) {
    return Commission(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      category: CommissionCategory.values.firstWhere(
        (e) => e.name == json['category'],
        orElse: () => CommissionCategory.other,
      ),
      budget: (json['budget'] as num).toDouble(),
      urgencyFee: json['urgency_fee'] != null
          ? (json['urgency_fee'] as num).toDouble()
          : null,
      platformFee: (json['platform_fee'] as num).toDouble(),
      totalAmount: (json['total_amount'] as num).toDouble(),
      deadline: DateTime.parse(json['deadline']),
      requirements: json['requirements'],
      referenceImages: json['reference_images'] != null
          ? List<String>.from(json['reference_images'])
          : null,
      clientId: json['client_id'],
      clientName: json['client_name'],
      clientAvatar: json['client_avatar'],
      artistId: json['artist_id'],
      artistName: json['artist_name'],
      artistAvatar: json['artist_avatar'],
      status: CommissionStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => CommissionStatus.pending,
      ),
      paymentMethod: json['payment_method'] != null
          ? PaymentMethod.values.firstWhere(
              (e) => e.name == json['payment_method'],
              orElse: () => PaymentMethod.gcash,
            )
          : null,
      escrowStatus: EscrowStatus.values.firstWhere(
        (e) => e.name == json['escrow_status'],
        orElse: () => EscrowStatus.pending,
      ),
      progress: json['progress'] ?? 0,
      latestUpdate: json['latest_update'],
      workSubmission: json['work_submission'] != null
          ? WorkSubmission.fromJson(json['work_submission'])
          : null,
      revisions: json['revisions'] != null
          ? List<Revision>.from(
              json['revisions'].map((x) => Revision.fromJson(x)))
          : [],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category.name,
      'budget': budget,
      'urgency_fee': urgencyFee,
      'platform_fee': platformFee,
      'total_amount': totalAmount,
      'deadline': deadline.toIso8601String(),
      'requirements': requirements,
      'reference_images': referenceImages,
      'client_id': clientId,
      'client_name': clientName,
      'client_avatar': clientAvatar,
      'artist_id': artistId,
      'artist_name': artistName,
      'artist_avatar': artistAvatar,
      'status': status.name,
      'payment_method': paymentMethod?.name,
      'escrow_status': escrowStatus.name,
      'progress': progress,
      'latest_update': latestUpdate,
      'work_submission': workSubmission?.toJson(),
      'revisions': revisions.map((x) => x.toJson()).toList(),
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

class WorkSubmission {
  final String id;
  final String commissionId;
  final String workUrl;
  final String? description;
  final DateTime submittedAt;
  final String status; // 'pending', 'approved', 'revision_requested'

  WorkSubmission({
    required this.id,
    required this.commissionId,
    required this.workUrl,
    this.description,
    required this.submittedAt,
    required this.status,
  });

  factory WorkSubmission.fromJson(Map<String, dynamic> json) {
    return WorkSubmission(
      id: json['id'],
      commissionId: json['commission_id'],
      workUrl: json['work_url'],
      description: json['description'],
      submittedAt: DateTime.parse(json['submitted_at']),
      status: json['status'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'commission_id': commissionId,
      'work_url': workUrl,
      'description': description,
      'submitted_at': submittedAt.toIso8601String(),
      'status': status,
    };
  }
}

class Revision {
  final String id;
  final String commissionId;
  final String feedback;
  final String requestedBy; // clientId or artistId
  final DateTime requestedAt;
  final bool resolved;
  final DateTime? resolvedAt;

  Revision({
    required this.id,
    required this.commissionId,
    required this.feedback,
    required this.requestedBy,
    required this.requestedAt,
    required this.resolved,
    this.resolvedAt,
  });

  factory Revision.fromJson(Map<String, dynamic> json) {
    return Revision(
      id: json['id'],
      commissionId: json['commission_id'],
      feedback: json['feedback'],
      requestedBy: json['requested_by'],
      requestedAt: DateTime.parse(json['requested_at']),
      resolved: json['resolved'],
      resolvedAt: json['resolved_at'] != null
          ? DateTime.parse(json['resolved_at'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'commission_id': commissionId,
      'feedback': feedback,
      'requested_by': requestedBy,
      'requested_at': requestedAt.toIso8601String(),
      'resolved': resolved,
      'resolved_at': resolvedAt?.toIso8601String(),
    };
  }
}

class EscrowPayment {
  final String id;
  final String commissionId;
  final double amount;
  final String currency;
  final PaymentMethod paymentMethod;
  final String? gatewayTransactionId;
  final EscrowStatus status;
  final DateTime? heldAt;
  final DateTime? releasedAt;
  final DateTime? refundedAt;
  final DateTime createdAt;

  EscrowPayment({
    required this.id,
    required this.commissionId,
    required this.amount,
    required this.currency,
    required this.paymentMethod,
    this.gatewayTransactionId,
    required this.status,
    this.heldAt,
    this.releasedAt,
    this.refundedAt,
    required this.createdAt,
  });

  factory EscrowPayment.fromJson(Map<String, dynamic> json) {
    return EscrowPayment(
      id: json['id'],
      commissionId: json['commission_id'],
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'],
      paymentMethod: PaymentMethod.values.firstWhere(
        (e) => e.name == json['payment_method'],
        orElse: () => PaymentMethod.gcash,
      ),
      gatewayTransactionId: json['gateway_transaction_id'],
      status: EscrowStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => EscrowStatus.pending,
      ),
      heldAt: json['held_at'] != null ? DateTime.parse(json['held_at']) : null,
      releasedAt: json['released_at'] != null
          ? DateTime.parse(json['released_at'])
          : null,
      refundedAt: json['refunded_at'] != null
          ? DateTime.parse(json['refunded_at'])
          : null,
      createdAt: DateTime.parse(json['created_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'commission_id': commissionId,
      'amount': amount,
      'currency': currency,
      'payment_method': paymentMethod.name,
      'gateway_transaction_id': gatewayTransactionId,
      'status': status.name,
      'held_at': heldAt?.toIso8601String(),
      'released_at': releasedAt?.toIso8601String(),
      'refunded_at': refundedAt?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
    };
  }
}
