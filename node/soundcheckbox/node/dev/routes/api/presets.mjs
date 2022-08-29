import express from "express";
import  Presets  from "../../models/mongo/Presets.mjs";
import data from '../../modules/presets/index.mjs';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
      const presets = new Presets(data);
      console.log('=== presets presets ===', presets)
      const result = await presets.save();
      res.json({ status: true });
    } catch (err) {
      console.error('ERROR', err.message);
      res.status(500).send({status: false, message: err.message});
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const result = await Presets.find().sort({ date: -1 });
    console.log('RESULT', result);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({status: false, message: 'Server Error'});
  }
});

export default router;
