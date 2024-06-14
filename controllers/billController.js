const Bill = require("../models/bill");
const Sequelize = require("sequelize");
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const { sendReportmail } = require("../config/mail");

const generateBill = async (req, res) => {
  try {
    // const generateUuid = uuid.v1();
    let {
      name,
      email,
      contactNumber,
      paymentMethod,
      productDetails,
      total,
    } = req.body;

    productDetails = JSON.parse(productDetails);

    const generatedUuid = uuid.v1();
    const createdBy = req.local.email;

    const newBill = {
      uuid: generatedUuid,
      name,
      email,
      contactNumber,
      paymentMethod,
      productDetails,
      total,
      createdBy,
    };

    const bill = await Bill.create(newBill);
    if (!bill) {
      return res.status(500).json({ error: "Failed to create bill" });
    }

    const result = await ejs.renderFile(
      path.join(__dirname, "../config/report.ejs"),
      {
        name,
        email,
        contactNumber,
        paymentMethod,
        total,
        productDetails,
      }
    );
    if (!result) {
      return res.status(500).josn({ error });
    }

    const pdfPath = path.join(
      __dirname,
      "../generated_pdf",
      generatedUuid + ".pdf"
    );
    await new Promise((resolve, reject) => {
      pdf.create(result).toFile(pdfPath, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    const mailOptions = {
      from: "sagarsenjaliya423@gmail.com",
      to: email,
      subject: "Bill Invoice",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <table width="100%" style="border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 20px; background-color: #f7f7f7; text-align: center;">
              <h1 style="color: #333;">Cafe Management</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px;">
              <p>Dear ${name},</p>
              <p>Thank you for your recent purchase. Please find attached your invoice for the transaction.</p>
              <h2 style="color: #333;">Invoice Details:</h2>
              <table style="width: 100%; border: 1px solid #ddd; margin-top: 10px;">
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">Contact Number:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${contactNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">Payment Method:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">Total Amount:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${total}</td>
                </tr>
              </table>
              <p style="margin-top: 20px;">If you have any questions or need further assistance, please feel free to contact us.</p>
              <p>Thank you for your business!</p>
              <p>Best regards,<br><strong>Cafe Management</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; background-color: #f7f7f7; text-align: center;">
              <p style="font-size: 12px; color: #777;">Cafe Management, wood square, suart,india</p>
              <p style="font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} Cafe Management. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </div>
    `,
      attachments: [
        {
          filename: `${name}.pdf`,
          content: fs.createReadStream(pdfPath),
          contentType: "application/pdf",
        },
      ],
    };

    // sendReportmail(mailOptions);
    res.download(pdfPath, `${name}.pdf`, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      }
    });
  } catch (error) {
    console.log(error, "hello");
    if (error instanceof Sequelize.ValidationError) {
      return res.status(400).json({ error: "Validation error" });
    }
    res.status(500).json({
      error: "internal server error",
    });
  }
};

function isValidUUID(str) {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(str);
}

const getPdf = async (req, res) => {
  try {
    const { uuid } = req.params;

    if (!isValidUUID(uuid)) {
      return res.status(400).json({ error: "Invalid UUID" });
    }

    const pdfPath = path.join(__dirname, "../generated_pdf", uuid + ".pdf");

    if (fs.existsSync(pdfPath)) {
      res.contentType("application/pdf");
      const stream = fs.createReadStream(pdfPath);
      stream.on("error", (err) => {
        return res.status(500).json({ error: "Internal server error" });
      });
      return stream.pipe(res);
    }
    const { dataValues: data } = await Bill.findOne({
      where: {
        uuid,
      },
      attributes: [
        "name",
        "email",
        "contactNumber",
        "paymentMethod",
        "total",
        "createdBy",
        "productDetails",
      ],
    });
    if (!data) {
      res.status(400).json({ error: "this pdf does not exist" });
    }
    const result = await ejs.renderFile(
      path.join(__dirname, "../config/report.ejs"),
      {
        name: data.name,
        email: data.email,
        contactNumber: data.contactNumber,
        paymentMethod: data.paymentMethod,
        total: data.total,
        productDetails: data.productDetails,
      }
    );
    if (!result) {
      return res.status(500).json({ error });
    }
    pdf
      .create(result)
      .toFile(
        path.join(__dirname, "../generated_pdf", uuid + ".pdf"),
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: "internal server error" });
          } else {
            res.contentType("application/pdf");
            const stream = fs.createReadStream(pdfPath);
            stream.on("error", (err) => {
              return res.status(500).json({ error: "Internal server error" });
            });
            return stream.pipe(res);
          }
        }
      );
  } catch (error) {
    res.status(500).json({
      error: "internal server error",
    });
  }
};

const allBills = async (req, res) => {
  try {
    const bills = await Bill.findAll({
      attributes: [
        "id",
        "uuid",
        "name",
        "email",
        "total",
        "contactNumber",
        "paymentMethod",
        "productDetails",
      ],
    });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({
      error: "internal server error",
    });
  }
};

const deletebill = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await Bill.destroy({
      where: {
        id,
      },
    });
    if (deletedRows === 0) {
      return res.status(400).json({ error: "Bill not found" });
    }
    return res.status(200).json({ message: "Bill deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  generateBill,
  getPdf,
  allBills,
  deletebill,
};
