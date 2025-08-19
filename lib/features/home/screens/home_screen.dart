import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/providers/auth_provider.dart';
import '../../../core/theme/colors.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Brush&Coin'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              final authProvider = Provider.of<AuthProvider>(context, listen: false);
              await authProvider.logout();
              if (context.mounted) {
                Navigator.of(context).pushReplacementNamed('/login');
              }
            },
          ),
        ],
      ),
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          final user = authProvider.currentUser;
          
          return Container(
            decoration: const BoxDecoration(
              gradient: AppColors.backgroundGradient,
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Welcome Icon
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF6366F1), Color(0xFF818CF8)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(30),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF6366F1).withValues(alpha: 0.3),
                          blurRadius: 30,
                          offset: const Offset(0, 15),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.brush,
                      color: Colors.white,
                      size: 60,
                    ),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Welcome Text
                  Text(
                    'Welcome to Brush&Coin!',
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // User Info
                  if (user != null) ...[
                    Text(
                      'Hello, ${user.fullName}!',
                      style: const TextStyle(
                        fontSize: 18,
                        color: AppColors.textSecondary,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    
                    const SizedBox(height: 8),
                    
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                                                 color: user.userType == 'artist' 
                           ? const Color(0xFF6366F1).withValues(alpha: 0.1)
                           : const Color(0xFFF59E0B).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                                                 border: Border.all(
                           color: user.userType == 'artist' 
                             ? const Color(0xFF6366F1)
                             : const Color(0xFFF59E0B),
                           width: 1,
                         ),
                      ),
                      child: Text(
                        user.userType == 'artist' ? 'Artist' : 'Client',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                                                   color: user.userType == 'artist' 
                           ? const Color(0xFF6366F1)
                           : const Color(0xFFF59E0B),
                        ),
                      ),
                    ),
                  ],
                  
                  const SizedBox(height: 40),
                  
                  // Feature Cards
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      children: [
                        _buildFeatureCard(
                          icon: Icons.palette,
                          title: 'Discover Art',
                          subtitle: 'Browse amazing artwork from talented artists',
                          color: AppColors.primary,
                        ),
                        
                        const SizedBox(height: 16),
                        
                        _buildFeatureCard(
                          icon: Icons.handshake,
                          title: 'Commission Work',
                          subtitle: 'Request custom artwork or offer your services',
                          color: AppColors.secondary,
                        ),
                        
                        const SizedBox(height: 16),
                        
                        _buildFeatureCard(
                          icon: Icons.message,
                          title: 'Connect',
                          subtitle: 'Chat with artists and clients directly',
                          color: AppColors.accent,
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 40),
                  
                  // Coming Soon Text
                  const Text(
                    'More features coming soon!',
                    style: TextStyle(
                      fontSize: 16,
                      color: AppColors.textSecondary,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildFeatureCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: color,
                size: 24,
              ),
            ),
            
            const SizedBox(width: 16),
            
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  
                  const SizedBox(height: 4),
                  
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            
            Icon(
              Icons.arrow_forward_ios,
              color: AppColors.textTertiary,
              size: 16,
            ),
          ],
        ),
      ),
    );
  }
}
