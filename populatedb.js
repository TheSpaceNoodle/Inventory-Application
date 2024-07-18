#! /usr/bin/env node

import 'dotenv/config';
import mongoose from 'mongoose';
import { Category, Item } from './models/index.js';

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"',
);

// Get arguments passed on command line

const categories = [];
const items = [];

mongoose.set('strictQuery', false);

const mongoDB = process.env.MONGO_URI;

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createItems();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({ name, description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}, ${description}`);
}

async function itemCreate(index, name, description, price, category, in_stock, last_modified, img_url) {
  const itemInfo = { name, description, price, category, in_stock, last_modified, img_url };

  const item = new Item(itemInfo);

  await item.save();
  items[index] = item;
  console.log(`Added item: ${name} ${description}`);
}

async function createCategories() {
  console.log('Adding categories');
  await Promise.all([
    categoryCreate(0, 'Category 1'),
    categoryCreate(1, 'Category 2'),
    categoryCreate(2, 'Category 3'),
  ]);
}

async function createItems() {
  console.log('Adding items');
  await Promise.all([
    itemCreate(0, 'Item 1', 'Some Description', 199.9, [categories[0]], 23, new Date().toString(), ''),
    itemCreate(1, 'Item 2', 'Another Description', 299.9, [categories[1]], 15, new Date().toString(), ''),
    itemCreate(2, 'Item 3', 'Yet Another Description', 399.9, [categories[2]], 10, new Date().toString(), ''),
    itemCreate(3, 'Item 4', 'More Description', 499, [categories[0]], 5, new Date().toString(), ''),
    itemCreate(4, 'Item 5', 'Description Again', 599.9, [categories[1]], 8, new Date().toString(), ''),
    itemCreate(5, 'Item 6', 'Final Description', 699.9, [categories[2]], 12, new Date().toString(), ''),
  ]);
}
