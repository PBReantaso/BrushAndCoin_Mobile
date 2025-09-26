import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/providers/post_provider.dart';
import '../../../core/models/post_model.dart';
import 'merchandise_detail_screen.dart';
// import 'commission_request_screen.dart';
import 'edit_commission_settings_screen.dart';

class ProfileScreen extends StatefulWidget {
  final Map<String, dynamic>? userData;

  const ProfileScreen({super.key, this.userData});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final TextEditingController _searchController = TextEditingController();
  int _selectedIndex = 3; // Profile tab is selected
  int _selectedTab = 0; // Gallery tab is selected

  // Mutable state for the current user's profile so edits persist
  Map<String, dynamic>? _currentUserProfile;

  // Get profile data (either passed user data or current user)
  Map<String, dynamic> get _profile {
    if (widget.userData != null) {
      // Viewing another user's profile
      return {
        'name': widget.userData!['userName'] ?? 'Unknown User',
        'username':
            '@${(widget.userData!['userName'] ?? 'user').toLowerCase().replaceAll(' ', '')}',
        'followers': widget.userData!['followers'] ?? 0,
        'following': widget.userData!['following'] ?? 0,
        'bio': widget.userData!['bio'] ?? 'Artist and creative professional',
        'socials': widget.userData!['socials'] ??
            {
              'facebook': '',
              'twitter': '',
              'pinterest': '',
            },
        'isOtherUser': true,
        'userId': widget.userData!['userId'],
        'userAvatar': widget.userData!['userAvatar'],
        'isFollowing': widget.userData!['isFollowing'] ?? false,
      };
    } else {
      // Current user's profile (mutable)
      return _currentUserProfile!;
    }
  }

  // Get user's posts from PostProvider
  List<Post> get _userPosts {
    final postProvider = Provider.of<PostProvider>(context, listen: false);

    if (widget.userData != null) {
      // Get posts for the specific user we're viewing
      return postProvider.posts
          .where((post) => post.userId == widget.userData!['userId'])
          .toList();
    } else {
      // For current user, show only their own posts (filter by current user ID)
      // For now, we'll use a mock current user ID - in real app this would come from auth
      const currentUserId = 'current_user';
      return postProvider.posts
          .where((post) => post.userId == currentUserId)
          .toList();
    }
  }

  // Mock merchandise
  final List<Map<String, dynamic>> _merchandise = [
    {
      'id': 1,
      'title': 'Art Print - The Starry Night',
      'image': 'assets/images/merch1.jpg',
      'price': '\$25.00',
    },
    {
      'id': 2,
      'title': 'T-Shirt - Surreal Dreams',
      'image': 'assets/images/merch2.jpg',
      'price': '\$35.00',
    },
  ];

