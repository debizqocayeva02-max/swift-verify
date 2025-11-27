const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Kodları saxlamaq üçün demo in-memory object
let codes = {};

// SMTP konfiqurasiya MailDev üçün
const transporter = nodemailer.createTransport({
  host: "localhost",   // MailDev localhost-da işləyir
  port: 1025,          // MailDev SMTP portu
  secure: false        // TLS tələb olunmur
});

// Kod göndərmə endpoint
app.post("/send-code", async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codes[email] = code;

  try {
    await transporter.sendMail({
      from: `"Verify-Swift" <test@verify-swift.local>`,
      to: email,
      subject: "Doğrulama kodunuz",
      text: `Sizin doğrulama kodunuz: ${code}`
    });
    console.log(`Kod ${email} ünvanına göndərildi: ${code}`);
    res.send({ success: true, message: "Kod göndərildi" });
  } catch (err) {
    console.error("Mail göndərmə xətası", err);
    res.status(500).send({ success: false, message: "Mail göndərilə bilmədi" });
  }
});

// Kod yoxlama endpoint
app.post("/verify", (req, res) => {
  const { email, code } = req.body;
  if (codes[email] && codes[email] === code) {
    delete codes[email];
    return res.send({ success: true, message: "Email doğrulandı" });
  }
  res.status(400).send({ success: false, message: "Kod yanlış" });
});

app.listen(3000, () => console.log("Server 3000 portda işləyir"));
