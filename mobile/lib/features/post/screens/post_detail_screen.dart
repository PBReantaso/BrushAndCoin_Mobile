import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/providers/post_provider.dart';
import '../../../core/models/post_model.dart';

class PostDetailScreen extends StatefulWidget {
  final Post post;

  const PostDetailScreen({
    super.key,
    required this.post,
  });

  @override
  State<PostDetailScreen> createState() => _PostDetailScreenState();
}

class _PostDetailScreenState extends State<PostDetailScreen> {
  final TextEditingController _commentController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  List<Map<String, dynamic>> _displayedComments = [];
  int _commentsPerPage = 5;
  int _currentPage = 0;
  bool _isLoadingMore = false;

  @override
  void initState() {
    super.initState();
    _loadInitialComments();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _commentController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _loadInitialComments() {
    final postProvider = Provider.of<PostProvider>(context, listen: false);
    final allComments = postProvider.getCommentsForPost(widget.post.id);

    setState(() {
      _displayedComments = allComments.take(_commentsPerPage).toList();
      _currentPage = 1;
    });
  }

  void _loadMoreComments() {
    if (_isLoadingMore) return;

    setState(() {
      _isLoadingMore = true;
    });

    // Simulate loading delay
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) {
        final postProvider = Provider.of<PostProvider>(context, listen: false);
        final allComments = postProvider.getCommentsForPost(widget.post.id);

        setState(() {
          final startIndex = _currentPage * _commentsPerPage;
          final endIndex =
              (startIndex + _commentsPerPage).clamp(0, allComments.length);

          if (startIndex < allComments.length) {
            _displayedComments
                .addAll(allComments.sublist(startIndex, endIndex));
            _currentPage++;
          }

          _isLoadingMore = false;
        });
      }
    });
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      _loadMoreComments();
    }
  }

  void _showPostOptions() {
    final postProvider = Provider.of<PostProvider>(context, listen: false);
    final isCurrentUserPost = postProvider.isCurrentUserPost(widget.post.id);

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
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
                  _showDeleteConfirmation();
                },
              ),
            ],

            // Report option (only for other users' posts)
            if (!isCurrentUserPost) ...[
              const Divider(),
              ListTile(
                leading: const Icon(Icons.report, color: Colors.orange),
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
    );
  }

  void _showDeleteConfirmation() {
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
              await _deletePost();
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

  Future<void> _deletePost() async {
    final postProvider = Provider.of<PostProvider>(context, listen: false);
    final success = await postProvider.deletePost(widget.post.id);

    if (success) {
      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Post deleted successfully'),
          backgroundColor: Colors.green,
        ),
      );
      // Navigate back to home screen
      Navigator.of(context).pop();
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
  Widget build(BuildContext context) {
    final postProvider = Provider.of<PostProvider>(context, listen: false);

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
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
                      child: const TextField(
                        decoration: InputDecoration(
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

            // Navigation Row with Back, Share, and More Options
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
                      Icons.arrow_back_ios,
                      color: Colors.black,
                      size: 20,
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
                      _showPostOptions();
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
                controller: _scrollController,
                physics: const ClampingScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Post Title
                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 8),
                      child: Text(
                        widget.post.artworkTitle,
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
                          CircleAvatar(
                            radius: 20,
                            backgroundColor: const Color(0xFF666666),
                            backgroundImage: widget.post.userAvatar != null
                                ? CachedNetworkImageProvider(
                                    widget.post.userAvatar!)
                                : null,
                            child: widget.post.userAvatar == null
                                ? const Icon(
                                    Icons.person,
                                    color: Colors.white,
                                    size: 20,
                                  )
                                : null,
                          ),

                          const SizedBox(width: 12),

                          // User Name
                          Text(
                            widget.post.userName,
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
                      height: 300,
                      margin: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF0F0F0),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: widget.post.artworkImageUrl ==
                                'no_image_placeholder'
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
                                imageUrl: widget.post.artworkImageUrl,
                                fit: BoxFit.cover,
                                placeholder: (context, url) => const Center(
                                  child: CircularProgressIndicator(
                                    color: Color.fromARGB(255, 255, 60, 60),
                                  ),
                                ),
                                errorWidget: (context, url, error) =>
                                    const Center(
                                  child: Icon(
                                    Icons.image,
                                    size: 60,
                                    color: Color(0xFFCCCCCC),
                                  ),
                                ),
                              ),
                      ),
                    ),

                    // Description Section
                    if (widget.post.artworkDescription != null)
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 8),
                        child: RichText(
                          text: TextSpan(
                            style: const TextStyle(
                              fontSize: 14,
                              color: Colors.black,
                              height: 1.4,
                            ),
                            children: [
                              TextSpan(
                                text: widget.post.artworkDescription!.length >
                                        100
                                    ? '${widget.post.artworkDescription!.substring(0, 100)}...'
                                    : widget.post.artworkDescription!,
                              ),
                              if (widget.post.artworkDescription!.length > 100)
                                const TextSpan(
                                  text: ' more',
                                  style: TextStyle(
                                    color: Color.fromARGB(255, 255, 60, 60),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),

                    // Like Button
                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 8),
                      child: Row(
                        children: [
                          IconButton(
                            onPressed: () =>
                                postProvider.toggleLike(widget.post.id),
                            icon: Icon(
                              widget.post.isLiked
                                  ? Icons.thumb_up
                                  : Icons.thumb_up_outlined,
                              color: widget.post.isLiked
                                  ? const Color.fromARGB(255, 255, 60, 60)
                                  : Colors.black,
                              size: 24,
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Comments Section
                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 8),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Comments (${postProvider.getCommentsForPost(widget.post.id).length})',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Comments List
                          ..._displayedComments
                              .map((comment) => _buildCommentItem(comment))
                              .toList(),

                          // Load More Comments Button
                          if (_displayedComments.length <
                              postProvider
                                  .getCommentsForPost(widget.post.id)
                                  .length)
                            Padding(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              child: Center(
                                child: _isLoadingMore
                                    ? const CircularProgressIndicator(
                                        color: Color.fromARGB(255, 255, 60, 60),
                                      )
                                    : TextButton(
                                        onPressed: _loadMoreComments,
                                        child: Text(
                                          'Load More Comments (${postProvider.getCommentsForPost(widget.post.id).length - _displayedComments.length} remaining)',
                                          style: const TextStyle(
                                            color: Color.fromARGB(
                                                255, 255, 60, 60),
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ),
                              ),
                            ),

                          const SizedBox(height: 16),

                          // Add Comment Section
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 16,
                                backgroundColor: const Color(0xFF666666),
                                child: const Icon(
                                  Icons.person,
                                  color: Colors.white,
                                  size: 16,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: TextField(
                                  controller: _commentController,
                                  decoration: const InputDecoration(
                                    hintText: 'Add a comment...',
                                    hintStyle: TextStyle(
                                      color: Color(0xFF9E9E9E),
                                      fontSize: 14,
                                    ),
                                    border: InputBorder.none,
                                  ),
                                ),
                              ),
                              IconButton(
                                onPressed: () {
                                  if (_commentController.text
                                      .trim()
                                      .isNotEmpty) {
                                    final newComment = {
                                      'id': DateTime.now()
                                          .millisecondsSinceEpoch
                                          .toString(),
                                      'userName': 'You',
                                      'userAvatar': null,
                                      'comment': _commentController.text.trim(),
                                      'timestamp': 'Just now',
                                    };

                                    setState(() {
                                      _displayedComments.insert(0, newComment);
                                    });

                                    // Add comment to PostProvider
                                    postProvider.addComment(
                                        widget.post.id, newComment);

                                    _commentController.clear();
                                  }
                                },
                                icon: const Icon(
                                  Icons.send,
                                  color: Color.fromARGB(255, 255, 60, 60),
                                  size: 20,
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
                _buildNavItem(Icons.home, 0, isSelected: true),
                _buildNavItem(Icons.bookmark_border, 1, isSelected: false),
                _buildNavItem(Icons.chat_bubble_outline, 2, isSelected: false),
                _buildNavItem(Icons.person_outline, 3, isSelected: false),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCommentItem(Map<String, dynamic> comment) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            radius: 16,
            backgroundColor: const Color(0xFF666666),
            backgroundImage: comment['userAvatar'] != null
                ? CachedNetworkImageProvider(comment['userAvatar'])
                : null,
            child: comment['userAvatar'] == null
                ? const Icon(
                    Icons.person,
                    color: Colors.white,
                    size: 16,
                  )
                : null,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  comment['userName'],
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  comment['comment'],
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
    );
  }

  Widget _buildNavItem(IconData icon, int index, {required bool isSelected}) {
    return GestureDetector(
      onTap: () {
        // Navigate to different screens based on index
        switch (index) {
          case 0:
            Navigator.of(context).pushReplacementNamed('/home');
            break;
          case 1:
            // TODO: Navigate to bookmarks
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
}
