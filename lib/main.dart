import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:provider/provider.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:permission_handler/permission_handler.dart';

import 'core/providers/auth_provider.dart';
import 'core/providers/user_provider.dart';
import 'core/providers/artwork_provider.dart';
import 'core/providers/commission_provider.dart';
import 'core/routes/app_router.dart';
import 'core/theme/app_theme.dart';
import 'core/services/api_service.dart';
import 'core/services/storage_service.dart';

class NoOverscrollBehavior extends ScrollBehavior {
  const NoOverscrollBehavior();

  @override
  Widget buildOverscrollIndicator(
      BuildContext context, Widget child, ScrollableDetails details) {
    return child;
  }

  @override
  ScrollPhysics getScrollPhysics(BuildContext context) {
    return const ClampingScrollPhysics();
  }
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Hive for local storage
  await Hive.initFlutter();

  // Initialize services
  await StorageService.init();
  await ApiService.init();

  // Request permissions
  await _requestPermissions();

  runApp(const BrushAndCoinApp());
}

Future<void> _requestPermissions() async {
  try {
    // Only request permissions on mobile platforms
    if (!kIsWeb) {
      await Permission.location.request();
      await Permission.camera.request();
      await Permission.storage.request();
      await Permission.notification.request();
    }
  } catch (e) {
    // Ignore permission errors on web
    print('Permission request skipped on web: $e');
  }
}

class BrushAndCoinApp extends StatelessWidget {
  const BrushAndCoinApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => ArtworkProvider()),
        ChangeNotifierProvider(create: (_) => CommissionProvider()),
      ],
      child: MaterialApp(
        title: 'Brush&Coin',
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.system,
        initialRoute: AppRouter.initial,
        onGenerateRoute: AppRouter.onGenerateRoute,
        debugShowCheckedModeBanner: false,
        scrollBehavior: const NoOverscrollBehavior(),
      ),
    );
  }
}
