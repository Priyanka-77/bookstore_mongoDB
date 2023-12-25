const e = require("express");
const { response } = require("express");
const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb, connectToDb } = require("./db");

const app = express();
app.use(express.json());

//db connection
let db;
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("app listening on port 3000");
    });
    db = getDb();
  }
});

//routes
app.get("/books", (req, res) => {
  try {
    const page = req?.query?.page || 0;
    const booksPerPage = 3;
    let books = [];
    db.collection("books")
      .find()
      .sort({ title: 1 }) //this returns cursor
      .skip(page * booksPerPage)
      .limit(booksPerPage)
      .forEach((element) => {
        //on cursor we use cursor methods: forEach & toArray
        books.push(element);
      })
      .then(() => {
        return res.status(200).send(books);
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

app.get("/books/:id", (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      db.collection("books")
        .findOne({ _id: new ObjectId(req?.params?.id) })
        .then((data) => {
          if (data !== null) {
            return res.status(200).send(data);
          } else {
            return res.status(200).send({
              message: "No data is present corresponding to the given Id",
            });
          }
        });
    } else {
      return res.status(500).send({ error: "Not a valid document id" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

app.post("/books", (req, res) => {
  try {
    const books = req?.body?.books;

    let result;

    if (books?.length > 1) {
      result = db.collection("books").insertMany(books);
    } else {
      result = db.collection("books").insertOne(books[0]);
    }

    result.then((response) => {
      if (response) {
        return res.status(200).send(response);
      } else {
        return res.status(500).send(response);
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

app.delete("/books/:id", (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      db.collection("books")
        .deleteOne({ _id: new ObjectId(req?.params?.id) })
        .then((data) => {
          if (data?.deletedCount === 1) {
            return res.status(200).send(data);
          } else {
            return res.status(200).send({
              message: "No data is present corresponding to the given Id",
            });
          }
        });
    } else {
      return res.status(500).send({ error: "Not a valid document id" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

app.put("/books/:id", (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const updateBook = req?.body;
      db.collection("books")
        .updateOne({ _id: new ObjectId(req?.params?.id) }, { $set: updateBook })
        .then((data) => {
          if (data?.matchedCount === 1) {
            return res.status(200).send(data);
          } else {
            return res.status(200).send({
              message: "No data is present corresponding to the given Id",
            });
          }
        });
    } else {
      return res.status(500).send({ error: "Not a valid document id" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
