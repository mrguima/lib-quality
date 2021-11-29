import { Document, Schema, model, Model } from 'mongoose';

interface userSearch extends Document {
    userName: string;
    searchQuery: string;
    matchedRepository: string;
    searchedAt: Date;
};

interface userSearchModel extends Model<userSearch> {};

const userSearchSchema = new Schema<userSearch>({
    userName: {
        type: String,
        required: true,
    },
    searchQuery: {
        type: String,
        required: true,
    },
    matchedRepository: {
        type: String,
        required: true,
    },
    searchedAt: {
        type: Date,
        default: Date.now(),
    },
});

const Search: userSearchModel = model<userSearch, userSearchModel>('User', userSearchSchema);
export default Search;