import mongoose from 'mongoose';


const options = { discriminatorKey: 'kind', collection: ' MyWArt' };

const MyWArtSchema = new mongoose.Schema(
    {
        id: Number,
        name: String,
        price: Number,
        uri: String,
        description: String
    },
    { timestamps: true },
    options
);

const MyWArt = mongoose.model('MyWArt', MyWArtSchema);

export default MyWArtSchema;

