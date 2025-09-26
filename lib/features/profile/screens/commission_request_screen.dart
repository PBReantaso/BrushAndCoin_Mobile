import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/providers/commission_provider.dart';
import '../../../core/providers/auth_provider.dart';
import '../../../core/models/commission_model.dart';

class CommissionRequestScreen extends StatefulWidget {
  final String artistId;
  const CommissionRequestScreen({super.key, required this.artistId});

  @override
  State<CommissionRequestScreen> createState() =>
      _CommissionRequestScreenState();
}

class _CommissionRequestScreenState extends State<CommissionRequestScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _amountCtrl = TextEditingController();
  // Timeline and type removed per design

  @override
  void dispose() {
    _titleCtrl.dispose();
    _descCtrl.dispose();
    _amountCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final provider = Provider.of<CommissionProvider>(context, listen: false);
    final commission = await provider.submitCommission(
      artistId: widget.artistId,
      clientId: auth.currentUser?.id ?? 'mock-client',
      title: _titleCtrl.text.trim(),
      description: _descCtrl.text.trim(),
      amount: double.tryParse(_amountCtrl.text.trim()) ?? 0,
      deadline: DateTime.now(),
      type: CommissionType.custom,
      requirements: {},
    );
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
          content: Text('Commission submitted. Awaiting artist review.')),
    );
    Navigator.of(context).pop(commission);
  }

  @override
  Widget build(BuildContext context) {
    // Keep the screen for legacy navigation; build using the shared form widget
    return Scaffold(
      appBar: AppBar(title: const Text('Request Commission')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: _CommissionRequestForm(
            formKey: _formKey,
            titleCtrl: _titleCtrl,
            descCtrl: _descCtrl,
            amountCtrl: _amountCtrl,
            initialDeadline: DateTime.now(),
            initialType: CommissionType.custom,
            onDeadlineChanged: (_) {},
            onTypeChanged: (_) {},
            onSubmit: _submit,
          ),
        ),
      ),
    );
  }
}

// Modal-friendly commission request sheet
class CommissionRequestSheet extends StatefulWidget {
  final String artistId;
  const CommissionRequestSheet({super.key, required this.artistId});

  @override
  State<CommissionRequestSheet> createState() => _CommissionRequestSheetState();
}

class _CommissionRequestSheetState extends State<CommissionRequestSheet> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _amountCtrl = TextEditingController();
  // Timeline and type removed per design

  @override
  void dispose() {
    _titleCtrl.dispose();
    _descCtrl.dispose();
    _amountCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final provider = Provider.of<CommissionProvider>(context, listen: false);
    await provider.submitCommission(
      artistId: widget.artistId,
      clientId: auth.currentUser?.id ?? 'mock-client',
      title: _titleCtrl.text.trim(),
      description: _descCtrl.text.trim(),
      amount: double.tryParse(_amountCtrl.text.trim()) ?? 0,
      deadline: DateTime.now(),
      type: CommissionType.custom,
      requirements: {},
    );
    if (!mounted) return;
    Navigator.of(context).pop();
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
          content: Text('Commission submitted. Awaiting artist review.')),
    );
  }

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
                        'Request Commission',
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
                    child: _CommissionRequestForm(
                      formKey: _formKey,
                      titleCtrl: _titleCtrl,
                      descCtrl: _descCtrl,
                      amountCtrl: _amountCtrl,
                      initialDeadline: DateTime.now(),
                      initialType: CommissionType.custom,
                      onDeadlineChanged: (_) {},
                      onTypeChanged: (_) {},
                      onSubmit: _submit,
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

// Reusable form used by both full screen and modal
class _CommissionRequestForm extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final TextEditingController titleCtrl;
  final TextEditingController descCtrl;
  final TextEditingController amountCtrl;
  final DateTime initialDeadline; // unused retained for signature compatibility
  final CommissionType
      initialType; // unused retained for signature compatibility
  final ValueChanged<DateTime> onDeadlineChanged; // no-op
  final ValueChanged<CommissionType> onTypeChanged; // no-op
  final VoidCallback onSubmit;

  const _CommissionRequestForm({
    required this.formKey,
    required this.titleCtrl,
    required this.descCtrl,
    required this.amountCtrl,
    required this.initialDeadline,
    required this.initialType,
    required this.onDeadlineChanged,
    required this.onTypeChanged,
    required this.onSubmit,
  });

  @override
  Widget build(BuildContext context) {
    return Form(
      key: formKey,
      child: ListView(
        keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
        children: [
          TextFormField(
            controller: titleCtrl,
            decoration: const InputDecoration(
              labelText: 'Title',
              border: OutlineInputBorder(),
              focusedBorder: OutlineInputBorder(
                borderSide: BorderSide(
                  color: Color.fromARGB(255, 255, 60, 60),
                  width: 1.5,
                ),
              ),
              contentPadding:
                  EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
            validator: (v) =>
                (v == null || v.trim().isEmpty) ? 'Required' : null,
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: descCtrl,
            decoration: const InputDecoration(
              labelText: 'What do you want to make me do?',
              hintText: 'Describe the commission request',
              alignLabelWithHint: true,
              border: OutlineInputBorder(),
              focusedBorder: OutlineInputBorder(
                borderSide: BorderSide(
                  color: Color.fromARGB(255, 255, 60, 60),
                  width: 1.5,
                ),
              ),
              contentPadding:
                  EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
            maxLines: 4,
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: amountCtrl,
            decoration: const InputDecoration(
              labelText: 'Budget (PHP)',
              hintText: 'Enter your budget',
              border: OutlineInputBorder(),
              focusedBorder: OutlineInputBorder(
                borderSide: BorderSide(
                  color: Color.fromARGB(255, 255, 60, 60),
                  width: 1.5,
                ),
              ),
              contentPadding:
                  EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
            keyboardType: TextInputType.number,
          ),
          const SizedBox(height: 24),
          const SizedBox(height: 24),
          Consumer<CommissionProvider>(
            builder: (_, p, __) => ElevatedButton(
              onPressed: p.isLoading ? null : onSubmit,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color.fromARGB(255, 255, 60, 60),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10)),
              ),
              child: p.isLoading
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Colors.white),
                    )
                  : const Text('Submit Request'),
            ),
          ),
        ],
      ),
    );
  }
}

Future<void> showCommissionRequestModal(BuildContext context,
    {required String artistId}) {
  return showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) => CommissionRequestSheet(artistId: artistId),
  );
}
