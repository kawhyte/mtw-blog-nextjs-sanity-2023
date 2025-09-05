import { createClient } from 'next-sanity';

// We'll use a direct query to check both systems
const query1 = `*[_type == "post" && title match "*MatCHA Chai*"] {
  _id,
  title,
  _type,
  linkType,
  date
}`;

const query2 = `*[_type == "foodReview" && title match "*MatCHA Chai*"] {
  _id,
  title,
  _type,
  date
}`;

console.log('Legacy Posts Query:', query1);
console.log('Food Reviews Query:', query2);
console.log('\nNote: Run these queries in your Sanity Studio Vision tab to check where the post exists.');