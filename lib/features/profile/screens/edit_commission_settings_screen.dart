import 'package:flutter/material.dart';
import 'dart:io' as io;
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../../core/providers/commission_provider.dart';
import '../../../core/providers/auth_provider.dart';
import 'commission_request_screen.dart';

class EditCommissionSettingsScreen extends StatefulWidget {
  const EditCommissionSettingsScreen({super.key});

  @override
  State<EditCommissionSettingsScreen> createState() =>
      _EditCommissionSettingsScreenState();
}

// Read-only view of current commission settings with an Edit button
class CommissionSettingsViewSheet extends StatelessWidget {
  final String? artistId;
  final bool showRequestButton;

  const CommissionSettingsViewSheet(
      {super.key, this.artistId, this.showRequestButton = false});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final provider = Provider.of<CommissionProvider>(context, listen: false);
    final String ownerId = artistId ?? (auth.currentUser?.id ?? 'me');
    final settings = provider.getCommissionSettings(ownerId) ?? {};
    final bool accepts = settings['accepts'] ?? true;
    final String headline = settings['headline'] ?? 'No headline set';
    final String description =
        settings['description'] ?? 'No description provided.';
    final double basePrice = (settings['basePrice'] is num)
        ? (settings['basePrice'] as num).toDouble()
        : 0.0;
    final List<dynamic> refs =
        (settings['referenceImages'] as List<dynamic>?) ?? const [];

