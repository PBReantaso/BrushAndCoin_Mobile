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
  DateTime _deadline = DateTime.now().add(const Duration(days: 7));
  CommissionType _type = CommissionType.custom;

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
      deadline: _deadline,
      type: _type,
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
    return Scaffold(
      appBar: AppBar(title: const Text('Request Commission')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _titleCtrl,
                decoration: const InputDecoration(labelText: 'Title'),
                validator: (v) =>
                    (v == null || v.trim().isEmpty) ? 'Required' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _descCtrl,
                decoration:
                    const InputDecoration(labelText: 'Requirements / Terms'),
                maxLines: 4,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _amountCtrl,
                decoration: const InputDecoration(labelText: 'Amount (PHP)'),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<CommissionType>(
                value: _type,
                items: CommissionType.values
                    .map((t) => DropdownMenuItem(value: t, child: Text(t.name)))
                    .toList(),
                onChanged: (v) =>
                    setState(() => _type = v ?? CommissionType.custom),
                decoration: const InputDecoration(labelText: 'Type'),
              ),
              const SizedBox(height: 12),
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Desired timeline'),
                subtitle: Text('${_deadline.toLocal()}'.split(' ').first),
                trailing: const Icon(Icons.calendar_today_outlined),
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: _deadline,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                  );
                  if (picked != null) setState(() => _deadline = picked);
                },
              ),
              const SizedBox(height: 24),
              Consumer<CommissionProvider>(
                builder: (_, p, __) => ElevatedButton(
                  onPressed: p.isLoading ? null : _submit,
                  child: p.isLoading
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Submit Request'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
