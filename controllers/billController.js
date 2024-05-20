const Bill = require("../models/bill");
const Sequelize = require("sequelize");
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const { all } = require("../routers/billroutes");

const generateBill = async (req, res) => {
  try {
    // const generateUuid = uuid.v1();
    let {
      name,
      email,
      contactNumber,
      paymentMethod,
      productDetails,
      totalAmount,
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
      total: totalAmount,
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
        totalAmount,
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
        totalAmount: data.total,
        productDetails: data.productDetails,
      }
    );
    if (!result) {
      return res.status(500).josn({ error });
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
      attributes: ["id","uuid", "name", "email", "contactNumber", "paymentMethod"],
    });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({
      error: "internal server error",
    });
  }
};

const deletebill = async(req,res)=>{
    try {
        const {id} = req.params;
         const deletedRows =  await Bill.destroy({
            where:{
                id
            }
         })
         if(deletedRows===0){
            return res.status(400).json({error :"Bill not found"})
         }
         return res.status(200).json({ message: "Bill deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = {
  generateBill,
  getPdf,
  allBills,
  deletebill
};
