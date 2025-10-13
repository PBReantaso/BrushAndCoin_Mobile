import 'package:flutter/material.dart';
import '../../shared/types/messaging.dart';

class MessagingProvider extends ChangeNotifier {
  bool _isLoading = false;
  String? _error;
  final List<Conversation> _conversations = [];
  final Map<String, List<Message>> _conversationMessages = {};

  // Getters
  bool get isLoading => _isLoading;
  String? get error => _error;
  List<Conversation> get conversations => _conversations;

  // Get messages for a conversation
  List<Message> getMessages(String conversationId) {
    return _conversationMessages[conversationId] ?? [];
  }

  // Get conversation keys for UI
  List<String> get conversationKeys => _conversationMessages.keys.toList();

  // Return conversation for a given key; return empty list if not found
  List<Message> getConversation(String key) {
    return _conversationMessages[key] ?? [];
  }

  void sendMessage({
    required String conversationId,
    required String content,
    MessageType type = MessageType.text,
    String senderId = 'current_user',
  }) {
    final currentUser = User(id: senderId, name: 'You');
    final message = Message(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      conversationId: conversationId,
      senderId: senderId,
      sender: currentUser,
      content: content,
      type: type,
      timestamp: DateTime.now(),
      isRead: true, // your own messages are read by default
    );

    // Ensure the conversation exists in the map
    if (!_conversationMessages.containsKey(conversationId)) {
      _conversationMessages[conversationId] = [];
    }

    _conversationMessages[conversationId]!.add(message);
    notifyListeners();
  }

  void markAllRead(String conversationId) {
    // Update read status for all messages in conversation
    // In a real app, this would update the Message objects
    // For now, we'll just ensure the conversation exists
    if (!_conversationMessages.containsKey(conversationId)) {
      _conversationMessages[conversationId] = [];
    }
    notifyListeners();
  }

  void editMessage({
    required String conversationId,
    required String messageId,
    required String newContent,
  }) {
    final conversation = _conversationMessages[conversationId];
    if (conversation != null) {
      final index = conversation.indexWhere((m) => m.id == messageId);
      if (index != -1) {
        // In a real app, you'd update the message content
        // For now, we'll just notify listeners
        notifyListeners();
      }
    }
  }

  void deleteMessage({
    required String conversationId,
    required String messageId,
  }) {
    final conversation = _conversationMessages[conversationId];
    if (conversation != null) {
      final index = conversation.indexWhere((m) => m.id == messageId);
      if (index != -1) {
        conversation.removeAt(index);
        notifyListeners();
      }
    }
  }

  // Error handling
  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void setError(String? error) {
    _error = error;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Create a new conversation or get existing one
  void createOrGetConversation({
    required String userName,
    required String userId,
    String? userAvatar,
  }) {
    final conversationKey = userName;

    // If conversation doesn't exist, create it
    if (!_conversationMessages.containsKey(conversationKey)) {
      final currentUser = User(id: 'current_user', name: 'You');
      final otherUser = User(
        id: userId,
        name: userName,
        avatar: userAvatar,
      );

      _conversationMessages[conversationKey] = [
        // Start with a welcome message from the other user
        Message(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          conversationId: conversationKey,
          senderId: otherUser.id,
          sender: otherUser,
          content: "Hello! Thanks for your interest in the commission.",
          type: MessageType.text,
          timestamp: DateTime.now().subtract(const Duration(minutes: 1)),
          isRead: true,
        ),
        // Follow with a message from current user
        Message(
          id: (DateTime.now().millisecondsSinceEpoch + 1).toString(),
          conversationId: conversationKey,
          senderId: currentUser.id,
          sender: currentUser,
          content: "Hello! I'd like to discuss the commission with you.",
          type: MessageType.text,
          timestamp: DateTime.now(),
          isRead: true,
        ),
      ];
    }

    notifyListeners();
  }
}
