import 'package:flutter/material.dart';

class PostDetailScreen extends StatefulWidget {
  final Map<String, dynamic> post;

  const PostDetailScreen({
    super.key,
    required this.post,
  });

  @override
  State<PostDetailScreen> createState() => _PostDetailScreenState();
}

class _PostDetailScreenState extends State<PostDetailScreen> {
  final TextEditingController _searchController = TextEditingController();
  int _selectedIndex = 0;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Top Header with Logo, Search, and Settings
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

            // Second Header with Back, Share, and More Options
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  // Back Button
                  IconButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                    icon: const Icon(
                      Icons.arrow_back,
                      color: Colors.black,
                      size: 24,
                    ),
                  ),

                  const Spacer(),

                  // Share Button
                  IconButton(
                    onPressed: () {
                      // TODO: Implement share functionality
                    },
                    icon: const Icon(
                      Icons.share,
                      color: Colors.black,
                      size: 24,
                    ),
                  ),

                  const SizedBox(width: 8),

                  // More Options
                  IconButton(
                    onPressed: () {
                      // TODO: Show more options
                    },
                    icon: const Icon(
                      Icons.more_vert,
                      color: Colors.black,
                      size: 24,
                    ),
                  ),
                ],
              ),
            ),

            // Post Content
            Expanded(
              child: SingleChildScrollView(
                physics: const ClampingScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Post Title
                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 8),
                      child: Text(
                        widget.post['artworkTitle'],
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                    ),

                    // Author Information
                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 8),
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

                          // User Name
                          Text(
                            widget.post['userName'],
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Colors.black,
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Artwork Image (Large)
                    Container(
                      width: double.infinity,
                      height: 400,
                      margin: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF0F0F0),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.1),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.image,
                          size: 80,
                          color: Color(0xFFCCCCCC),
                        ),
                      ),
                    ),

                    // Engagement Section
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Action Buttons
                          Row(
                            children: [
                              // Like Button
                              IconButton(
                                onPressed: () {
                                  // TODO: Implement like functionality
                                },
                                icon: const Icon(
                                  Icons.favorite_border,
                                  color: Colors.black,
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

                              const SizedBox(width: 8),

                              // Share Button
                              IconButton(
                                onPressed: () {
                                  // TODO: Implement share functionality
                                },
                                icon: const Icon(
                                  Icons.share,
                                  color: Colors.black,
                                  size: 24,
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 8),

                          // Likes and Comments Count
                          Text(
                            '${_formatLikes(widget.post['likes'])} Likes • ${widget.post['comments']} Comments',
                            style: const TextStyle(
                              fontSize: 14,
                              color: Colors.black,
                              fontWeight: FontWeight.w500,
                            ),
                          ),

                          const SizedBox(height: 16),

                          // Description Section
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8F8F8),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'About this artwork:',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.black,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'This is a beautiful piece of artwork that showcases incredible talent and creativity. The Mona Lisa is one of the most famous paintings in the world, known for its mysterious smile and masterful technique.',
                                  style: const TextStyle(
                                    fontSize: 14,
                                    color: Color(0xFF666666),
                                    height: 1.4,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
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

  String _formatLikes(int likes) {
    if (likes >= 1000000) {
      return '${(likes / 1000000).toStringAsFixed(1)}M';
    } else if (likes >= 1000) {
      return '${(likes / 1000).toStringAsFixed(1)}K';
    }
    return likes.toString();
  }

  Widget _buildNavItem(IconData icon, int index, {required bool isSelected}) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedIndex = index;
        });
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
}
