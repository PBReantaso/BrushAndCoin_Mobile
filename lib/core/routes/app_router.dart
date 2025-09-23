import 'package:flutter/material.dart';
import '../../features/splash/screens/splash_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/register_screen.dart';
import '../../features/auth/screens/forgot_password_screen.dart';
import '../../features/home/screens/home_screen.dart';
import '../../features/post/screens/post_detail_screen.dart';
import '../../features/events/screens/events_screen.dart';
import '../../features/events/screens/event_detail_screen.dart';
import '../../features/events/screens/create_event_screen.dart';
import '../../features/profile/screens/profile_screen.dart';
import '../../features/profile/screens/commission_request_screen.dart';
import '../../features/profile/screens/tip_screen.dart';
import '../../features/profile/screens/edit_commission_settings_screen.dart';
import '../../features/messaging/screens/messaging_screen.dart';
import '../../features/messaging/screens/chat_screen.dart';
import '../models/post_model.dart';
import '../../features/settings/screens/settings_screen.dart';

class AppRouter {
  static const String splash = '/splash';
  static const String login = '/login';
  static const String chooseRole = '/choose-role';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';
  static const String home = '/home';
  static const String postDetail = '/post-detail';
  static const String settings = '/settings';
  static const String events = '/events';
  static const String eventDetail = '/event-detail';
  static const String profile = '/profile';
  static const String commissionRequest = '/commission-request';
  static const String tip = '/tip';
  static const String editCommissionSettings = '/edit-commission-settings';
  static const String messaging = '/messaging';
  static const String chat = '/chat';
  static const String initial = splash;

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return _noTransitionRoute(
          const SplashScreen(),
          settings,
        );

      case login:
        return _noTransitionRoute(
          const LoginScreen(),
          settings,
        );

      // Removed choose-role screen; go straight to login from splash

      case register:
        return _noTransitionRoute(
          const RegisterScreen(),
          settings,
        );

      case forgotPassword:
        return _noTransitionRoute(
          const ForgotPasswordScreen(),
          settings,
        );

      case home:
        return _noTransitionRoute(
          const HomeScreen(),
          settings,
        );

      case postDetail:
        final post = settings.arguments as Post;
        return _noTransitionRoute(
          PostDetailScreen(post: post),
          settings,
        );

      case AppRouter.settings:
        return _noTransitionRoute(
          const SettingsScreen(),
          settings,
        );

      case events:
        return _noTransitionRoute(
          const EventsScreen(),
          settings,
        );

      case eventDetail:
        final event = settings.arguments as Map<String, dynamic>;
        return _noTransitionRoute(
          EventDetailScreen(event: event),
          settings,
        );

      case '/create-event':
        return _noTransitionRoute(
          const CreateEventScreen(),
          settings,
        );

      case profile:
        final userData = settings.arguments as Map<String, dynamic>?;
        return _noTransitionRoute(
          ProfileScreen(userData: userData),
          settings,
        );

      case commissionRequest:
        final artistId =
            (settings.arguments as Map<String, dynamic>)['artistId'] as String;
        return _noTransitionRoute(
          CommissionRequestScreen(artistId: artistId),
          settings,
        );

      case tip:
        final artistId =
            (settings.arguments as Map<String, dynamic>)['artistId'] as String;
        return _noTransitionRoute(
          TipScreen(artistId: artistId),
          settings,
        );

      case editCommissionSettings:
        return _noTransitionRoute(
          const EditCommissionSettingsScreen(),
          settings,
        );

      case messaging:
        return _noTransitionRoute(
          const MessagingScreen(),
          settings,
        );

      case chat:
        final user = settings.arguments as Map<String, dynamic>;
        return _noTransitionRoute(
          ChatScreen(user: user),
          settings,
        );

      default:
        return _noTransitionRoute(
          Scaffold(
            appBar: AppBar(
              title: const Text('Page Not Found'),
            ),
            body: const Center(
              child: Text('The requested page was not found.'),
            ),
          ),
          settings,
        );
    }
  }

  static PageRoute _noTransitionRoute(Widget child, RouteSettings settings) {
    return PageRouteBuilder(
      settings: settings,
      pageBuilder: (context, animation, _) => child,
      transitionDuration: Duration.zero,
      reverseTransitionDuration: Duration.zero,
    );
  }
}
