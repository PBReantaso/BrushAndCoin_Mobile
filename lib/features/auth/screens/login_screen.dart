import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter/services.dart';
import '../../../core/providers/auth_provider.dart';
import '../../../core/utils/validators.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _rememberMe = false;
  String _roleFromArgs = 'client';

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args =
        ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    final role = (args?['role'] as String?)?.toLowerCase();
    if (role == 'artist' || role == 'client' || role == 'patron') {
      _roleFromArgs = role == 'patron' ? 'client' : role!;
    }
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final success = await authProvider.login(
      _emailController.text.trim(),
      _passwordController.text,
    );

    if (!mounted) return;

    if (success) {
      if (_roleFromArgs == 'client' || _roleFromArgs == 'patron') {
        Navigator.of(context).pushReplacementNamed('/home');
      } else if (_roleFromArgs == 'artist') {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Artist portal coming soon. Please use Patron mode.'),
          ),
        );
      }
    } else {
      final error = authProvider.error?.toLowerCase() ?? '';
      if (error.contains('not found') ||
          error.contains('no account') ||
          error.contains('unregistered')) {
        _promptRegister();
      }
    }
  }

  void _promptRegister() {
    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Account not found'),
        content: const Text('Would you like to create an account?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.of(context).pushNamed('/register');
            },
            child: const Text('Register'),
          ),
        ],
      ),
    );
  }

  void _navigateToRegister() {
    Navigator.of(context).pushNamed('/register');
  }

  void _navigateToForgotPassword() {
    Navigator.of(context).pushNamed('/forgot-password');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const ClampingScrollPhysics(),
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 60),

                // Role label (selected previously)
                Align(
                  alignment: Alignment.center,
                  child: Text(
                    _roleFromArgs == 'artist'
                        ? 'Login as Artist'
                        : 'Login as Patron',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.black,
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // Header - Welcome back (dynamic role)
                Text(
                  'Welcome back,',
                  style: const TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFE53E3E), // Red color from image
                  ),
                  textAlign: TextAlign.center,
                ),

                Text(
                  _roleFromArgs == 'artist' ? 'Artist!' : 'Patron!',
                  style: const TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                  textAlign: TextAlign.center,
                ),

                const SizedBox(height: 60),

                // Email/Phone Field
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F5F5),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE0E0E0)),
                  ),
                  child: TextFormField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    textInputAction: TextInputAction.next,
                    validator: Validators.validateEmail,
                    decoration: const InputDecoration(
                      hintText: 'Enter your mail/phone number',
                      hintStyle: TextStyle(
                        color: Color(0xFF9E9E9E),
                        fontSize: 16,
                      ),
                      prefixIcon: Icon(
                        Icons.email_outlined,
                        color: Color(0xFF9E9E9E),
                      ),
                      border: InputBorder.none,
                      contentPadding:
                          EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // Password Field
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F5F5),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE0E0E0)),
                  ),
                  child: TextFormField(
                    controller: _passwordController,
                    obscureText: _obscurePassword,
                    textInputAction: TextInputAction.done,
                    validator: Validators.validatePassword,
                    decoration: InputDecoration(
                      hintText: 'Enter your password',
                      hintStyle: const TextStyle(
                        color: Color(0xFF9E9E9E),
                        fontSize: 16,
                      ),
                      prefixIcon: const Icon(
                        Icons.lock_outlined,
                        color: Color(0xFF9E9E9E),
                      ),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword
                              ? Icons.visibility_outlined
                              : Icons.visibility_off_outlined,
                          color: const Color(0xFF9E9E9E),
                        ),
                        onPressed: () {
                          setState(() {
                            _obscurePassword = !_obscurePassword;
                          });
                        },
                      ),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 16),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // Remember Me & Forgot Password
                Row(
                  children: [
                    // Remember Me
                    Row(
                      children: [
                        Checkbox(
                          value: _rememberMe,
                          onChanged: (value) {
                            setState(() {
                              _rememberMe = value ?? false;
                            });
                          },
                          activeColor: const Color(0xFFE53E3E),
                        ),
                        const Text(
                          'Remember me',
                          style: TextStyle(
                            fontSize: 14,
                            color: Color(0xFF9E9E9E),
                          ),
                        ),
                      ],
                    ),

                    const Spacer(),

                    // Forgot Password
                    TextButton(
                      onPressed: _navigateToForgotPassword,
                      child: const Text(
                        'Forgot Password?',
                        style: TextStyle(
                          color: Color(0xFF3B82F6), // Blue color
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 40),

                // Sign In Button
                Consumer<AuthProvider>(
                  builder: (context, authProvider, child) {
                    return Container(
                      width: double.infinity,
                      height: 50,
                      decoration: BoxDecoration(
                        color: const Color(0xFFE53E3E), // Red button
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ElevatedButton(
                        onPressed: authProvider.isLoading ? null : _handleLogin,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.transparent,
                          shadowColor: Colors.transparent,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: authProvider.isLoading
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                      Colors.white),
                                ),
                              )
                            : const Text(
                                'Sign In',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                      ),
                    );
                  },
                ),

                const SizedBox(height: 24),

                // Error Message
                Consumer<AuthProvider>(
                  builder: (context, authProvider, child) {
                    if (authProvider.error != null) {
                      return Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFE53E3E).withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color:
                                const Color(0xFFE53E3E).withValues(alpha: 0.3),
                          ),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.error_outline,
                              color: Color(0xFFE53E3E),
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                authProvider.error!,
                                style: const TextStyle(
                                  color: Color(0xFFE53E3E),
                                  fontSize: 14,
                                ),
                              ),
                            ),
                            IconButton(
                              icon: const Icon(
                                Icons.close,
                                color: Color(0xFFE53E3E),
                                size: 20,
                              ),
                              onPressed: authProvider.clearError,
                              padding: EdgeInsets.zero,
                              constraints: const BoxConstraints(),
                            ),
                          ],
                        ),
                      );
                    }
                    return const SizedBox.shrink();
                  },
                ),

                const SizedBox(height: 40),

                // Divider
                const Row(
                  children: [
                    Expanded(child: Divider(color: Color(0xFFE0E0E0))),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: Text(
                        'Or',
                        style: TextStyle(
                          color: Color(0xFF9E9E9E),
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    Expanded(child: Divider(color: Color(0xFFE0E0E0))),
                  ],
                ),

                const SizedBox(height: 40),

                // Google Sign In Button
                Container(
                  width: double.infinity,
                  height: 50,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE0E0E0)),
                  ),
                  child: OutlinedButton.icon(
                    onPressed: () {
                      // TODO: Implement Google login
                    },
                    style: OutlinedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      side: BorderSide.none,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    icon: const Icon(
                      Icons.g_mobiledata,
                      size: 24,
                      color: Color(0xFF4285F4), // Google blue
                    ),
                    label: const Text(
                      'Continue with Google',
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 60),

                // Register Link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      "Don't have an account? ",
                      style: TextStyle(
                        color: Color(0xFF9E9E9E),
                        fontSize: 16,
                      ),
                    ),
                    TextButton(
                      onPressed: _navigateToRegister,
                      child: const Text(
                        'Sign Up',
                        style: TextStyle(
                          color: Color(0xFFE53E3E), // Red color
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 20),

                // Exit Application button
                Center(
                  child: TextButton.icon(
                    onPressed: () async {
                      await SystemChannels.platform
                          .invokeMethod<void>('SystemNavigator.pop');
                    },
                    icon: const Icon(Icons.exit_to_app, color: Colors.black54),
                    label: const Text(
                      'Exit application',
                      style: TextStyle(color: Colors.black54),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
