import 'package:flutter/material.dart';
import '../../../core/utils/system_ui_utils.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _privateAccount = false;
  bool _pushLikes = true;
  bool _pushComments = true;
  bool _pushFollows = true;

  @override
  Widget build(BuildContext context) {
    // Apply red theme to system UI (status bar and navigation bar)
    SystemUIUtils.applyRedTheme();

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: SafeArea(
        child: Column(
          children: [
            // Header with back button and title
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              decoration: const BoxDecoration(
                color: Color.fromARGB(255, 255, 60, 60),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(20),
                  bottomRight: Radius.circular(20),
                ),
              ),
              child: SafeArea(
                child: Row(
                  children: [
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(
                        Icons.arrow_back,
                        color: Colors.white,
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Settings',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Settings Content
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  _sectionHeader('Account'),
                  _tile(
                    icon: Icons.person_outline,
                    title: 'Edit Profile',
                    onTap: () => Navigator.pop(context),
                  ),
                  _switch(
                    icon: Icons.lock_outline,
                    title: 'Private Account',
                    value: _privateAccount,
                    onChanged: (v) => setState(() => _privateAccount = v),
                  ),
                  const SizedBox(height: 16),
                  _sectionHeader('Notifications'),
                  _switch(
                    icon: Icons.favorite_border,
                    title: 'Likes',
                    value: _pushLikes,
                    onChanged: (v) => setState(() => _pushLikes = v),
                  ),
                  _switch(
                    icon: Icons.chat_bubble_outline,
                    title: 'Comments',
                    value: _pushComments,
                    onChanged: (v) => setState(() => _pushComments = v),
                  ),
                  _switch(
                    icon: Icons.person_add_alt,
                    title: 'Follows',
                    value: _pushFollows,
                    onChanged: (v) => setState(() => _pushFollows = v),
                  ),
                  const SizedBox(height: 16),
                  _sectionHeader('Security'),
                  _tile(
                    icon: Icons.lock_reset,
                    title: 'Change Password',
                    onTap: () {},
                  ),
                  _tile(
                    icon: Icons.devices_other,
                    title: 'Login Activity',
                    onTap: () {},
                  ),
                  const SizedBox(height: 16),
                  _sectionHeader('Support'),
                  _tile(
                    icon: Icons.help_outline,
                    title: 'Help Center',
                    onTap: () {},
                  ),
                  _tile(
                    icon: Icons.privacy_tip_outlined,
                    title: 'Privacy Policy',
                    onTap: () {},
                  ),
                  _tile(
                    icon: Icons.description_outlined,
                    title: 'Terms of Service',
                    onTap: () {},
                  ),
                  const SizedBox(height: 24),
                  _dangerTile(
                    icon: Icons.logout,
                    title: 'Log Out',
                    onTap: _confirmLogout,
                  ),
                  _dangerTile(
                    icon: Icons.delete_outline,
                    title: 'Delete Account',
                    onTap: () {},
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _confirmLogout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Log Out'),
        content: const Text('Are you sure you want to log out?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Log Out'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      // Clear user session if needed and navigate to login
      if (!mounted) return;
      Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
    }
  }

  Widget _sectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8, top: 8),
      child: Text(
        title.toUpperCase(),
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: Color.fromARGB(255, 255, 60, 60),
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _tile(
      {required IconData icon, required String title, VoidCallback? onTap}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color.fromARGB(255, 255, 60, 60).withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            color: const Color.fromARGB(255, 255, 60, 60),
            size: 20,
          ),
        ),
        title: Text(
          title,
          style: const TextStyle(
            color: Colors.black,
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
        trailing: const Icon(
          Icons.chevron_right,
          color: Color(0xFF9E9E9E),
          size: 20,
        ),
        onTap: onTap,
      ),
    );
  }

  Widget _switch({
    required IconData icon,
    required String title,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: SwitchListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        secondary: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color.fromARGB(255, 255, 60, 60).withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            color: const Color.fromARGB(255, 255, 60, 60),
            size: 20,
          ),
        ),
        title: Text(
          title,
          style: const TextStyle(
            color: Colors.black,
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
        value: value,
        onChanged: onChanged,
        activeThumbColor: const Color.fromARGB(255, 255, 60, 60),
        activeTrackColor:
            const Color.fromARGB(255, 255, 60, 60).withOpacity(0.3),
      ),
    );
  }

  Widget _dangerTile(
      {required IconData icon, required String title, VoidCallback? onTap}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color(0xFFE11D48).withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            color: const Color(0xFFE11D48),
            size: 20,
          ),
        ),
        title: Text(
          title,
          style: const TextStyle(
            color: Color(0xFFE11D48),
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
        onTap: onTap,
      ),
    );
  }
}
