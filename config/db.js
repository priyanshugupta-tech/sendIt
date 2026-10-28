const mongoose = require("mongoose");
const { userModel } = require("../models/user.model");

async function connectDb(url) {
  await mongoose.connect(url);

  const usersCollection = userModel.collection;
  const [usersCollectionInfo] = await mongoose.connection.db
    .listCollections(
      { name: usersCollection.collectionName },
      { nameOnly: true },
    )
    .toArray();

  if (usersCollectionInfo) {
    const indexes = await usersCollection.listIndexes().toArray();
    const oldVerificationTtlIndex = indexes.find(
      (index) =>
        index.key.createdAt === 1 &&
        index.expireAfterSeconds === 300 &&
        index.partialFilterExpression &&
        index.partialFilterExpression.isVerified === false,
    );

    if (oldVerificationTtlIndex) {
      await usersCollection.dropIndex(oldVerificationTtlIndex.name);
    }

    await userModel.updateMany(
      {
        isVerified: false,
        verificationExpiresAt: { $exists: false },
      },
      {
        $set: {
          verificationExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      },
    );
  }

  await userModel.createIndexes();
  return mongoose.connection;
}

module.exports = {
  connectDb,
};
