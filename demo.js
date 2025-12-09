import crypto from "crypto";
import fetch from "node-fetch";

// 👉 Use your real production key & salt here
const key = "785GGB7IMV";
const salt = "UO7STRLXHF";

// Payment details
const txnid = "TXN" + Date.now();  // unique txn ID
const amount = "1";
const productinfo = "Test Product";
const firstname = "Vishwa";
const email = "vishwaselvakumar2003@gmail.com";

// UDF values (15 total)
const udf1 = "";
const udf2 = "";
const udf3 = "";
const udf4 = "";
const udf5 = "";
const udf6 = "";
const udf7 = "";
const udf8 = "";
const udf9 = "";
const udf10 = "";
const udf11 = "";
const udf12 = "";
const udf13 = "";
const udf14 = "";
const udf15 = "";

// ------------------------------
// 🔐 Create Hash
// ------------------------------
const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|${udf7}|${udf8}|${udf9}|${udf10}|${udf11}|${udf12}|${udf13}|${udf14}|${udf15}|${salt}`;

const hash = crypto.createHash("sha512").update(hashString).digest("hex");

// --------------------------------
// 🌐 Production Payment API URL
// --------------------------------
const url = "https://pay.easebuzz.in/payment/initiateLink";

// Prepare body
const body = new URLSearchParams({
  key,
  txnid,
  amount,
  productinfo,
  firstname,
  phone: "9876543210",
  email,
  surl: "https://yourwebsite.com/payment-success", // success URL
  furl: "https://yourwebsite.com/payment-failure", // failed URL
  hash,
});

// --------------------------------
// 📡 Make API Request
// --------------------------------
try {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();
  console.log("Payment API Response:", data);

} catch (err) {
  console.error("Error calling Easebuzz API:", err);
}
