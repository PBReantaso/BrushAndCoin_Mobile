import 'package:flutter/material.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();
  int _selectedIndex = 0;

  // Mock data for posts
  final List<Map<String, dynamic>> _posts = [
    {
      'id': 1,
      'userName': 'Jim Jivitis',
      'userAvatar': 'assets/images/avatar1.jpg',
      'artworkTitle': 'The Mona Lisa',
      'artworkImage': 'assets/images/mona_lisa.jpg',
      'likes': 1523200,
      'comments': 19,
      'isLiked': false,
    },
    {
      'id': 2,
      'userName': 'Jim Jivitis',
      'userAvatar': 'assets/images/avatar1.jpg',
      'artworkTitle': 'The Mona Lisa',
      'artworkImage': 'assets/images/mona_lisa.jpg',
      'likes': 1523200,
      'comments': 19,
      'isLiked': false,
    },
  ];

  void _toggleLike(int postId) {
    setState(() {
      final postIndex = _posts.indexWhere((post) => post['id'] == postId);
      if (postIndex != -1) {
        _posts[postIndex]['isLiked'] = !_posts[postIndex]['isLiked'];
        if (_posts[postIndex]['isLiked']) {
          _posts[postIndex]['likes']++;
        } else {
          _posts[postIndex]['likes']--;
        }
      }
    });
  }

  String _formatLikes(int likes) {
    if (likes >= 1000000) {
      return '${(likes / 1000000).toStringAsFixed(1)}M';
    } else if (likes >= 1000) {
      return '${(likes / 1000).toStringAsFixed(1)}K';
    }
    return likes.toString();
  }

  void _showPostCreationDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Create Post'),
          content: const Text('Post creation feature coming soon!'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // App Bar with Logo, Search, and Settings
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  // Logo
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
                      // TODO: Navigate to settings
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

            // Post Creation Section
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: const Color(0xFFE0E0E0),
                  width: 1,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 5,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  // User Avatar
                  Container(
                    width: 40,
                    height: 40,
                    decoration: const BoxDecoration(
                      color: Color(0xFF666666),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.person,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),

                  const SizedBox(width: 12),

                  // Post Input Field
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        _showPostCreationDialog();
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF5F5F5),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: const Color(0xFFE0E0E0),
                            width: 1,
                          ),
                        ),
                        child: const Text(
                          "What's on your mind?",
                          style: TextStyle(
                            color: Color(0xFF9E9E9E),
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(width: 12),

                  // Post Button
                  GestureDetector(
                    onTap: () {
                      _showPostCreationDialog();
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: const Color.fromARGB(255, 255, 60, 60),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Text(
                        'Post',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Posts Feed
            Expanded(
              child: ListView.builder(
                physics: const ClampingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _posts.length,
                itemBuilder: (context, index) {
                  final post = _posts[index];
                  return _buildPostCard(post);
                },
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

  Widget _buildPostCard(Map<String, dynamic> post) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).pushNamed('/post-detail', arguments: post);
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Post Header
            Padding(
              padding: const EdgeInsets.all(12),
              child: Row(
                children: [
                  // User Avatar
                  Container(
                    width: 40,
                    height: 40,
                    decoration: const BoxDecoration(
                      color: Color(0xFF666666),
                      shape: BoxShape.circle,
                    ),
                  ),

                  const SizedBox(width: 12),

                  // User Name
                  Expanded(
                    child: Text(
                      post['userName'],
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                  ),

                  // More Options
                  IconButton(
                    onPressed: () {
                      // TODO: Show post options
                    },
                    icon: const Icon(
                      Icons.more_vert,
                      color: Colors.black,
                      size: 20,
                    ),
                  ),
                ],
              ),
            ),

            // Artwork Image
            Container(
              width: double.infinity,
              height: 300,
              decoration: BoxDecoration(
                color: const Color(0xFFF0F0F0),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Center(
                child: Icon(
                  Icons.image,
                  size: 60,
                  color: Color(0xFFCCCCCC),
                ),
              ),
            ),

            // Engagement Section
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Action Buttons
                  Row(
                    children: [
                      // Like Button
                      IconButton(
                        onPressed: () => _toggleLike(post['id']),
                        icon: Icon(
                          post['isLiked']
                              ? Icons.favorite
                              : Icons.favorite_border,
                          color: post['isLiked']
                              ? const Color.fromARGB(255, 255, 60, 60)
                              : Colors.black,
                          size: 24,
                        ),
                      ),

                      const SizedBox(width: 8),

                      // Comment Button
                      IconButton(
                        onPressed: () {
                          // TODO: Navigate to comments
                        },
                        icon: const Icon(
                          Icons.chat_bubble_outline,
                          color: Colors.black,
                          size: 24,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 8),

                  // Artwork Title
                  Text(
                    post['artworkTitle'],
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.black,
                    ),
                  ),

                  const SizedBox(height: 4),

                  // Likes and Comments Count
                  Text(
                    '${_formatLikes(post['likes'])} Likes • ${post['comments']} Comments',
                    style: const TextStyle(
                      fontSize: 14,
                      color: Colors.black,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
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
            // Already on home screen
            break;
          case 1:
            Navigator.of(context).pushReplacementNamed('/events');
            break;
          case 2:
            // TODO: Navigate to messages
            break;
          case 3:
            Navigator.of(context).pushReplacementNamed('/profile');
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

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}
