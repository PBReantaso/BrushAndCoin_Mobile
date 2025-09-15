import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/providers/post_provider.dart';
import '../../../core/models/post_model.dart';
import '../../post/screens/create_post_screen.dart';
import '../../../core/providers/auth_provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadPosts();
    });
  }

  Future<void> _loadPosts() async {
    final postProvider = Provider.of<PostProvider>(context, listen: false);
    // Only load posts if the list is empty (first time)
    if (postProvider.posts.isEmpty) {
      await postProvider.loadPosts();
    }
    // Refresh comment counts to ensure they're accurate
    postProvider.refreshCommentCounts();
    _updateFilteredPosts();
  }

  void _updateFilteredPosts() {
    // No longer needed since we're using PostProvider directly in Consumer
    setState(() {});
  }

  void _onSearchChanged(String query) {
    _updateFilteredPosts();
  }

  void _navigateToCreatePost() {
    Navigator.of(context)
        .push(
      MaterialPageRoute(
        builder: (context) => const CreatePostScreen(),
      ),
    )
        .then((_) {
      // Refresh posts after creating a new one
      _updateFilteredPosts();
    });
  }

  void _navigateToUserProfile(Post post) {
    final postProvider = Provider.of<PostProvider>(context, listen: false);

    // Get complete user profile data
    final userData = postProvider.getUserProfileData(
      post.userId,
      post.userName,
      post.userAvatar,
    );

    // Navigate to user profile with complete user information
    Navigator.of(context).pushNamed('/profile', arguments: userData);
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final bool isArtist = (authProvider.currentUser?.userType == 'artist');
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
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
                        onChanged: _onSearchChanged,
                        decoration: const InputDecoration(
                          hintText: 'Search artworks...',
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

            // Post Creation Section (artists only)
            if (isArtist)
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
                        onTap: _navigateToCreatePost,
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
                            "Share your artwork...",
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
                      onTap: _navigateToCreatePost,
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
              child: Consumer<PostProvider>(
                builder: (context, postProvider, child) {
                  // Get the current filtered posts based on search
                  final currentFilteredPosts = _searchController.text.isEmpty
                      ? postProvider.posts
                      : postProvider.searchPosts(_searchController.text);

                  if (postProvider.isLoading && currentFilteredPosts.isEmpty) {
                    return const Center(
                      child: CircularProgressIndicator(
                        color: Color.fromARGB(255, 255, 60, 60),
                      ),
                    );
                  }

                  if (postProvider.error != null &&
                      currentFilteredPosts.isEmpty) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.error_outline,
                            size: 64,
                            color: Colors.grey,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            postProvider.error!,
                            style: const TextStyle(
                              color: Colors.grey,
                              fontSize: 16,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: _loadPosts,
                            style: ElevatedButton.styleFrom(
                              backgroundColor:
                                  const Color.fromARGB(255, 255, 60, 60),
                              foregroundColor: Colors.white,
                            ),
                            child: const Text('Retry'),
                          ),
                        ],
                      ),
                    );
                  }

                  if (currentFilteredPosts.isEmpty) {
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
                            'No artworks found',
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 16,
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Be the first to share your artwork!',
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    );
                  }

                  return RefreshIndicator(
                    onRefresh: () async {
                      // Just refresh the filtered posts, don't reload mock data
                      _updateFilteredPosts();
                    },
                    color: const Color.fromARGB(255, 255, 60, 60),
                    child: ListView.builder(
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: currentFilteredPosts.length,
                      itemBuilder: (context, index) {
                        final post = currentFilteredPosts[index];
                        return _buildPostCard(post);
                      },
                    ),
                  );
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

  Widget _buildPostCard(Post post) {
    final postProvider = Provider.of<PostProvider>(context, listen: false);

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
                  // User Avatar (Clickable)
                  GestureDetector(
                    onTap: () => _navigateToUserProfile(post),
                    child: CircleAvatar(
                      radius: 20,
                      backgroundColor: const Color(0xFF666666),
                      backgroundImage: post.userAvatar != null
                          ? CachedNetworkImageProvider(post.userAvatar!)
                          : null,
                      child: post.userAvatar == null
                          ? const Icon(
                              Icons.person,
                              color: Colors.white,
                              size: 20,
                            )
                          : null,
                    ),
                  ),

                  const SizedBox(width: 12),

                  // User Name and Time (Clickable)
                  Expanded(
                    child: GestureDetector(
                      onTap: () => _navigateToUserProfile(post),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            post.userName,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Colors.black,
                            ),
                          ),
                          Text(
                            postProvider.formatTimeAgo(post.createdAt),
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF9E9E9E),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // More Options
                  Row(
                    children: [
                      // Current user indicator
                      if (post.userId == 'current_user')
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color.fromARGB(255, 255, 60, 60)
                                .withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Text(
                            'Your Post',
                            style: TextStyle(
                              fontSize: 10,
                              color: Color.fromARGB(255, 255, 60, 60),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      if (post.userId == 'current_user')
                        const SizedBox(width: 8),
                      IconButton(
                        onPressed: () {
                          _showPostOptions(post);
                        },
                        icon: const Icon(
                          Icons.more_vert,
                          color: Colors.black,
                          size: 20,
                        ),
                      ),
                    ],
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
                                size: 60,
                                color: Color(0xFFCCCCCC),
                              ),
                              SizedBox(height: 8),
                              Text(
                                'No image',
                                style: TextStyle(
                                  color: Color(0xFFCCCCCC),
                                  fontSize: 14,
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
                        placeholder: (context, url) => const Center(
                          child: CircularProgressIndicator(
                            color: Color.fromARGB(255, 255, 60, 60),
                          ),
                        ),
                        errorWidget: (context, url, error) => const Center(
                          child: Icon(
                            Icons.image,
                            size: 60,
                            color: Color(0xFFCCCCCC),
                          ),
                        ),
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
                        onPressed: () => postProvider.toggleLike(post.id),
                        icon: Icon(
                          post.isLiked ? Icons.favorite : Icons.favorite_border,
                          color: post.isLiked
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

                      const Spacer(),

                      // Price (if for sale)
                      if (post.isForSale && post.price != null)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: const Color.fromARGB(255, 255, 60, 60),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Text(
                            '\$${post.price!.toStringAsFixed(0)}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                    ],
                  ),

                  const SizedBox(height: 8),

                  // Artwork Title
                  Text(
                    post.artworkTitle,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.black,
                    ),
                  ),

                  // Description (if available)
                  if (post.artworkDescription != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      post.artworkDescription!,
                      style: const TextStyle(
                        fontSize: 14,
                        color: Color(0xFF6B7280),
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],

                  const SizedBox(height: 8),

                  // Tags (if available)
                  if (post.tags.isNotEmpty) ...[
                    Wrap(
                      spacing: 6,
                      runSpacing: 4,
                      children: post.tags.take(3).map((tag) {
                        return Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF5F5F5),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '#$tag',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF6B7280),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 8),
                  ],

                  // Likes and Comments Count
                  Text(
                    '${postProvider.formatLikes(post.likesCount)} Likes • ${post.commentsCount} Comments',
                    style: const TextStyle(
                      fontSize: 14,
                      color: Color(0xFF9E9E9E),
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
            Navigator.of(context).pushReplacementNamed('/messaging');
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

  void _showPostOptions(Post post) {
    final postProvider = Provider.of<PostProvider>(context, listen: false);
    final isCurrentUserPost = postProvider.isCurrentUserPost(post.id);

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => SafeArea(
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Handle bar
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),

              // Share option
              ListTile(
                leading: const Icon(Icons.share, color: Colors.black),
                title: const Text('Share'),
                onTap: () {
                  Navigator.pop(context);
                  // TODO: Implement share functionality
                },
              ),

              // Save option
              ListTile(
                leading: const Icon(Icons.bookmark_border, color: Colors.black),
                title: const Text('Save'),
                onTap: () {
                  Navigator.pop(context);
                  // TODO: Implement save functionality
                },
              ),

              // Delete option (only for current user's posts)
              if (isCurrentUserPost) ...[
                const Divider(),
                ListTile(
                  leading: const Icon(Icons.delete, color: Colors.red),
                  title: const Text(
                    'Delete Post',
                    style: TextStyle(color: Colors.red),
                  ),
                  onTap: () {
                    Navigator.pop(context);
                    _showDeleteConfirmation(post);
                  },
                ),
              ],

              // Report option (only for other users' posts)
              if (!isCurrentUserPost) ...[
                const Divider(),
                ListTile(
                  leading:
                      const Icon(Icons.report_outlined, color: Colors.orange),
                  title: const Text(
                    'Report',
                    style: TextStyle(color: Colors.orange),
                  ),
                  onTap: () {
                    Navigator.pop(context);
                    // TODO: Implement report functionality
                  },
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  void _showDeleteConfirmation(Post post) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Post'),
        content: const Text(
            'Are you sure you want to delete this post? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              await _deletePost(post);
            },
            style: TextButton.styleFrom(
              foregroundColor: Colors.red,
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  Future<void> _deletePost(Post post) async {
    final postProvider = Provider.of<PostProvider>(context, listen: false);
    final success = await postProvider.deletePost(post.id);

    if (success) {
      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Post deleted successfully'),
          backgroundColor: Colors.green,
        ),
      );
    } else {
      // Show error message
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Failed to delete post'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}
