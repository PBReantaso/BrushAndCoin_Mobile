import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/providers/commission_provider.dart';

class TipScreen extends StatefulWidget {
  final String artistId;
  const TipScreen({super.key, required this.artistId});

  @override
  State<TipScreen> createState() => _TipScreenState();
}

class _TipScreenState extends State<TipScreen> {
  final _amountCtrl = TextEditingController();

  @override
  void dispose() {
    _amountCtrl.dispose();
    super.dispose();
  }

  Future<void> _tip() async {
    final provider = Provider.of<CommissionProvider>(context, listen: false);
    final amount = double.tryParse(_amountCtrl.text.trim()) ?? 0;
    if (amount <= 0) return;
    await provider.tipArtist(artistId: widget.artistId, amount: amount);
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Tipped PHP ${amount.toStringAsFixed(2)}')),
    );
    Navigator.of(context).pop(true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tip Artist')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _amountCtrl,
              decoration: const InputDecoration(
                labelText: 'Amount (PHP)',
                prefixText: '₱ ',
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 24),
            Consumer<CommissionProvider>(
              builder: (_, p, __) => ElevatedButton(
                onPressed: p.isLoading ? null : _tip,
                child: p.isLoading
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Send Tip'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
