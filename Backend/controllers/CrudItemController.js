import LostItem from '../models/LostItem.js';
import FoundItem from '../models/FoundItem.js';
// import UserContact from '../models/UserContact.js';

// Route to remove an item
app.delete('/remove-item/:itemId', async (req, res) => {
  const { itemId } = req.params;

  try {
    const lostItem = await LostItem.findById(itemId);
    if (lostItem) {
      await LostItem.findByIdAndDelete(itemId);
      res.status(200).json({ message: 'Lost item removed successfully', lostItem });
    } else {
      const foundItem = await FoundItem.findById(itemId);
      if (foundItem) {
        await FoundItem.findByIdAndDelete(itemId);
        res.status(200).json({ message: 'Found item removed successfully', foundItem });
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    }
  } catch (err) {
    res.status(500).json({ message: 'Error removing item', error: err });
  }
});