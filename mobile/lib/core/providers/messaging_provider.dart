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

  // Return conversation for a given key; seed with sample messages if empty
  List<Message> getConversation(String key) {
    if (!_conversationMessages.containsKey(key)) {
      final currentUser = User(id: 'current_user', name: 'You');
      final otherUser = User(
          id: 'other_user',
          name: 'Alice Johnson',
          avatar: 'https://i.pravatar.cc/150?img=3');

      _conversationMessages[key] = [
        Message(
          id: '1',
          conversationId: key,
          senderId: otherUser.id,
          sender: otherUser,
          content:
              "Hey! How is the commission going? I'm really excited to see the final result!",
          type: MessageType.text,
          timestamp: DateTime.now().subtract(const Duration(minutes: 30)),
          isRead: true,
        ),
        Message(
          id: '2',
          conversationId: key,
          senderId: currentUser.id,
          sender: currentUser,
          content: "It's going great! I'm about 70% done with the sketch.",
          type: MessageType.text,
          timestamp: DateTime.now().subtract(const Duration(minutes: 25)),
          isRead: true,
        ),
      ];
    }
    return _conversationMessages[key]!;
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

    final conversation = getConversation(conversationId);
    conversation.add(message);
    notifyListeners();
  }

  void markAllRead(String conversationId) {
    // Update read status for all messages in conversation
    // In a real app, this would update the Message objects
    getConversation(conversationId); // Ensure conversation exists
    notifyListeners();
  }

  void editMessage({
    required String conversationId,
    required String messageId,
    required String newContent,
  }) {
    final conversation = getConversation(conversationId);
    final index = conversation.indexWhere((m) => m.id == messageId);
    if (index != -1) {
      // In a real app, you'd update the message content
      // For now, we'll just notify listeners
      notifyListeners();
    }
  }

  void deleteMessage({
    required String conversationId,
    required String messageId,
  }) {
    final conversation = getConversation(conversationId);
    final index = conversation.indexWhere((m) => m.id == messageId);
    if (index != -1) {
      conversation.removeAt(index);
      notifyListeners();
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
}
