import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/providers/post_provider.dart';
import '../../../core/utils/system_ui_utils.dart';
import '../../../shared/types/post.dart';

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
  final int _commentsPerPage = 5;
  int _currentPage = 0;
  bool _isLoadingMore = false;

  @override
  void initState() {
    super.initState();
    _loadInitialComments();
    _scrollController.addListener(_onScroll);
    _commentController.addListener(() {
      setState(() {}); // Rebuild to update send button color
    });
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
    // Apply red theme to system UI (status bar and navigation bar)
    SystemUIUtils.applyRedTheme();

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        title: const Text(
          'Post Details',
          style: TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: const Color.fromARGB(255, 255, 60, 60),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            onPressed: () {
              // TODO: Implement share functionality
            },
            icon: const Icon(Icons.share, color: Colors.white),
          ),
          IconButton(
            onPressed: _showPostOptions,
            icon: const Icon(Icons.more_vert, color: Colors.white),
          ),
        ],
      ),
      body: Column(
        children: [
          // Header with post info
          _buildHeader(),

          // Content
          Expanded(
            child: SingleChildScrollView(
              controller: _scrollController,
              physics: const ClampingScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Post Image
                  _buildPostImage(),

                  const SizedBox(height: 16),

                  // Post Actions
                  _buildPostActions(),

                  const SizedBox(height: 24),

                  // Comments Section
                  _buildCommentsSection(),

                  // Add bottom padding to account for floating comment input
                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),

      // Floating Comment Input
      bottomNavigationBar: _buildFloatingCommentInput(),
    );
  }

  Widget _buildHeader() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Color.fromARGB(255, 255, 60, 60),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // User Avatar
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(25),
                ),
                child: widget.post.userAvatar.isNotEmpty
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(25),
                        child: CachedNetworkImage(
                          imageUrl: widget.post.userAvatar,
                          fit: BoxFit.cover,
                          errorWidget: (context, url, error) {
                            return const Icon(
                              Icons.person,
                              color: Color.fromARGB(255, 255, 60, 60),
                              size: 24,
                            );
                          },
                        ),
                      )
                    : const Icon(
                        Icons.person,
                        color: Color.fromARGB(255, 255, 60, 60),
                        size: 24,
                      ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.post.userName,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      widget.post.title,
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
              // Engagement Stats
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.favorite,
                      color: Color.fromARGB(255, 255, 60, 60),
                      size: 16,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '${widget.post.likes}',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Color.fromARGB(255, 255, 60, 60),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '${widget.post.likes} likes',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
              Text(
                '${widget.post.comments} comments',
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPostImage() {
    return Container(
      margin: const EdgeInsets.all(16),
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
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: widget.post.imageUrl == 'no_image_placeholder'
            ? Container(
                height: 300,
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
                imageUrl: widget.post.imageUrl,
                fit: BoxFit.cover,
                placeholder: (context, url) => Container(
                  height: 300,
                  color: const Color(0xFFF0F0F0),
                  child: const Center(
                    child: CircularProgressIndicator(
                      color: Color.fromARGB(255, 255, 60, 60),
                    ),
                  ),
                ),
                errorWidget: (context, url, error) => Container(
                  height: 300,
                  color: const Color(0xFFF0F0F0),
                  child: const Center(
                    child: Icon(
                      Icons.image,
                      size: 60,
                      color: Color(0xFFCCCCCC),
                    ),
                  ),
                ),
              ),
      ),
    );
  }

  Widget _buildPostActions() {
    final postProvider = Provider.of<PostProvider>(context, listen: false);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (widget.post.description.isNotEmpty) ...[
            const Text(
              'Description',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              widget.post.description,
              style: const TextStyle(
                fontSize: 14,
                color: Color(0xFF6B7280),
                height: 1.5,
              ),
            ),
            const SizedBox(height: 16),
          ],
          Row(
            children: [
              IconButton(
                onPressed: () => postProvider.toggleLike(widget.post.id),
                icon: Icon(
                  widget.post.isLiked ? Icons.favorite : Icons.favorite_border,
                  color: widget.post.isLiked
                      ? const Color.fromARGB(255, 255, 60, 60)
                      : Colors.black,
                  size: 24,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                '${widget.post.likes}',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.black,
                ),
              ),
              const Spacer(),
              IconButton(
                onPressed: () {
                  // TODO: Implement bookmark functionality
                },
                icon: const Icon(
                  Icons.bookmark_border,
                  color: Colors.black,
                  size: 24,
                ),
              ),
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
        ],
      ),
    );
  }

  Widget _buildCommentsSection() {
    final postProvider = Provider.of<PostProvider>(context, listen: false);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
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
              ,

          // Load More Comments Button
          if (_displayedComments.length <
              postProvider.getCommentsForPost(widget.post.id).length)
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
                            color: Color.fromARGB(255, 255, 60, 60),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildFloatingCommentInput() {
    final postProvider = Provider.of<PostProvider>(context, listen: false);

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(
            color: Color(0xFFE0E0E0),
            width: 1,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0x1A000000),
            blurRadius: 10,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              // User Avatar
              const CircleAvatar(
                radius: 16,
                backgroundColor: Color(0xFF666666),
                child: Icon(
                  Icons.person,
                  color: Colors.white,
                  size: 16,
                ),
              ),
              const SizedBox(width: 12),

              // Comment Input
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F5F5),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: const Color(0xFFE0E0E0),
                      width: 1,
                    ),
                  ),
                  child: TextField(
                    controller: _commentController,
                    decoration: const InputDecoration(
                      hintText: 'Add a comment...',
                      hintStyle: TextStyle(
                        color: Color(0xFF9E9E9E),
                        fontSize: 14,
                      ),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                    ),
                    maxLines: null,
                    textInputAction: TextInputAction.newline,
                    onSubmitted: (value) {
                      if (value.trim().isNotEmpty) {
                        _addComment(postProvider, value.trim());
                      }
                    },
                  ),
                ),
              ),

              const SizedBox(width: 8),

              // Send Button
              GestureDetector(
                onTap: () {
                  if (_commentController.text.trim().isNotEmpty) {
                    _addComment(postProvider, _commentController.text.trim());
                  }
                },
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: _commentController.text.trim().isNotEmpty
                        ? const Color.fromARGB(255, 255, 60, 60)
                        : const Color(0xFFE0E0E0),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.send,
                    color: _commentController.text.trim().isNotEmpty
                        ? Colors.white
                        : const Color(0xFF9E9E9E),
                    size: 20,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _addComment(PostProvider postProvider, String commentText) {
    final newComment = {
      'id': DateTime.now().millisecondsSinceEpoch.toString(),
      'userName': 'You',
      'userAvatar': null,
      'comment': commentText,
      'timestamp': 'Just now',
    };

    setState(() {
      _displayedComments.insert(0, newComment);
    });

    // Add comment to PostProvider
    postProvider.addComment(widget.post.id, newComment);

    _commentController.clear();

    // Scroll to top of comments to show the new comment
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          0,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
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
}
