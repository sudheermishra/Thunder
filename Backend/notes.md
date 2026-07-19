Mongoose find() vs findOne() Notes

1. find()
   Purpose: Multiple documents fetch karna.
   Return Type: Array ([])
   Agar ek document mile tab bhi array return hota hai.
   Agar kuch na mile to empty array ([]) return hoti hai.
   Example
   const products = await Product.find({ brand: "apple" });

Return:

[
{
name: "iPhone 16",
brand: "apple"
},
{
name: "iPhone 15",
brand: "apple"
}
]

No data:

[]
Check
if (products.length === 0) {
return res.status(404).json({
message: "Product not found",
});
} 2. findOne()
Purpose: Sirf ek document fetch karna.
Return Type: Object ya null
Example
const product = await Product.findOne({ slug: "iphone-16" });

Return:

{
name: "iPhone 16",
slug: "iphone-16"
}

No data:

null
Check
if (!product) {
return res.status(404).json({
message: "Product not found",
});
} 3. findById()
Purpose: \_id se document fetch karna.
Return Type: Object ya null
Example
const product = await Product.findById(id);

Check:

if (!product) {
return res.status(404).json({
message: "Product not found",
});
}
Memory Trick 🧠
Method Returns
find() [] (Array)
findOne() {} or null
findById() {} or null
Easy Formula
find() → Many → Array []
findOne() → One → Object/null
findById() → One → Object/null
Why?

Jab tum likhte ho:

const product = await Product.find(req.query);

req.query sirf search condition (filter object) hota hai:

req.query
// {
// brand: "apple"
// }

Mongoose internally ye execute karta hai:

Product.find({
brand: "apple",
});
