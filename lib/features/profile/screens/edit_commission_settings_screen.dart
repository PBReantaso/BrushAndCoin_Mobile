import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/providers/commission_provider.dart';
import '../../../core/providers/auth_provider.dart';

class EditCommissionSettingsScreen extends StatefulWidget {
  const EditCommissionSettingsScreen({super.key});

  @override
  State<EditCommissionSettingsScreen> createState() =>
      _EditCommissionSettingsScreenState();
}

class _EditCommissionSettingsScreenState
    extends State<EditCommissionSettingsScreen> {
  final _formKey = GlobalKey<FormState>();
  final _headlineCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _basePriceCtrl = TextEditingController();
  bool _acceptsCommissions = true;

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
      },
    );
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Commission details saved')),
    );
    Navigator.of(context).pop(true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Commission Details')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              SwitchListTile(
                value: _acceptsCommissions,
                onChanged: (v) => setState(() => _acceptsCommissions = v),
                title: const Text('Accepting commissions'),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _headlineCtrl,
                decoration: const InputDecoration(labelText: 'Headline'),
                validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _descCtrl,
                maxLines: 5,
                decoration: const InputDecoration(labelText: 'Description'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _basePriceCtrl,
                decoration:
                    const InputDecoration(labelText: 'Base price (PHP)'),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 24),
              Consumer<CommissionProvider>(
                builder: (_, p, __) => ElevatedButton(
                  onPressed: p.isLoading ? null : _save,
                  child: p.isLoading
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2))
                      : const Text('Save'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
