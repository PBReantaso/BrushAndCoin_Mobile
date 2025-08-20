import 'package:flutter/material.dart';
import '../../features/splash/screens/splash_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/register_screen.dart';
import '../../features/auth/screens/forgot_password_screen.dart';
import '../../features/home/screens/home_screen.dart';
import '../../features/post/screens/post_detail_screen.dart';
import '../../features/events/screens/events_screen.dart';
import '../../features/profile/screens/profile_screen.dart';

class AppRouter {
  static const String splash = '/splash';
  static const String login = '/login';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';
  static const String home = '/home';
  static const String postDetail = '/post-detail';
  static const String events = '/events';
  static const String profile = '/profile';
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
        final post = settings.arguments as Map<String, dynamic>;
        return _noTransitionRoute(
          PostDetailScreen(post: post),
          settings,
        );

      case events:
        return _noTransitionRoute(
          const EventsScreen(),
          settings,
        );

      case profile:
        return _noTransitionRoute(
          const ProfileScreen(),
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
