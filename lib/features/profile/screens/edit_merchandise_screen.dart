import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';

class EditMerchandiseScreen extends StatefulWidget {
  final Map<String, dynamic> merchandise;
  final Function(Map<String, dynamic>) onSave;

  const EditMerchandiseScreen({
    super.key,
    required this.merchandise,
    required this.onSave,
  });

  @override
  State<EditMerchandiseScreen> createState() => _EditMerchandiseScreenState();
}

class _EditMerchandiseScreenState extends State<EditMerchandiseScreen> {
  late TextEditingController _titleController;
  late TextEditingController _priceController;
  late TextEditingController _descriptionController;
  late TextEditingController _shippingController;
  late TextEditingController _deliveryController;

  File? _selectedImage;
  String _selectedAvailability = 'In Stock';

  @override
  void initState() {
    super.initState();

    // Initialize controllers with existing data
    _titleController =
        TextEditingController(text: widget.merchandise['title'] ?? '');
    _priceController = TextEditingController(
        text:
            widget.merchandise['price']?.toString().replaceAll('\$', '') ?? '');
    _descriptionController =
        TextEditingController(text: widget.merchandise['description'] ?? '');
    _shippingController =
        TextEditingController(text: widget.merchandise['shipping'] ?? '');
    _deliveryController =
        TextEditingController(text: widget.merchandise['delivery'] ?? '');

    _selectedAvailability = widget.merchandise['availability'] ?? 'In Stock';

    // Set existing image if available
    if (widget.merchandise['image'] != null) {
      _selectedImage = File(widget.merchandise['image']);
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _priceController.dispose();
    _descriptionController.dispose();
    _shippingController.dispose();
    _deliveryController.dispose();
    super.dispose();
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: const Icon(Icons.arrow_back, color: Colors.black),
        ),
        title: const Text(
          'Edit Merchandise',
          style: TextStyle(
            color: Colors.black,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        actions: [
          TextButton(
            onPressed: _saveChanges,
            child: const Text(
              'Save',
              style: TextStyle(
                color: Color.fromARGB(255, 255, 60, 60),
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
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
                          onTap: () =>
                              Navigator.pop(context, ImageSource.gallery),
                        ),
                        ListTile(
                          leading: const Icon(Icons.photo_camera),
                          title: const Text('Camera'),
                          onTap: () =>
                              Navigator.pop(context, ImageSource.camera),
                        ),
                      ],
                    ),
                  ),
                );
                if (source != null) {
                  final picker = ImagePicker();
                  final picked =
                      await picker.pickImage(source: source, imageQuality: 85);
                  if (picked != null) {
                    setState(() {
                      _selectedImage = File(picked.path);
                    });
                  }
                }
              },
              child: Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: const Color(0xFFF0F0F0),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE0E0E0)),
                ),
                child: _selectedImage != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.file(
                          _selectedImage!,
                          fit: BoxFit.cover,
                          width: double.infinity,
                        ),
                      )
                    : const Center(
                        child: Icon(
                          Icons.add_photo_alternate,
                          color: Color(0xFFCCCCCC),
                          size: 60,
                        ),
                      ),
              ),
            ),

            const SizedBox(height: 16),

            // Title Field
            TextField(
              controller: _titleController,
              decoration: InputDecoration(
                label: RichText(
                  text: const TextSpan(
                    style: TextStyle(color: Color(0xFF666666), fontSize: 14),
                    children: [
                      TextSpan(text: 'Title '),
                      TextSpan(
                        text: '*',
                        style:
                            TextStyle(color: Color.fromARGB(255, 255, 60, 60)),
                      ),
                    ],
                  ),
                ),
                border: const OutlineInputBorder(),
                focusedBorder: const OutlineInputBorder(
                  borderSide:
                      BorderSide(color: Color.fromARGB(255, 255, 60, 60)),
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Price Field
            TextField(
              controller: _priceController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              inputFormatters: [
                FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d{0,2}')),
              ],
              onEditingComplete: () {
                _formatPrice(_priceController);
              },
              onSubmitted: (value) {
                _formatPrice(_priceController);
              },
              decoration: InputDecoration(
                label: RichText(
                  text: const TextSpan(
                    style: TextStyle(color: Color(0xFF666666), fontSize: 14),
                    children: [
                      TextSpan(text: 'Price '),
                      TextSpan(
                        text: '*',
                        style:
                            TextStyle(color: Color.fromARGB(255, 255, 60, 60)),
                      ),
                    ],
                  ),
                ),
                prefixText: '\$ ',
                border: const OutlineInputBorder(),
                focusedBorder: const OutlineInputBorder(
                  borderSide:
                      BorderSide(color: Color.fromARGB(255, 255, 60, 60)),
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Description Field
            TextField(
              controller: _descriptionController,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Description',
                hintText: 'Describe your merchandise...',
                border: OutlineInputBorder(),
                alignLabelWithHint: true,
              ),
            ),

            const SizedBox(height: 16),

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

            // Availability Dropdown
            Container(
              decoration: BoxDecoration(
                border: Border.all(color: const Color(0xFFE0E0E0)),
                borderRadius: BorderRadius.circular(12),
              ),
              child: DropdownButtonFormField<String>(
                value: _selectedAvailability,
                decoration: const InputDecoration(
                  label: Text('Availability'),
                  border: InputBorder.none,
                  contentPadding:
                      EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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
                    setState(() {
                      _selectedAvailability = value;
                    });
                  }
                },
              ),
            ),

            const SizedBox(height: 16),

            // Shipping Info Field
            TextField(
              controller: _shippingController,
              decoration: InputDecoration(
                label: RichText(
                  text: const TextSpan(
                    style: TextStyle(color: Color(0xFF666666), fontSize: 14),
                    children: [
                      TextSpan(text: 'Shipping Info '),
                      TextSpan(
                        text: '*',
                        style:
                            TextStyle(color: Color.fromARGB(255, 255, 60, 60)),
                      ),
                    ],
                  ),
                ),
                hintText: 'Enter shipping information',
                border: const OutlineInputBorder(),
                focusedBorder: const OutlineInputBorder(
                  borderSide:
                      BorderSide(color: Color.fromARGB(255, 255, 60, 60)),
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Estimated Delivery Field
            TextField(
              controller: _deliveryController,
              decoration: InputDecoration(
                label: RichText(
                  text: const TextSpan(
                    style: TextStyle(color: Color(0xFF666666), fontSize: 14),
                    children: [
                      TextSpan(text: 'Estimated Delivery '),
                      TextSpan(
                        text: '*',
                        style:
                            TextStyle(color: Color.fromARGB(255, 255, 60, 60)),
                      ),
                    ],
                  ),
                ),
                hintText: 'Enter delivery time',
                border: const OutlineInputBorder(),
                focusedBorder: const OutlineInputBorder(
                  borderSide:
                      BorderSide(color: Color.fromARGB(255, 255, 60, 60)),
                ),
              ),
            ),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  void _saveChanges() {
    final title = _titleController.text.trim();
    final price = _priceController.text.trim();
    final description = _descriptionController.text.trim();
    final shipping = _shippingController.text.trim();
    final delivery = _deliveryController.text.trim();

    if (title.isEmpty ||
        price.isEmpty ||
        shipping.isEmpty ||
        delivery.isEmpty) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Required Fields'),
          content: const Text('Please fill in all required fields.'),
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

    // Create updated merchandise data
    final updatedMerchandise = {
      ...widget.merchandise,
      'title': title,
      'price': '\$${price}',
      'description': description.isNotEmpty
          ? description
          : 'This is a high-quality merchandise item perfect for any fan. Made with premium materials and featuring excellent craftsmanship, this item is sure to become a treasured part of your collection.',
      'availability': _selectedAvailability,
      'shipping': shipping,
      'delivery': delivery,
      'image': _selectedImage?.path,
    };

    // Call the save callback
    widget.onSave(updatedMerchandise);

    // Show success message and go back
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Merchandise updated successfully!'),
        backgroundColor: Colors.green,
      ),
    );
    Navigator.pop(context);
  }
}
