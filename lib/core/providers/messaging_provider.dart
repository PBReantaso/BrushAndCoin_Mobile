import 'package:flutter/material.dart';

class MessagingProvider extends ChangeNotifier {
  // Conversations stored by a simple key (e.g., username or userId)
  final Map<String, List<Map<String, dynamic>>> _conversations = {};

  // Return conversation for a given key; seed with sample messages if empty
  List<Map<String, dynamic>> getConversation(String key) {
    if (!_conversations.containsKey(key)) {
      _conversations[key] = [
        {
          'id': 1,
          'text':
              "Hey! How is the commission going? I'm really excited to see the final result!",
          'isMe': false,
          'timestamp': DateTime.now().subtract(const Duration(minutes: 30)),
          'isRead': true,
          'isEdited': false,
          'isDeleted': false,
        },
        {
          'id': 2,
          'text': "It's going great! I'm about 70% done with the sketch.",
          'isMe': true,
          'timestamp': DateTime.now().subtract(const Duration(minutes: 25)),
          'isRead': true,
          'isEdited': false,
          'isDeleted': false,
        },
      ];
    }
    return _conversations[key]!;
  }

  void sendMessage(
      {required String key, required String text, bool isMe = true}) {
    final conversation = getConversation(key);
    conversation.add({
      'id': conversation.length + 1,
      'text': text,
      'isMe': isMe,
      'timestamp': DateTime.now(),
      'isRead': isMe, // your own messages are read by default
      'isEdited': false,
      'isDeleted': false,
    });
    notifyListeners();
  }

  void markAllRead(String key) {
    final conversation = getConversation(key);
    for (final msg in conversation) {
      msg['isRead'] = true;
    }
    notifyListeners();
  }

  void editMessage(
      {required String key, required int messageId, required String newText}) {
    final conversation = getConversation(key);
    final idx = conversation.indexWhere((m) => m['id'] == messageId);
    if (idx != -1) {
      conversation[idx]['text'] = newText;
      conversation[idx]['isEdited'] = true;
      notifyListeners();
    }
  }

  void deleteMessage({required String key, required int messageId}) {
    final conversation = getConversation(key);
    final idx = conversation.indexWhere((m) => m['id'] == messageId);
    if (idx != -1) {
      conversation[idx]['isDeleted'] = true;
      conversation[idx]['text'] = 'This message was deleted';
      notifyListeners();
    }
  }
}
