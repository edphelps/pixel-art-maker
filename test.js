let regexp = /^http:.*\.galvanize.com$/;

// let regexp = /.\.galvanize.com$/g;

// console.log("true: "+/^http:.*\.galvanize.com$/g.test("http:www.test.galvanize.com"));
// console.log("true: "+/^http:.*\.galvanize.com$/g.test("http:www.test.galvanize.com"));
// console.log("false: "+/^http:.*\.galvanize.com$/g.test("http:www.google.com"));

console.log("true: "+regexp.test("http:www.testx.galvanize.com"));
console.log("true: "+ regexp.test("http:www.test.galvanize.com"));
console.log("false: "+regexp.test("http:www.google.com"));

if (regexp.test("http:www.testx.galvanize.com"))
  console.log("correct");
else
  console.log("wrong");

if (regexp.test("http:www.test.galvanize.com"))
  console.log("correct");
else
  console.log("wrong");

if (regexp.test("http:www.google.com"))
  console.log("wrong");
else
  console.log("correct");