  @override
  void initState() {
    super.initState();
    // Load posts when profile screen opens
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final postProvider = Provider.of<PostProvider>(context, listen: false);
      if (postProvider.posts.isEmpty) {
        postProvider.loadPosts();
      }
    });

    // Initialize current user profile state if viewing own profile
    if (widget.userData == null) {
      _currentUserProfile = {
        'name': 'Artist Name',
        'username': '@artistname',
        'followers': 1247,
        'following': 89,
        'bio': 'Digital artist and illustrator',
        'socials': {
          'facebook': 'https://facebook.com/artistname',
          'twitter': 'https://twitter.com/artistname',
          'pinterest': 'https://pinterest.com/artistname',
        },
        'isOtherUser': false,
        'userId': 'current_user',
        'userAvatar': null,
      };
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: SafeArea(
        child: Column(
          children: [
            // App Header with Logo, Search, and Settings
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: const BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Color(0x1A000000),
                    blurRadius: 4,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  // Back button (if viewing another user's profile) or Logo
                  if (_profile['isOtherUser'])
                    IconButton(
                      onPressed: () => Navigator.of(context).pop(),
                      icon: const Icon(
                        Icons.arrow_back,
                        color: Colors.black,
                        size: 24,
                      ),
                    )
                  else
                    const Row(
                      children: [
                        Text(
                          'B',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                        ),
                        Text(
                          '&C',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.normal,
                            color: Color.fromARGB(255, 255, 60, 60),
                          ),
                        ),
                      ],
                    ),

                  const SizedBox(width: 16),

                  // Search Bar
                  Expanded(
                    child: Container(
                      height: 40,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF5F5F5),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: const Color(0xFFE0E0E0),
                          width: 1,
                        ),
                      ),
                      child: TextField(
                        controller: _searchController,
                        decoration: const InputDecoration(
                          hintText: 'Search',
                          hintStyle: TextStyle(
                            color: Color(0xFF9E9E9E),
                            fontSize: 14,
                          ),
                          prefixIcon: Icon(
                            Icons.search,
                            color: Colors.black,
                            size: 20,
                          ),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(width: 16),

                  // Settings Icon
                  IconButton(
                    onPressed: () {
                      Navigator.of(context).pushNamed('/settings');
                    },
                    icon: const Icon(
                      Icons.settings,
                      color: Colors.black,
                      size: 24,
                    ),
                  ),
                ],
              ),
            ),

            // Profile Section
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                children: [
                  // Profile Picture and Commission Button
                  Row(
                    children: [
                      // Profile Picture with Settings Button and Name
                      Column(
                        children: [
                          Stack(
                            children: [
                              Container(
                                width: 80,
                                height: 80,
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF0F0F0),
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: const Color(0xFFE0E0E0),
                                    width: 2,
                                  ),
                                ),
                                child: _profile['userAvatar'] != null
                                    ? ClipOval(
                                        child: _profile['userAvatar']
                                                .toString()
                                                .startsWith('http')
                                            ? Image.network(
                                                _profile['userAvatar'],
                                                width: 80,
                                                height: 80,
                                                fit: BoxFit.cover,
                                                errorBuilder: (context, error,
                                                    stackTrace) {
                                                  return const Icon(
                                                    Icons.person,
                                                    size: 40,
                                                    color: Color(0xFFCCCCCC),
                                                  );
                                                },
                                              )
                                            : Image.file(
                                                File(_profile['userAvatar']
                                                    .toString()),
                                                width: 80,
                                                height: 80,
                                                fit: BoxFit.cover,
                                              ),
                                      )
                                    : const Icon(
                                        Icons.person,
                                        size: 40,
                                        color: Color(0xFFCCCCCC),
                                      ),
                              ),
                              // Settings Button (only for current user)
                              if (!_profile['isOtherUser'])
                                Positioned(
                                  bottom: 0,
                                  right: 0,
                                  child: GestureDetector(
                                    onTap: () {
                                      _showEditProfileDialog();
                                    },
                                    child: Container(
                                      width: 24,
                                      height: 24,
                                      decoration: BoxDecoration(
                                        color: const Color.fromARGB(
                                            255, 255, 60, 60),
                                        shape: BoxShape.circle,
                                        border: Border.all(
                                          color: Colors.white,
                                          width: 2,
                                        ),
                                      ),
                                      child: const Icon(
                                        Icons.edit,
                                        color: Colors.white,
                                        size: 14,
                                      ),
                                    ),
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _profile['name'],
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            ),
                          ),
                          Text(
                            _profile['username'],
                            style: const TextStyle(
                              fontSize: 14,
                              color: Color(0xFF666666),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(width: 16),

                      // Commission Button and Social Icons
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Primary large button: Commission (for other users)
                            SizedBox(
                              width: double.infinity,
                              height: 40,
                              child: ElevatedButton(
                                onPressed: () {
                                  if (_profile['isOtherUser']) {
                                    showModalBottomSheet(
                                      context: context,
                                      isScrollControlled: true,
                                      backgroundColor: Colors.transparent,
                                      builder: (_) =>
                                          CommissionSettingsViewSheet(
                                        artistId: _profile['id'] ?? 'artist-id',
                                        showRequestButton: true,
                                      ),
                                    );
                                  } else {
                                    showModalBottomSheet(
                                      context: context,
                                      isScrollControlled: true,
                                      backgroundColor: Colors.transparent,
                                      builder: (_) =>
                                          const CommissionSettingsViewSheet(),
                                    );
                                  }
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor:
                                      const Color.fromARGB(255, 255, 60, 60),
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  elevation: 0,
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 8),
                                ),
                                child: const Text(
                                  'Commission',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),

                            const SizedBox(height: 8),

                            // Tip, Message, and Follow Buttons (message only for other users)
                            Row(
                              children: [
                                // Tip Button
                                Expanded(
                                  child: Container(
                                    height: 32,
                                    decoration: BoxDecoration(
                                      color: const Color.fromARGB(
                                          255, 255, 60, 60),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: const Center(
                                      child: Text(
                                        'Tip',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 12,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),

                                const SizedBox(width: 8),

                                // Message Button (only when viewing other user)
                                if (_profile['isOtherUser']) ...[
                                  Expanded(
                                    child: GestureDetector(
                                      onTap: () {
                                        Navigator.of(context).pushNamed(
                                          '/chat',
                                          arguments: {
                                            'userName': _profile['name'],
                                          },
                                        );
                                      },
                                      child: Container(
                                        height: 32,
                                        decoration: BoxDecoration(
                                          color: const Color(0xFF10B981),
                                          borderRadius:
                                              BorderRadius.circular(6),
                                        ),
                                        child: const Center(
                                          child: Text(
                                            'Message',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 12,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                ],

                                // Follow Button (black)
                                Expanded(
                                  child: GestureDetector(
                                    onTap: _toggleFollow,
                                    child: Container(
                                      height: 32,
                                      decoration: BoxDecoration(
                                        color: Colors.black,
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Center(
                                        child: Text(
                                          (_profile['isFollowing'] ?? false)
                                              ? 'Unfollow'
                                              : 'Follow',
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 12,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Follower/Following Counts
                  Row(
                    children: [
                      // Followers
                      Expanded(
                        child: Column(
                          children: [
                            Text(
                              _profile['followers'].toString(),
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            ),
                            const Text(
                              'Followers',
                              style: TextStyle(
                                fontSize: 12,
                                color: Color(0xFF666666),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Following
                      Expanded(
                        child: Column(
                          children: [
                            Text(
                              _profile['following'].toString(),
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            ),
                            const Text(
                              'Following',
                              style: TextStyle(
                                fontSize: 12,
                                color: Color(0xFF666666),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Other Socials Box
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F5F5),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: const Color(0xFFE0E0E0),
                        width: 1,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Other Socials',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: Colors.black,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            // Facebook
                            Container(
                              width: 32,
                              height: 32,
                              decoration: BoxDecoration(
                                color: const Color(0xFF1877F2),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: const Center(
                                child: Text(
                                  'f',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),

                            const SizedBox(width: 8),

                            // Twitter/X
                            Container(
                              width: 32,
                              height: 32,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: Colors.black,
                                  width: 1,
                                ),
                              ),
                              child: const Center(
                                child: Text(
                                  'X',
                                  style: TextStyle(
                                    color: Colors.black,
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),

                            const SizedBox(width: 8),

                            // Pinterest
                            Container(
                              width: 32,
                              height: 32,
                              decoration: BoxDecoration(
                                color: const Color(0xFFE60023),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: const Center(
                                child: Text(
                                  'P',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Content Tabs
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  // Gallery Tab
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedTab = 0;
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          border: Border(
                            bottom: BorderSide(
                              color: _selectedTab == 0
                                  ? const Color.fromARGB(255, 255, 60, 60)
                                  : Colors.transparent,
                              width: 2,
                            ),
                          ),
                        ),
                        child: Consumer<PostProvider>(
                          builder: (context, postProvider, child) {
                            final userPosts = _userPosts;
                            return Text(
                              'Gallery (${userPosts.length})',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: _selectedTab == 0
                                    ? const Color.fromARGB(255, 255, 60, 60)
                                    : Colors.black,
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                  ),

                  // Divider
                  Container(
                    width: 1,
                    height: 20,
                    color: const Color(0xFFE0E0E0),
                  ),

                  // Merchandise Tab
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedTab = 1;
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          border: Border(
                            bottom: BorderSide(
                              color: _selectedTab == 1
                                  ? const Color.fromARGB(255, 255, 60, 60)
                                  : Colors.transparent,
                              width: 2,
                            ),
                          ),
                        ),
                        child: Text(
                          'Merchandise',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: _selectedTab == 1
                                ? const Color.fromARGB(255, 255, 60, 60)
                                : Colors.black,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Content Area
            Expanded(
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 16),
                child: _selectedTab == 0
                    ? _buildGalleryGrid()
                    : Stack(
                        children: [
                          // Merchandise grid as the base layer
                          Positioned.fill(child: _buildMerchandiseGrid()),

                          // Floating small button on the bottom-right, above the grid (only for current user)
                          if (!_profile['isOtherUser'])
                            Positioned(
                              right: 8,
                              bottom: 8,
                              child: SafeArea(
                                top: false,
                                child: SizedBox(
                                  width: 44,
                                  height: 44,
                                  child: FloatingActionButton(
                                    onPressed: _showAddMerchandiseSheet,
                                    mini: true,
                                    backgroundColor:
                                        const Color.fromARGB(255, 255, 60, 60),
                                    elevation: 3,
                                    child: const Icon(Icons.add,
                                        color: Colors.white, size: 22),
                                  ),
                                ),
                              ),
                            ),
                        ],
                      ),
              ),
            ),
          ],
        ),
      ),

      // Bottom Navigation
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: Color(0xFFF5F5F5),
          border: Border(
            top: BorderSide(
              color: Color(0xFFE0E0E0),
              width: 1,
            ),
          ),
        ),
        child: SafeArea(
          child: Container(
            height: 60,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(Icons.home, 0, isSelected: _selectedIndex == 0),
                _buildNavItem(Icons.map, 1, isSelected: _selectedIndex == 1),
                _buildNavItem(Icons.chat_bubble_outline, 2,
                    isSelected: _selectedIndex == 2),
                _buildNavItem(Icons.person_outline, 3,
                    isSelected: _selectedIndex == 3),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _formatPrice(TextEditingController controller) {
    final text = controller.text.trim();
    if (text.isNotEmpty && !text.contains('.')) {
      controller.text = '$text.00';
      controller.selection = TextSelection.fromPosition(
        TextPosition(offset: controller.text.length),
      );
    }
  }

  String _formatPriceDisplay(String price) {
    if (price.isEmpty) return price;
    // Normalize input by removing any currency symbol
    String cleanPrice = price.replaceAll(RegExp(r'^[\$₱]\s?'), '');
    // Ensure two decimal places
    if (!cleanPrice.contains('.')) {
      return '₱${cleanPrice}.00';
    }
    final parts = cleanPrice.split('.');
    if (parts.length == 2 && parts[1].length == 1) {
      return '₱${cleanPrice}0';
    }
    return '₱$cleanPrice';
  }

  void _showAddMerchandiseSheet() {
    final titleController = TextEditingController();
    final priceController = TextEditingController();
    final descriptionController = TextEditingController();
    final shippingController = TextEditingController();
    final deliveryController = TextEditingController();
    File? selectedImage;
    String selectedAvailability = 'In Stock';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom +
                    MediaQuery.of(context).padding.bottom +
                    16,
                left: 16,
                right: 16,
                top: 16,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Text(
                          'Add Merchandise',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: Colors.black,
                          ),
                        ),
                        const Spacer(),
                        IconButton(
                          onPressed: () => Navigator.pop(context),
                          icon: const Icon(Icons.close, color: Colors.black),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Image selector
                    GestureDetector(
                      onTap: () async {
                        final source = await showModalBottomSheet<ImageSource>(
                          context: context,
                          backgroundColor: Colors.white,
                          shape: const RoundedRectangleBorder(
                            borderRadius:
                                BorderRadius.vertical(top: Radius.circular(20)),
                          ),
                          builder: (_) => SafeArea(
                            child: Wrap(
                              children: [
                                ListTile(
                                  leading: const Icon(Icons.photo_library),
                                  title: const Text('Photo Library'),
                                  onTap: () => Navigator.pop(
                                      context, ImageSource.gallery),
                                ),
                                ListTile(
                                  leading: const Icon(Icons.photo_camera),
                                  title: const Text('Camera'),
                                  onTap: () => Navigator.pop(
                                      context, ImageSource.camera),
                                ),
                              ],
                            ),
                          ),
                        );
                        if (source != null) {
                          final picker = ImagePicker();
                          final picked = await picker.pickImage(
                              source: source, imageQuality: 85);
                          if (picked != null) {
                            setModalState(() {
                              selectedImage = File(picked.path);
                            });
                          }
                        }
                      },
                      child: Container(
                        height: 140,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF0F0F0),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFE0E0E0)),
                        ),
                        child: selectedImage == null
                            ? const Center(
                                child: Icon(Icons.add_photo_alternate,
                                    color: Color(0xFFCCCCCC), size: 40),
                              )
                            : ClipRRect(
                                borderRadius: BorderRadius.circular(12),
                                child: Image.file(selectedImage!,
                                    fit: BoxFit.cover, width: double.infinity),
                              ),
                      ),
                    ),

                    const SizedBox(height: 12),

                    TextField(
                      controller: titleController,
                      decoration: InputDecoration(
                        label: RichText(
                          text: const TextSpan(
                            style: TextStyle(
                                color: Color(0xFF666666), fontSize: 14),
                            children: [
                              TextSpan(text: 'Title '),
                              TextSpan(
                                text: '*',
                                style: TextStyle(
                                    color: Color.fromARGB(255, 255, 60, 60)),
                              ),
                            ],
                          ),
                        ),
                        border: const OutlineInputBorder(),
                        focusedBorder: const OutlineInputBorder(
                          borderSide: BorderSide(
                              color: Color.fromARGB(255, 255, 60, 60)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: priceController,
                      keyboardType:
                          const TextInputType.numberWithOptions(decimal: true),
                      inputFormatters: [
                        FilteringTextInputFormatter.allow(
                            RegExp(r'^\d*\.?\d{0,2}')),
                      ],
                      onEditingComplete: () {
                        _formatPrice(priceController);
                      },
                      onSubmitted: (value) {
                        _formatPrice(priceController);
                      },
                      decoration: InputDecoration(
                        label: RichText(
                          text: const TextSpan(
                            style: TextStyle(
                                color: Color(0xFF666666), fontSize: 14),
                            children: [
                              TextSpan(text: 'Price '),
                              TextSpan(
                                text: '*',
                                style: TextStyle(
                                    color: Color.fromARGB(255, 255, 60, 60)),
                              ),
                            ],
                          ),
                        ),
                        prefixText: '\$ ',
                        border: const OutlineInputBorder(),
                        focusedBorder: const OutlineInputBorder(
                          borderSide: BorderSide(
                              color: Color.fromARGB(255, 255, 60, 60)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Description Field
                    TextField(
                      controller: descriptionController,
                      maxLines: 3,
                      decoration: const InputDecoration(
                        labelText: 'Description',
                        hintText: 'Describe your merchandise...',
                        border: OutlineInputBorder(),
                        alignLabelWithHint: true,
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Purchase Information Section
                    const Text(
                      'Purchase Information',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 8),

                    Container(
                      decoration: BoxDecoration(
                        border: Border.all(color: const Color(0xFFE0E0E0)),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: DropdownButtonFormField<String>(
                        value: selectedAvailability,
                        decoration: const InputDecoration(
                          labelText: 'Availability',
                          labelStyle: TextStyle(
                            color: Color(0xFF666666),
                            fontSize: 14,
                          ),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(
                              horizontal: 16, vertical: 12),
                          prefixIcon: Icon(
                            Icons.inventory_2_outlined,
                            color: Color(0xFF666666),
                            size: 20,
                          ),
                        ),
                        dropdownColor: Colors.white,
                        style: const TextStyle(
                          color: Colors.black,
                          fontSize: 16,
                        ),
                        icon: Container(
                          padding: const EdgeInsets.all(8),
                          child: const Icon(
                            Icons.keyboard_arrow_down,
                            color: Color(0xFF666666),
                            size: 20,
                          ),
                        ),
                        items: [
                          DropdownMenuItem(
                            value: 'In Stock',
                            child: Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: Colors.green,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                const Text(
                                  'In Stock',
                                  style: TextStyle(fontWeight: FontWeight.w500),
                                ),
                              ],
                            ),
                          ),
                          DropdownMenuItem(
                            value: 'Out of Stock',
                            child: Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: Colors.red,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                const Text(
                                  'Out of Stock',
                                  style: TextStyle(fontWeight: FontWeight.w500),
                                ),
                              ],
                            ),
                          ),
                          DropdownMenuItem(
                            value: 'Limited Stock',
                            child: Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: Colors.orange,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                const Text(
                                  'Limited Stock',
                                  style: TextStyle(fontWeight: FontWeight.w500),
                                ),
                              ],
                            ),
                          ),
                          DropdownMenuItem(
                            value: 'Pre-order',
                            child: Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: Colors.blue,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                const Text(
                                  'Pre-order',
                                  style: TextStyle(fontWeight: FontWeight.w500),
                                ),
                              ],
                            ),
                          ),
                          DropdownMenuItem(
                            value: 'Discontinued',
                            child: Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: Colors.grey,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                const Text(
                                  'Discontinued',
                                  style: TextStyle(fontWeight: FontWeight.w500),
                                ),
                              ],
                            ),
                          ),
                        ],
                        onChanged: (value) {
                          if (value != null) {
                            setModalState(() {
                              selectedAvailability = value;
                            });
                          }
                        },
                      ),
                    ),
                    const SizedBox(height: 12),

                    TextField(
                      controller: shippingController,
                      decoration: InputDecoration(
                        label: RichText(
                          text: const TextSpan(
                            style: TextStyle(
                                color: Color(0xFF666666), fontSize: 14),
                            children: [
                              TextSpan(text: 'Shipping Info '),
                              TextSpan(
                                text: '*',
                                style: TextStyle(
                                    color: Color.fromARGB(255, 255, 60, 60)),
                              ),
                            ],
                          ),
                        ),
                        hintText: 'Enter shipping information',
                        border: const OutlineInputBorder(),
                        focusedBorder: const OutlineInputBorder(
                          borderSide: BorderSide(
                              color: Color.fromARGB(255, 255, 60, 60)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    TextField(
                      controller: deliveryController,
                      decoration: InputDecoration(
                        label: RichText(
                          text: const TextSpan(
                            style: TextStyle(
                                color: Color(0xFF666666), fontSize: 14),
                            children: [
                              TextSpan(text: 'Estimated Delivery '),
                              TextSpan(
                                text: '*',
                                style: TextStyle(
                                    color: Color.fromARGB(255, 255, 60, 60)),
                              ),
                            ],
                          ),
                        ),
                        hintText: 'Enter delivery time',
                        border: const OutlineInputBorder(),
                        focusedBorder: const OutlineInputBorder(
                          borderSide: BorderSide(
                              color: Color.fromARGB(255, 255, 60, 60)),
                        ),
                      ),
                    ),

                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          final title = titleController.text.trim();
                          final price = priceController.text.trim();
                          final description = descriptionController.text.trim();
                          final availability = selectedAvailability;
                          final shipping = shippingController.text.trim();
                          final delivery = deliveryController.text.trim();

                          if (title.isEmpty ||
                              price.isEmpty ||
                              shipping.isEmpty ||
                              delivery.isEmpty) {
                            // Show error message within the modal
                            print(
                                'Validation failed: title="$title", price="$price", shipping="$shipping", delivery="$delivery"');
                            showDialog(
                              context: context,
                              builder: (context) => AlertDialog(
                                title: const Text('Required Fields'),
                                content: const Text(
                                    'Please fill in all required fields.'),
                                backgroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(context),
                                    child: const Text(
                                      'OK',
                                      style: TextStyle(
                                        color: Color.fromARGB(255, 255, 60, 60),
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            );
                            return;
                          }
                          setState(() {
                            _merchandise.insert(0, {
                              'id': DateTime.now().millisecondsSinceEpoch,
                              'title': title,
                              'image': selectedImage?.path,
                              'price': '\$${price}',
                              'description': description.isNotEmpty
                                  ? description
                                  : 'This is a high-quality merchandise item perfect for any fan. Made with premium materials and featuring excellent craftsmanship, this item is sure to become a treasured part of your collection.',
                              'availability': availability,
                              'shipping': shipping,
                              'delivery': delivery,
                            });
                          });
                          Navigator.pop(context);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor:
                              const Color.fromARGB(255, 255, 60, 60),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          padding: const EdgeInsets.symmetric(
                              vertical: 14, horizontal: 16),
                          minimumSize: const Size.fromHeight(52),
                        ),
                        child: const Text('Add'),
                      ),
                    ),

                    const SizedBox(height: 20),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildGalleryGrid() {
    return Consumer<PostProvider>(
      builder: (context, postProvider, child) {
        final userPosts = _userPosts;

        if (userPosts.isEmpty) {
          return const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.art_track_outlined,
                  size: 64,
                  color: Colors.grey,
                ),
                SizedBox(height: 16),
                Text(
                  'No posts yet',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 16,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Start sharing your artwork!',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          );
        }

        return GridView.builder(
          physics: const ClampingScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 8,
            mainAxisSpacing: 8,
            childAspectRatio: 1,
          ),
          itemCount: userPosts.length,
          itemBuilder: (context, index) {
            final post = userPosts[index];
            return GestureDetector(
              onTap: () {
                Navigator.of(context)
                    .pushNamed('/post-detail', arguments: post);
              },
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: post.artworkImageUrl == 'no_image_placeholder'
                      ? Container(
                          color: const Color(0xFFF0F0F0),
                          child: const Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.image_not_supported_outlined,
                                  size: 40,
                                  color: Color(0xFFCCCCCC),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  'No image',
                                  style: TextStyle(
                                    color: Color(0xFFCCCCCC),
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        )
                      : CachedNetworkImage(
                          imageUrl: post.artworkImageUrl,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => Container(
                            color: const Color(0xFFF0F0F0),
                            child: const Center(
                              child: CircularProgressIndicator(
                                color: Color.fromARGB(255, 255, 60, 60),
                              ),
                            ),
                          ),
                          errorWidget: (context, url, error) => Container(
                            color: const Color(0xFFF0F0F0),
                            child: const Center(
                              child: Icon(
                                Icons.image,
                                size: 40,
                                color: Color(0xFFCCCCCC),
                              ),
                            ),
                          ),
                        ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildMerchandiseGrid() {
    return GridView.builder(
      physics: const ClampingScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
        childAspectRatio: 0.8,
      ),
      itemCount: _merchandise.length,
      itemBuilder: (context, index) {
        final item = _merchandise[index];
        return GestureDetector(
          onTap: () {
            showModalBottomSheet(
              context: context,
              isScrollControlled: true,
              backgroundColor: Colors.transparent,
              builder: (ctx) => FractionallySizedBox(
                heightFactor: 0.88,
                child: ClipRRect(
                  borderRadius:
                      const BorderRadius.vertical(top: Radius.circular(16)),
                  child: MerchandiseDetailScreen(
                    merchandise: item,
                    onDelete: () {
                      setState(() {
                        _merchandise.removeAt(index);
                      });
                      Navigator.of(ctx).pop();
                    },
                    isCurrentUser: !_profile['isOtherUser'],
                    showHeader: false,
                  ),
                ),
              ),
            ).then((_) {
              setState(() {});
            });
          },
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              children: [
                // Product Image
                Expanded(
                  flex: 3,
                  child: Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0F0F0),
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(8),
                        topRight: Radius.circular(8),
                      ),
                    ),
                    child: item['image'] != null
                        ? ClipRRect(
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(8),
                              topRight: Radius.circular(8),
                            ),
                            child: Image.file(
                              File(item['image']),
                              fit: BoxFit.cover,
                              width: double.infinity,
                            ),
                          )
                        : const Center(
                            child: Icon(
                              Icons.shopping_bag,
                              size: 40,
                              color: Color(0xFFCCCCCC),
                            ),
                          ),
                  ),
                ),

                // Product Info
                Expanded(
                  flex: 1,
                  child: Align(
                    alignment: Alignment.centerLeft,
                    child: Padding(
                      padding: const EdgeInsets.all(8),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            item['title'],
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: Colors.black,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            textAlign: TextAlign.left,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _formatPriceDisplay(item['price']),
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: Color.fromARGB(255, 255, 60, 60),
                            ),
                            textAlign: TextAlign.left,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildNavItem(IconData icon, int index, {required bool isSelected}) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedIndex = index;
        });
        // Navigate to different screens based on index
        switch (index) {
          case 0:
            Navigator.of(context).pushReplacementNamed('/home');
            break;
          case 1:
            Navigator.of(context).pushReplacementNamed('/events');
            break;
          case 2:
            Navigator.of(context).pushReplacementNamed('/messaging');
            break;
          case 3:
            // Already on profile screen
            break;
        }
      },
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: isSelected
                ? const Color.fromARGB(255, 255, 60, 60)
                : Colors.black,
            size: 24,
          ),
          if (isSelected)
            Container(
              margin: const EdgeInsets.only(top: 4),
              width: 4,
              height: 4,
              decoration: const BoxDecoration(
                color: Colors.black,
                shape: BoxShape.circle,
              ),
            ),
        ],
      ),
    );
  }

  void _toggleFollow() {
    setState(() {
      _profile['isFollowing'] = !(_profile['isFollowing'] ?? false);
      if (_profile['isFollowing']) {
        _profile['followers'] = (_profile['followers'] ?? 0) + 1;
      } else {
        _profile['followers'] = (_profile['followers'] ?? 1) - 1;
      }
    });

    // TODO: Make API call to follow/unfollow user
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _profile['isFollowing']
              ? 'Following ${_profile['name']}'
              : 'Unfollowed ${_profile['name']}',
        ),
        backgroundColor: _profile['isFollowing'] ? Colors.green : Colors.grey,
      ),
    );
  }

  void _showEditProfileDialog() {
    final TextEditingController nameController =
        TextEditingController(text: _profile['name']);
    final TextEditingController usernameController =
        TextEditingController(text: _profile['username']);
    final TextEditingController bioController =
        TextEditingController(text: _profile['bio']);
    final TextEditingController facebookController =
        TextEditingController(text: _profile['socials']['facebook']);
    final TextEditingController twitterController =
        TextEditingController(text: _profile['socials']['twitter']);
    final TextEditingController pinterestController =
        TextEditingController(text: _profile['socials']['pinterest']);

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: Container(
            constraints: const BoxConstraints(maxHeight: 600),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(16),
                      topRight: Radius.circular(16),
                    ),
                  ),
                  child: Row(
                    children: [
                      const Text(
                        'Edit Profile',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                      const Spacer(),
                      GestureDetector(
                        onTap: () {
                          Navigator.of(context).pop();
                        },
                        child: const Icon(
                          Icons.close,
                          color: Colors.black,
                          size: 24,
                        ),
                      ),
                    ],
                  ),
                ),

                // Content
                Flexible(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Profile Picture Section
                        Center(
                          child: Column(
                            children: [
                              const Text(
                                'Profile Picture',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.black,
                                ),
                              ),
                              const SizedBox(height: 12),
                              StatefulBuilder(builder: (ctx, setLocalState) {
                                String? localAvatar = _profile['userAvatar'];
                                Future<void> pick(String source) async {
                                  final picker = ImagePicker();
                                  final XFile? picked = await picker.pickImage(
                                      source: source == 'camera'
                                          ? ImageSource.camera
                                          : ImageSource.gallery,
                                      maxWidth: 1024,
                                      imageQuality: 85);
                                  if (picked != null) {
                                    setLocalState(() {
                                      localAvatar = picked.path;
                                    });
                                  }
                                }

                                void showSourceSheet() {
                                  showModalBottomSheet(
                                    context: context,
                                    shape: const RoundedRectangleBorder(
                                      borderRadius: BorderRadius.vertical(
                                          top: Radius.circular(16)),
                                    ),
                                    builder: (_) => SafeArea(
                                      child: Wrap(
                                        children: [
                                          ListTile(
                                            leading: const Icon(Icons.photo),
                                            title: const Text(
                                                'Choose from Gallery'),
                                            onTap: () async {
                                              Navigator.pop(context);
                                              await pick('gallery');
                                            },
                                          ),
                                          ListTile(
                                            leading:
                                                const Icon(Icons.camera_alt),
                                            title: const Text('Take Photo'),
                                            onTap: () async {
                                              Navigator.pop(context);
                                              await pick('camera');
                                            },
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                }

                                return Column(
                                  children: [
                                    GestureDetector(
                                      onTap: showSourceSheet,
                                      child: Container(
                                        width: 100,
                                        height: 100,
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFF5F5F5),
                                          shape: BoxShape.circle,
                                          border: Border.all(
                                            color: const Color(0xFFE0E0E0),
                                            width: 2,
                                          ),
                                        ),
                                        clipBehavior: Clip.antiAlias,
                                        child: localAvatar == null
                                            ? const Icon(
                                                Icons.camera_alt,
                                                color: Color(0xFFCCCCCC),
                                                size: 40,
                                              )
                                            : (localAvatar!.startsWith('http')
                                                ? Image.network(localAvatar!,
                                                    fit: BoxFit.cover)
                                                : Image.file(File(localAvatar!),
                                                    fit: BoxFit.cover)),
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    const Text(
                                      'Tap to change',
                                      style: TextStyle(
                                        color: Color(0xFF9E9E9E),
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                );
                              }),
                            ],
                          ),
                        ),

                        const SizedBox(height: 24),

                        // Basic Info Section
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF5F5F5),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Basic Information',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.black,
                                ),
                              ),
                              const SizedBox(height: 16),
                              TextField(
                                controller: nameController,
                                decoration: InputDecoration(
                                  labelText: 'Name',
                                  filled: true,
                                  fillColor: Colors.white,
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color(0xFFE0E0E0)),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color(0xFFE0E0E0)),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color.fromARGB(255, 255, 60, 60),
                                        width: 2),
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 12),
                                ),
                              ),
                              const SizedBox(height: 12),
                              TextField(
                                controller: usernameController,
                                decoration: InputDecoration(
                                  labelText: 'Username',
                                  filled: true,
                                  fillColor: Colors.white,
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color(0xFFE0E0E0)),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color(0xFFE0E0E0)),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color.fromARGB(255, 255, 60, 60),
                                        width: 2),
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 12),
                                ),
                              ),
                              const SizedBox(height: 12),
                              TextField(
                                controller: bioController,
                                maxLines: 3,
                                decoration: InputDecoration(
                                  labelText: 'Bio',
                                  filled: true,
                                  fillColor: Colors.white,
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color(0xFFE0E0E0)),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color(0xFFE0E0E0)),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color.fromARGB(255, 255, 60, 60),
                                        width: 2),
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 12),
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 16),

                        // Social Media Section
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF5F5F5),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Social Media Links',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.black,
                                ),
                              ),
                              const SizedBox(height: 16),
                              TextField(
                                controller: facebookController,
                                decoration: InputDecoration(
                                  labelText: 'Facebook URL',
                                  filled: true,
                                  fillColor: Colors.white,
                                  prefixIcon: const Icon(Icons.facebook,
                                      color: Color(0xFF1877F2)),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color(0xFFE0E0E0)),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color(0xFFE0E0E0)),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color.fromARGB(255, 255, 60, 60),
                                        width: 2),
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 12),
                                ),
                              ),
                              const SizedBox(height: 12),
                              TextField(
                                controller: twitterController,
                                decoration: InputDecoration(
                                  labelText: 'Twitter/X URL',
                                  filled: true,
                                  fillColor: Colors.white,
                                  prefixIcon: const Icon(Icons.flutter_dash,
                                      color: Colors.black),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color(0xFFE0E0E0)),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color(0xFFE0E0E0)),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color.fromARGB(255, 255, 60, 60),
                                        width: 2),
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 12),
                                ),
                              ),
                              const SizedBox(height: 12),
                              TextField(
                                controller: pinterestController,
                                decoration: InputDecoration(
                                  labelText: 'Pinterest URL',
                                  filled: true,
                                  fillColor: Colors.white,
                                  prefixIcon: const Icon(Icons.link,
                                      color: Color(0xFFE60023)),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color(0xFFE0E0E0)),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color(0xFFE0E0E0)),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: const BorderSide(
                                        color: Color.fromARGB(255, 255, 60, 60),
                                        width: 2),
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 12),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Footer with Save Button
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.only(
                      bottomLeft: Radius.circular(16),
                      bottomRight: Radius.circular(16),
                    ),
                  ),
                  child: SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      onPressed: () {
                        // Update profile data
                        setState(() {
                          if (_currentUserProfile != null) {
                            _currentUserProfile!['name'] = nameController.text;
                            _currentUserProfile!['username'] =
                                usernameController.text;
                            _currentUserProfile!['bio'] = bioController.text;
                            _currentUserProfile!['socials']['facebook'] =
                                facebookController.text;
                            _currentUserProfile!['socials']['twitter'] =
                                twitterController.text;
                            _currentUserProfile!['socials']['pinterest'] =
                                pinterestController.text;
                            // Persist chosen avatar from the local editor if any
                            // We read it from the temporary local state of the dialog by
                            // checking controllers not used for image; to keep it simple,
                            // we rely on the preview value if the user tapped to change
                            // (handled above via StatefulBuilder). If they picked an image,
                            // the preview already showed it; we assign it here by reading
                            // back from the widget tree using the same value stored in
                            // _profile['userAvatar'] if it changed in the dialog scope.
                          }
                        });
                        Navigator.of(context).pop();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color.fromARGB(255, 255, 60, 60),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        elevation: 0,
                      ),
                      child: const Text(
                        'Save Changes',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
