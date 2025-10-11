import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/providers/theme_provider.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _darkMode = false;
  bool _privateAccount = false;
  bool _pushLikes = true;
  bool _pushComments = true;
  bool _pushFollows = true;

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    _darkMode = themeProvider.mode == ThemeMode.dark;
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Settings', style: TextStyle(color: Colors.black)),
        centerTitle: false,
      ),
      body: ListView(
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
          _sectionHeader('Appearance'),
          _switch(
            icon: Icons.dark_mode_outlined,
            title: 'Dark Mode',
            value: _darkMode,
            onChanged: (v) {
              setState(() => _darkMode = v);
              themeProvider.setDark(v);
            },
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
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w700,
          color: Colors.black,
        ),
      ),
    );
  }

  Widget _tile(
      {required IconData icon, required String title, VoidCallback? onTap}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE0E0E0), width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ListTile(
        leading: Icon(icon, color: Colors.black),
        title: Text(title, style: const TextStyle(color: Colors.black)),
        trailing: const Icon(Icons.chevron_right, color: Colors.black),
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
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE0E0E0), width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: SwitchListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16),
        secondary: Icon(icon, color: Colors.black),
        title: Text(title, style: const TextStyle(color: Colors.black)),
        value: value,
        onChanged: onChanged,
        activeColor: const Color.fromARGB(255, 255, 60, 60),
      ),
    );
  }

  Widget _dangerTile(
      {required IconData icon, required String title, VoidCallback? onTap}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE0E0E0), width: 1),
      ),
      child: ListTile(
        leading: Icon(icon, color: const Color(0xFFE11D48)),
        title: Text(title, style: const TextStyle(color: Color(0xFFE11D48))),
        onTap: onTap,
      ),
    );
  }
}
