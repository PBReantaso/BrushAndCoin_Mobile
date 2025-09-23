import 'package:flutter/material.dart';

class EventsProvider extends ChangeNotifier {
  final List<Map<String, dynamic>> _events = [
    {
      'id': 1,
      'title': 'Bicol Cosplay Arena',
      'date': DateTime(2025, 9, 19),
      'image': null,
      'description':
          'Anime cosplay event featuring Hatsune Miku and other characters',
      'location': 'Bicol Cosplay Arena',
    },
    {
      'id': 2,
      'title': 'Art Gallery Opening',
      'date': DateTime(2025, 9, 25),
      'image': null,
      'description': 'Local artist showcase and gallery opening',
      'location': 'Downtown Art Center',
    },
  ];

  List<Map<String, dynamic>> get events => List.unmodifiable(_events);

  void addEvent({
    required String title,
    required DateTime date,
    required String venue,
    required String description,
    String? imagePath,
    String? locationAddress,
  }) {
    final newEvent = {
      'id': DateTime.now().millisecondsSinceEpoch,
      'title': title,
      'date': date,
      'image': imagePath,
      'description': description,
      'location': venue,
      'address': locationAddress,
    };
    _events.insert(0, newEvent);
    notifyListeners();
  }
}
