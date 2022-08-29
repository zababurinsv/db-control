import mongoose from "mongoose";
const DataTypes = mongoose.Schema.Types;

const Presets = new mongoose.Schema({
  "members": [{
    menu_presets: DataTypes.String,
    categories: DataTypes.String,
    tags: DataTypes.Array,
    status: DataTypes.Boolean
  }],
  "instruments": [{
    menu_presets: DataTypes.String,
    categories: DataTypes.String,
    tags: DataTypes.Array,
    status: DataTypes.Boolean
  }],
  "Drums & Perc": [{
    menu_presets: DataTypes.String,
    categories: DataTypes.String,
    tags: DataTypes.Array,
    status: DataTypes.Boolean
  }],
  "mic & DI": [{
    menu_presets: DataTypes.String,
    categories: DataTypes.String,
    tags: DataTypes.Array,
    status: DataTypes.Boolean
  }],
  "monitors": [{
    menu_presets: DataTypes.String,
    categories: DataTypes.String,
    tags: DataTypes.Array,
    status: DataTypes.Boolean
  }],
  "backline": [{
    menu_presets: DataTypes.String,
    categories: DataTypes.String,
    tags: DataTypes.Array,
    status: DataTypes.Boolean
  }],
  "other": [{
    menu_presets: DataTypes.String,
    categories: DataTypes.String,
    tags: DataTypes.Array,
    status: DataTypes.Boolean
  }],
  "orchestras": [{
    menu_presets: DataTypes.String,
    categories: DataTypes.String,
    tags: DataTypes.Array,
    status: DataTypes.Boolean
  }]
});




export default mongoose.model('presets', Presets);