    return SafeArea(
      top: false,
      child: FractionallySizedBox(
        heightFactor: 0.88,
        child: ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
          child: Material(
            color: Colors.white,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Commission Details',
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.w700),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Accepting status
                  Row(
                    children: [
                      const Text(
                        'Accepting commissions',
                        style: TextStyle(
                            fontSize: 14, fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: accepts
                              ? const Color(0xFFD4EDDA)
                              : const Color(0xFFF8D7DA),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          accepts ? 'On' : 'Off',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: accepts
                                ? const Color(0xFF155724)
                                : const Color(0xFF721C24),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Headline
                  const Text('Headline',
                      style: TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
                  const SizedBox(height: 4),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F5F5),
                      borderRadius: BorderRadius.circular(8),
                      border:
                          Border.all(color: const Color(0xFFE0E0E0), width: 1),
                    ),
                    child: Text(headline,
                        style:
                            const TextStyle(fontSize: 14, color: Colors.black)),
                  ),
                  const SizedBox(height: 12),
                  // Description
                  const Text('Description',
                      style: TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
                  const SizedBox(height: 4),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F5F5),
                      borderRadius: BorderRadius.circular(8),
                      border:
                          Border.all(color: const Color(0xFFE0E0E0), width: 1),
                    ),
                    child: Text(
                      description,
                      style: const TextStyle(fontSize: 14, color: Colors.black),
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Base price
                  const Text('Base price (PHP)',
                      style: TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
                  const SizedBox(height: 4),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F5F5),
                      borderRadius: BorderRadius.circular(8),
                      border:
                          Border.all(color: const Color(0xFFE0E0E0), width: 1),
                    ),
                    child: Text('₱ ${basePrice.toStringAsFixed(2)}',
                        style: const TextStyle(
                            fontSize: 14,
                            color: Colors.black,
                            fontWeight: FontWeight.w600)),
                  ),
                  const SizedBox(height: 12),
                  // Reference images
                  if (refs.isNotEmpty) ...[
                    const Text('Reference images',
                        style:
                            TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
                    const SizedBox(height: 8),
                    Builder(builder: (context) {
                      final int count = refs.length;
                      final double itemSize = count == 1
                          ? 220
                          : count == 2
                              ? 140
                              : 100;
                      return SizedBox(
                        height: itemSize,
                        child: ListView.separated(
                          scrollDirection: Axis.horizontal,
                          itemCount: refs.length,
                          separatorBuilder: (_, __) => const SizedBox(width: 8),
                          itemBuilder: (context, index) {
                            final path = refs[index] as String;
                            return GestureDetector(
                              onTap: () {
                                showDialog(
                                  context: context,
                                  barrierColor: Colors.black.withOpacity(0.85),
                                  builder: (_) => Stack(
                                    children: [
                                      Positioned.fill(
                                        child: GestureDetector(
                                          onTap: () =>
                                              Navigator.of(context).pop(),
                                          child: Container(
                                              color: Colors.transparent),
                                        ),
                                      ),
                                      Center(
                                        child: InteractiveViewer(
                                          maxScale: 5,
                                          child: ClipRRect(
                                            borderRadius:
                                                BorderRadius.circular(12),
                                            child: Image.file(
                                              io.File(path),
                                              fit: BoxFit.contain,
                                            ),
                                          ),
                                        ),
                                      ),
                                      Positioned(
                                        top: 16,
                                        right: 16,
                                        child: IconButton(
                                          icon: const Icon(Icons.close,
                                              color: Colors.white),
                                          onPressed: () =>
                                              Navigator.of(context).pop(),
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              },
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(12),
                                child: Container(
                                  width: itemSize,
                                  height: itemSize,
                                  color: const Color(0xFFF0F0F0),
                                  child: Image.file(
                                    io.File(path),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      );
                    }),
                  ],
                  const Spacer(),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        if (showRequestButton) {
                          showCommissionRequestModal(context,
                              artistId: ownerId);
                        } else {
                          showModalBottomSheet(
                            context: context,
                            isScrollControlled: true,
                            backgroundColor: Colors.transparent,
                            builder: (_) =>
                                const EditCommissionSettingsScreen(),
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color.fromARGB(255, 255, 60, 60),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: Text(showRequestButton
                          ? 'Request Commission'
                          : 'Edit Details'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _EditCommissionSettingsScreenState
    extends State<EditCommissionSettingsScreen> {
  final _formKey = GlobalKey<FormState>();
  final _headlineCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _basePriceCtrl = TextEditingController();
  bool _acceptsCommissions = true;
  final ImagePicker _imagePicker = ImagePicker();
  final List<XFile> _referenceImages = [];

  @override
  void initState() {
    super.initState();
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final provider = Provider.of<CommissionProvider>(context, listen: false);
    final settings =
        provider.getCommissionSettings(auth.currentUser?.id ?? 'me');
    if (settings != null) {
      _acceptsCommissions = settings['accepts'] ?? true;
      _headlineCtrl.text = settings['headline'] ?? '';
      _descCtrl.text = settings['description'] ?? '';
      _basePriceCtrl.text = (settings['basePrice']?.toString() ?? '');
    }
  }

  @override
  void dispose() {
    _headlineCtrl.dispose();
    _descCtrl.dispose();
    _basePriceCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final provider = Provider.of<CommissionProvider>(context, listen: false);
    await provider.updateCommissionSettings(
      artistId: auth.currentUser?.id ?? 'me',
      settings: {
        'accepts': _acceptsCommissions,
        'headline': _headlineCtrl.text.trim(),
        'description': _descCtrl.text.trim(),
        'basePrice': double.tryParse(_basePriceCtrl.text.trim()) ?? 0,
        'referenceImages': _referenceImages.map((x) => x.path).toList(),
      },
    );
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Commission details saved')),
    );
    Navigator.of(context).pop(true);
  }

  // _onAddImages replaced by inline picker with camera/gallery options

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      child: FractionallySizedBox(
        heightFactor: 0.88,
        child: ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
          child: Material(
            color: Colors.white,
            child: Padding(
              padding: EdgeInsets.only(
                left: 16,
                right: 16,
                top: 16,
                bottom: 16 + MediaQuery.of(context).viewInsets.bottom,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Edit Commission Details',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Expanded(
                    child: Form(
                      key: _formKey,
                      child: ListView(
                        keyboardDismissBehavior:
                            ScrollViewKeyboardDismissBehavior.onDrag,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF5F5F5),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: const Color(0xFFE0E0E0),
                                width: 1,
                              ),
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: const [
                                      Text(
                                        'Accepting commissions',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                          color: Colors.black,
                                        ),
                                      ),
                                      SizedBox(height: 4),
                                      Text(
                                        'Toggle to receive new requests',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Color(0xFF6B7280),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                // Status badge
                                Container(
                                  margin: const EdgeInsets.only(right: 8),
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: _acceptsCommissions
                                        ? const Color(0xFFD4EDDA)
                                        : const Color(0xFFF8D7DA),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    _acceptsCommissions ? 'On' : 'Off',
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w600,
                                      color: _acceptsCommissions
                                          ? const Color(0xFF155724)
                                          : const Color(0xFF721C24),
                                    ),
                                  ),
                                ),
                                Switch(
                                  value: _acceptsCommissions,
                                  onChanged: (v) =>
                                      setState(() => _acceptsCommissions = v),
                                  activeColor:
                                      const Color.fromARGB(255, 255, 60, 60),
                                  activeTrackColor: const Color(0xFFFFE5E5),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 12),
                          TextFormField(
                            controller: _headlineCtrl,
                            decoration: const InputDecoration(
                              labelText: 'Headline',
                              border: OutlineInputBorder(),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                  color: Color.fromARGB(255, 255, 60, 60),
                                  width: 1.5,
                                ),
                              ),
                              contentPadding: EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 12),
                            ),
                            validator: (v) =>
                                (v == null || v.isEmpty) ? 'Required' : null,
                          ),
                          const SizedBox(height: 12),
                          TextFormField(
                            controller: _descCtrl,
                            maxLines: 5,
                            decoration: const InputDecoration(
                              labelText: 'Description',
                              alignLabelWithHint: true,
                              border: OutlineInputBorder(),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                  color: Color.fromARGB(255, 255, 60, 60),
                                  width: 1.5,
                                ),
                              ),
                              contentPadding: EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 12),
                            ),
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            'Reference images (optional)',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Colors.black,
                            ),
                          ),
                          const SizedBox(height: 8),
                          SizedBox(
                            height: 84,
                            child: ListView.separated(
                              scrollDirection: Axis.horizontal,
                              itemCount: _referenceImages.length + 1,
                              separatorBuilder: (_, __) =>
                                  const SizedBox(width: 8),
                              itemBuilder: (context, index) {
                                if (index == _referenceImages.length) {
                                  return GestureDetector(
                                    onTap: () async {
                                      final source = await showModalBottomSheet<
                                          ImageSource>(
                                        context: context,
                                        backgroundColor: Colors.white,
                                        shape: const RoundedRectangleBorder(
                                          borderRadius: BorderRadius.vertical(
                                              top: Radius.circular(16)),
                                        ),
                                        builder: (ctx) => SafeArea(
                                          top: false,
                                          child: Column(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              ListTile(
                                                leading: const Icon(
                                                    Icons.photo_library),
                                                title: const Text(
                                                    'Choose from gallery'),
                                                onTap: () => Navigator.pop(
                                                    ctx, ImageSource.gallery),
                                              ),
                                              ListTile(
                                                leading: const Icon(
                                                    Icons.photo_camera),
                                                title: const Text('Take photo'),
                                                onTap: () => Navigator.pop(
                                                    ctx, ImageSource.camera),
                                              ),
                                            ],
                                          ),
                                        ),
                                      );
                                      if (source != null) {
                                        if (source == ImageSource.gallery) {
                                          final picked = await _imagePicker
                                              .pickMultiImage(imageQuality: 85);
                                          if (picked.isNotEmpty) {
                                            setState(() {
                                              _referenceImages.addAll(picked);
                                            });
                                          }
                                        } else {
                                          final single =
                                              await _imagePicker.pickImage(
                                                  source: ImageSource.camera,
                                                  imageQuality: 85);
                                          if (single != null) {
                                            setState(() {
                                              _referenceImages.add(single);
                                            });
                                          }
                                        }
                                      }
                                    },
                                    child: Container(
                                      width: 84,
                                      height: 84,
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFF5F5F5),
                                        borderRadius: BorderRadius.circular(12),
                                        border: Border.all(
                                          color: const Color(0xFFE0E0E0),
                                          width: 1,
                                        ),
                                      ),
                                      child: const Icon(Icons.add_a_photo,
                                          color: Colors.black54),
                                    ),
                                  );
                                }
                                final file = _referenceImages[index];
                                return Stack(
                                  clipBehavior: Clip.none,
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(12),
                                      child: Container(
                                        width: 84,
                                        height: 84,
                                        color: const Color(0xFFF0F0F0),
                                        child: Image.file(
                                          io.File(file.path),
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                    ),
                                    Positioned(
                                      right: -6,
                                      top: -6,
                                      child: GestureDetector(
                                        onTap: () {
                                          setState(() {
                                            _referenceImages.removeAt(index);
                                          });
                                        },
                                        child: Container(
                                          width: 24,
                                          height: 24,
                                          decoration: const BoxDecoration(
                                            color: Colors.black54,
                                            shape: BoxShape.circle,
                                          ),
                                          child: const Icon(
                                            Icons.close,
                                            size: 16,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                );
                              },
                            ),
                          ),
                          const SizedBox(height: 12),
                          TextFormField(
                            controller: _basePriceCtrl,
                            decoration: const InputDecoration(
                              labelText: 'Base price (PHP)',
                              border: OutlineInputBorder(),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                  color: Color.fromARGB(255, 255, 60, 60),
                                  width: 1.5,
                                ),
                              ),
                              contentPadding: EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 12),
                            ),
                            keyboardType: TextInputType.number,
                          ),
                          const SizedBox(height: 24),
                          Consumer<CommissionProvider>(
                            builder: (_, p, __) => ElevatedButton(
                              onPressed: p.isLoading ? null : _save,
                              style: ElevatedButton.styleFrom(
                                backgroundColor:
                                    const Color.fromARGB(255, 255, 60, 60),
                                foregroundColor: Colors.white,
                                padding:
                                    const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                              child: p.isLoading
                                  ? const SizedBox(
                                      width: 18,
                                      height: 18,
                                      child: CircularProgressIndicator(
                                          strokeWidth: 2, color: Colors.white),
                                    )
                                  : const Text('Save'),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
