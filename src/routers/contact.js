const express = require("express");
const Contact = require("../model/contact");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/contacts", auth, async (req, res) => {
  const contact = new Contact({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await contact.save();
    res.status(201).send(contact);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/contacts", auth, async (req, res) => {
  try {
    await req.user.populate("contacts").execPopulate();
    res.send(req.user.contacts);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/contacts/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const contact = await Contact.findOne({ _id, owner: req.user._id });
    if (!contact) {
      return res.status(404).send();
    }
    res.send(contact);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/contacts/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "phone", "picture", "position"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid updates !" });
  }
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!contact) {
      return res.status(404).send();
    }
    updates.forEach((update) => {
      contact[update] = req.body[update];
    });
    await contact.save();
    res.send(contact);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/contacts/:id", auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!contact) {
      res.status(404).send();
    }
    res.send(contact);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
