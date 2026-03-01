const expensesService = require('../services/expenses.service');
const usersService = require('../services/users.service');

const getAll = async (req, res) => {
  const { userId, from, to, categories } = req.query;

  if (from && to) {
    res.json(await expensesService.getBetweenDates(from, to));

    return;
  }

  const expenses = await expensesService.getAll({ userId, categories });

  res.json(expenses);
};

const create = async (req, res) => {
  const { userId, spentAt, title, amount, category, note } = req.body;
  const isValid = Object.values(req.body).every((value) => value !== undefined);

  if (!isValid) {
    return res.sendStatus(400);
  }

  const user = await usersService.getById(userId);

  if (!user) {
    return res.sendStatus(400);
  }

  const expense = await expensesService.create({
    userId,
    spentAt,
    title,
    amount,
    category,
    note,
  });

  res.status(201).json(expense);
};

const getOne = async (req, res) => {
  const expense = await expensesService.getById(req.params.id);

  if (!expense) {
    return res.sendStatus(404);
  }

  res.json(expense);
};

const deleteOne = async (req, res) => {
  const expense = await expensesService.getById(req.params.id);

  if (!expense) {
    return res.sendStatus(404);
  }

  await expensesService.deleteById(req.params.id);

  res.sendStatus(204);
};

const update = async (req, res) => {
  const isValid = Object.values(req.body).every((value) => value !== undefined);

  if (!isValid) {
    return res.sendStatus(400);
  }

  const expense = await expensesService.getById(req.params.id);

  if (!expense) {
    return res.sendStatus(404);
  }

  const updatedUser = await expensesService.update(req.params.id, {
    ...req.body,
  });

  res.json(updatedUser);
};

module.exports = {
  getAll,
  create,
  getOne,
  deleteOne,
  update,
};
