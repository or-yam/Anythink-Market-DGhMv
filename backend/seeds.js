const { randomUUID } = require('crypto');
const mongoose = require('mongoose');

require('dotenv').config();
require('./models/User');
require('./models/Item');

const User = mongoose.model('User');
const Item = mongoose.model('Item');
const NUMBER_OF_ITEMS_TO_CREATE = 100;

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.once('open', () => {
  console.log('connected to mongodb');
});

const createUser = async () => {
  const user = new User({ username: 'DummyUserWilco', email: 'dummy@dummy.com' });
  return user.save().then(() => {
    console.log(`created user ${user.username}`);
    return user;
  });
};

const createItem = async user => {
  const randomId = randomUUID();
  const randomNum = Math.floor(Math.random() * 200);

  const itemData = {
    slug: `test-item-${randomId}`,
    title: `Test Item-${randomId.split('-')[0]}`,
    description: 'Dummy item with random bear image',
    image: `https://placebear.com/g/200/${randomNum}`,
    favoritesCount: 0,
    comments: [],
    tagList: ['bear', 'dummy']
  };

  const item = new Item(itemData);
  item.seller = user;

  return item.save().then(() => {
    console.log(`${randomId} item created`);
  });
};

const populateDummyItems = async user => {
  const itemsToCreate = new Array(NUMBER_OF_ITEMS_TO_CREATE).fill();
  return Promise.all(itemsToCreate.map(() => createItem(user)));
};

(async () => {
  try {
    const user = await createUser();
    await populateDummyItems(user);
    console.log('created dummy data');
  } catch (err) {
    console.log(err);
  }
  process.exit();
})();
