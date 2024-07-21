import { Request, Response } from "express";
const pool = require("../db");




export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    // First, get the most recent post
    const lastPostResult = await pool.query(
      'SELECT * FROM post WHERE categories = $1 ORDER BY date_de_publication DESC LIMIT 1',
      ['reportages']
    );

    if (lastPostResult.rows.length > 0) {
      const lastPostId = lastPostResult.rows[0].id; // Assuming there's an 'id' column in the 'post' table

      // Get all posts excluding the most recent post
      const result = await pool.query(
        'SELECT * FROM post WHERE categories = $1 AND id != $2',
        ['reportages', lastPostId]
      );

      res.status(200).json(result.rows); // Return the filtered posts
    } else {
      // If there are no posts in the category, return an empty array
      res.status(200).json([]);
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};







export const getPostsLast = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT * FROM post WHERE categories = $1 ORDER BY date_de_publication DESC LIMIT 1',
      ['reportages']
    );
    res.status(200).json(result.rows); // Return the most recent post
  } catch (error) {
    console.error("Error fetching the most recent post:", error);
    res.status(500).json({ message: "Server error" });
  }
};








export const getPostByID = async (req: Request, res: Response): Promise<void> => {
  const postID = req.params.id; // Get the post ID from the request parameters
  try {
    const result = await pool.query(
      'SELECT * FROM post WHERE id = $1', // Use the post ID as a parameter
      [postID]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Post not found" });
    } else {
      res.status(200).json({
        message: "Post successfully retrieved",
        data: result.rows[0],
      }); // Return the post
    }
  } catch (error) {
    console.error("Error fetching the post:", error);
    res.status(500).json({ message: "An internal server error occurred while fetching the post." });
  }
};



















export const incrementLike = async (req: Request, res: Response): Promise<void> => {
  const postID = req.params.id; // Get the post ID from the request parameters
  try {
    // Update the like count in the database
    const result = await pool.query(
      'UPDATE post SET likes = likes + 1 WHERE id = $1 RETURNING likes',
      [postID]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Post not found" });
    } else {
      const updatedLikes = result.rows[0].likes;
      res.status(200).json({ likes: updatedLikes }); // Return the updated like count
    }
  } catch (error) {
    console.error("Error updating like count:", error);
    res.status(500).json({ message: "An internal server error occurred while updating the like count." });
  }
};



