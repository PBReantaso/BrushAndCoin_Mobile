// Shared API endpoints - matches shared/constants/api-endpoints.ts

class ApiEndpoints {
  // Auth endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String logout = '/auth/logout';
  static const String refresh = '/auth/refresh';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';
  static const String verifyEmail = '/auth/verify-email';

  // User endpoints
  static const String userProfile = '/users/profile';
  static const String userUpdate = '/users/profile';
  static const String userUploadAvatar = '/users/avatar';
  static const String userSearch = '/users/search';
  static String userById(String id) => '/users/$id';

  // Artwork endpoints
  static const String artworkList = '/artworks';
  static const String artworkCreate = '/artworks';
  static String artworkById(String id) => '/artworks/$id';
  static String artworkUpdate(String id) => '/artworks/$id';
  static String artworkDelete(String id) => '/artworks/$id';
  static const String artworkUploadImage = '/artworks/upload';
  static const String artworkSearch = '/artworks/search';

  // Commission endpoints
  static const String commissionList = '/commissions';
  static const String commissionCreate = '/commissions';
  static String commissionById(String id) => '/commissions/$id';
  static String commissionUpdate(String id) => '/commissions/$id';
  static String commissionUpdateStatus(String id) => '/commissions/$id/status';
  static String commissionAddMilestone(String id) =>
      '/commissions/$id/milestones';
  static String commissionUpdateMilestone(String id, String milestoneId) =>
      '/commissions/$id/milestones/$milestoneId';

  // Payment endpoints
  static const String paymentCreate = '/payments';
  static String paymentById(String id) => '/payments/$id';
  static String paymentProcess(String id) => '/payments/$id/process';
  static String paymentRefund(String id) => '/payments/$id/refund';
  static const String paymentHistory = '/payments/history';
  static String paymentEscrowRelease(String id) => '/payments/$id/release';

  // Message endpoints
  static const String messageConversations = '/messages/conversations';
  static const String messageCreateConversation = '/messages/conversations';
  static String messageGetMessages(String conversationId) =>
      '/messages/conversations/$conversationId';
  static const String messageSend = '/messages';
  static String messageMarkRead(String messageId) =>
      '/messages/$messageId/read';
  static const String messageUploadAttachment = '/messages/upload';

  // Event endpoints
  static const String eventList = '/events';
  static const String eventCreate = '/events';
  static String eventById(String id) => '/events/$id';
  static String eventUpdate(String id) => '/events/$id';
  static String eventDelete(String id) => '/events/$id';
  static String eventAttend(String id) => '/events/$id/attend';
  static const String eventSearch = '/events/search';

  // Upload endpoints
  static const String uploadImage = '/upload/image';
  static const String uploadFile = '/upload/file';
  static const String uploadAvatar = '/upload/avatar';
}
