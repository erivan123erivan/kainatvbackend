import { Request, Response } from "express";
const pool = require("../db");












export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const query =
      'SELECT id, email, name, birth_date, country, password, profileimage FROM "User" WHERE email = $1 AND password = $2';
    const values = [email, password];
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      res.status(200).json({
        statusCode: 200,
        message: "Login successful",
        user: result.rows[0],
      });
    } else {
      res.status(401).json({
        statusCode: 401,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};



















export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, birthDate, password, country } = req.body;
  let { image } = req.body;
  try {
    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    );
    if (userExists.rows.length > 0) {
      res.status(400).json({ message: "User already exists" });
      return; // Added return to exit the function early
    }
    // Insert user into the database
    const newUser = await pool.query(
      'INSERT INTO "User" (email, name, birth_date, country, password, profileimage) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [email, name, birthDate, country, password, image]
    );
    res.status(201).json(newUser.rows[0]); // Return newly created user
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};








export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Extract user ID from request parameters
  const { name, email, birthDate, password, country } = req.body;
  let { image } = req.body;
  try {
      // Check if user exists
      const userExists = await pool.query(
          'SELECT * FROM "User" WHERE id = $1',
          [id]
      );

      if (userExists.rows.length === 0) {
          res.status(404).json({ message: "User not found" });
          return; // Exit function if user does not exist
      }
      // Update user in the database
      const updatedUser = await pool.query(
          'UPDATE "User" SET email = COALESCE($1, email), name = COALESCE($2, name), birth_date = COALESCE($3, birth_date), country = COALESCE($4, country), password = COALESCE($5, password), profileimage = COALESCE($6, profileimage) WHERE id = $7 RETURNING *',
          [email, name, birthDate, country, password, image, id]
      );
      res.status(200).json(updatedUser.rows[0]); // Return updated user
  } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Server error" });
  }
};












