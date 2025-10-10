import 'dart:io';
import 'package:flutter/material.dart';
import 'edit_merchandise_screen.dart';

class MerchandiseDetailScreen extends StatefulWidget {
  final Map<String, dynamic> merchandise;
  final VoidCallback? onDelete;
  final bool isCurrentUser;
  final bool showHeader;

  const MerchandiseDetailScreen(
      {super.key,
      required this.merchandise,
      this.onDelete,
      this.isCurrentUser = true,
      this.showHeader = true});

  @override
  State<MerchandiseDetailScreen> createState() =>
      _MerchandiseDetailScreenState();
}

class _MerchandiseDetailScreenState extends State<MerchandiseDetailScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  String _formatPriceDisplay(String price) {
    if (price.isEmpty) return price;

    // Remove the $ symbol for processing
    String cleanPrice = price.replaceAll('\$', '');

    // If it doesn't contain a decimal, add .00
    if (!cleanPrice.contains('.')) {
      return '\$${cleanPrice}.00';
    }

    // If it has a decimal but only one digit after, add another 0
    if (cleanPrice.split('.').length == 2) {
      String decimalPart = cleanPrice.split('.')[1];
      if (decimalPart.length == 1) {
        return '\$${cleanPrice}0';
      }
    }

    // Return with $ symbol
    return '\$${cleanPrice}';
  }

  void _editMerchandise(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => FractionallySizedBox(
        heightFactor: 0.88,
        child: ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
          child: EditMerchandiseScreen(
            merchandise: widget.merchandise,
            onSave: (updatedMerchandise) {
              widget.merchandise
                ..clear()
                ..addAll(updatedMerchandise);
              setState(() {});
              Navigator.of(context).pop();
            },
          ),
        ),
      ),
    );
  }

  void _confirmDelete(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Merchandise'),
        content: const Text(
            'Are you sure you want to delete this merchandise? This action cannot be undone.'),
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Cancel',
              style: TextStyle(color: Colors.grey),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Close dialog
              _deleteMerchandise(context);
            },
            child: const Text(
              'Delete',
              style: TextStyle(color: Colors.red),
            ),
          ),
        ],
      ),
    );
  }

  void _deleteMerchandise(BuildContext context) {
    // Call the delete callback if provided
    if (widget.onDelete != null) {
      widget.onDelete!();
    }

    // Show success message and go back
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Merchandise deleted successfully!'),
        backgroundColor: Colors.green,
      ),
    );
    Navigator.of(context).pop(); // Go back to profile screen
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // App Header with Logo, Search, and Settings (optional)
            if (widget.showHeader)
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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

            // Merchandise Content
            Expanded(
              child: SingleChildScrollView(
                physics: const ClampingScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Merchandise Information Card
                    Container(
                      width: double.infinity,
                      color: Colors.white,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Header with Back Button and Title
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Close Button (top-right)
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: [
                                    GestureDetector(
                                      onTap: () {
                                        Navigator.of(context).pop();
                                      },
                                      child: Container(
                                        padding: const EdgeInsets.all(8),
                                        decoration: const BoxDecoration(),
                                        child: const Icon(
                                          Icons.close,
                                          color: Colors.black,
                                          size: 20,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                // Title and Price Row
                                Row(
                                  children: [
                                    // Title
                                    Expanded(
                                      child: Text(
                                        widget.merchandise['title'] ??
                                            'Merchandise Item',
                                        style: const TextStyle(
                                          fontSize: 24,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.black,
                                        ),
                                      ),
                                    ),
                                    // Price
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 12,
                                        vertical: 8,
                                      ),
                                      decoration: BoxDecoration(
                                        color: const Color.fromARGB(
                                            255, 255, 60, 60),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        _formatPriceDisplay(
                                            widget.merchandise['price'] ??
                                                '₱0.00'),
                                        style: const TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),

                          // Merchandise Image
                          Container(
                            width: double.infinity,
                            height: 300,
                            margin: const EdgeInsets.symmetric(horizontal: 16),
                            decoration: const BoxDecoration(),
                            child: widget.merchandise['image'] != null
                                ? ClipRRect(
                                    borderRadius: BorderRadius.circular(8),
                                    child: Image.file(
                                      File(widget.merchandise['image']),
                                      fit: BoxFit.cover,
                                      width: double.infinity,
                                    ),
                                  )
                                : const Center(
                                    child: Icon(
                                      Icons.shopping_bag,
                                      size: 80,
                                      color: Color(0xFFCCCCCC),
                                    ),
                                  ),
                          ),

                          const SizedBox(height: 16),

                          // Merchandise Description Section
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Description',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(16),
                                  decoration: const BoxDecoration(),
                                  child: Text(
                                    widget.merchandise['description'] ??
                                        'This is a high-quality merchandise item perfect for any fan. Made with premium materials and featuring excellent craftsmanship, this item is sure to become a treasured part of your collection.',
                                    style: const TextStyle(
                                      fontSize: 14,
                                      color: Color(0xFF666666),
                                      height: 1.4,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 24),

                          // Purchase Section
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Purchase Information',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(16),
                                  decoration: const BoxDecoration(),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Availability: ${widget.merchandise['availability'] ?? 'In Stock'}',
                                        style: const TextStyle(
                                          fontSize: 14,
                                          color: Color(0xFF666666),
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      if (widget.merchandise['shipping'] !=
                                              null &&
                                          widget.merchandise['shipping']
                                              .toString()
                                              .isNotEmpty)
                                        Text(
                                          'Shipping: ${widget.merchandise['shipping']}',
                                          style: const TextStyle(
                                            fontSize: 14,
                                            color: Color(0xFF666666),
                                          ),
                                        ),
                                      if (widget.merchandise['shipping'] !=
                                              null &&
                                          widget
                                              .merchandise['shipping']
                                              .toString()
                                              .isNotEmpty &&
                                          widget.merchandise['delivery'] !=
                                              null &&
                                          widget.merchandise['delivery']
                                              .toString()
                                              .isNotEmpty)
                                        const SizedBox(height: 8),
                                      if (widget.merchandise['delivery'] !=
                                              null &&
                                          widget.merchandise['delivery']
                                              .toString()
                                              .isNotEmpty)
                                        Text(
                                          'Estimated delivery: ${widget.merchandise['delivery']}',
                                          style: const TextStyle(
                                            fontSize: 14,
                                            color: Color(0xFF666666),
                                          ),
                                        ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 16),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Edit and Delete Buttons (only for current user)
                    if (widget.isCurrentUser)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Row(
                          children: [
                            Expanded(
                              child: ElevatedButton.icon(
                                onPressed: () => _editMerchandise(context),
                                icon: const Icon(Icons.edit, size: 18),
                                label: const Text('Edit'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor:
                                      const Color.fromARGB(255, 255, 60, 60),
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  padding:
                                      const EdgeInsets.symmetric(vertical: 12),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ElevatedButton.icon(
                                onPressed: () => _confirmDelete(context),
                                icon: const Icon(Icons.delete, size: 18),
                                label: const Text('Delete'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.red,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  padding:
                                      const EdgeInsets.symmetric(vertical: 12),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                    const SizedBox(height: 16),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
