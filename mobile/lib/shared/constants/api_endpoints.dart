// Shared API endpoints - matches shared/constants/api-endpoints.ts

class ApiEndpoints {
  static const Auth _auth = Auth._();
  static const Users _users = Users._();
  static const Artworks _artworks = Artworks._();
  static const Commissions _commissions = Commissions._();
  static const Payments _payments = Payments._();
  static const Messages _messages = Messages._();
  static const Events _events = Events._();
  static const Upload _upload = Upload._();
}

class Auth {
  const Auth._();

  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String logout = '/auth/logout';
  static const String refresh = '/auth/refresh';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';
  static const String verifyEmail = '/auth/verify-email';
}

class Users {
  const Users._();

  static const String profile = '/users/profile';
  static const String update = '/users/profile';
  static const String uploadAvatar = '/users/avatar';
  static const String search = '/users/search';
  static String getById(String id) => '/users/$id';
}

class Artworks {
  const Artworks._();

  static const String list = '/artworks';
  static const String create = '/artworks';
  static String getById(String id) => '/artworks/$id';
  static String update(String id) => '/artworks/$id';
  static String delete(String id) => '/artworks/$id';
  static const String uploadImage = '/artworks/upload';
  static const String search = '/artworks/search';
}

class Commissions {
  const Commissions._();

  static const String list = '/commissions';
  static const String create = '/commissions';
  static String getById(String id) => '/commissions/$id';
  static String update(String id) => '/commissions/$id';
  static String updateStatus(String id) => '/commissions/$id/status';
  static String addMilestone(String id) => '/commissions/$id/milestones';
  static String updateMilestone(String id, String milestoneId) =>
      '/commissions/$id/milestones/$milestoneId';
}

class Payments {
  const Payments._();

  static const String create = '/payments';
  static String getById(String id) => '/payments/$id';
  static String process(String id) => '/payments/$id/process';
  static String refund(String id) => '/payments/$id/refund';
  static const String history = '/payments/history';
  static String escrowRelease(String id) => '/payments/$id/release';
}

class Messages {
  const Messages._();

  static const String conversations = '/messages/conversations';
  static const String createConversation = '/messages/conversations';
  static String getMessages(String conversationId) =>
      '/messages/conversations/$conversationId';
  static const String sendMessage = '/messages';
  static String markRead(String messageId) => '/messages/$messageId/read';
  static const String uploadAttachment = '/messages/upload';
}

class Events {
  const Events._();

  static const String list = '/events';
  static const String create = '/events';
  static String getById(String id) => '/events/$id';
  static String update(String id) => '/events/$id';
  static String delete(String id) => '/events/$id';
  static String attend(String id) => '/events/$id/attend';
  static const String search = '/events/search';
}

class Upload {
  const Upload._();

  static const String image = '/upload/image';
  static const String file = '/upload/file';
  static const String avatar = '/upload/avatar';
}
