import { Request, Response } from "express"; // Importing types for Request and Response from Express
const pool = require("../db"); // Importing the database connection pool

export const addToLibrary = async (req: Request, res: Response): Promise<void> => {
  const { postId, userId } = req.body; // Extracting postId and userId from the request body
  try {
    // Execute a SQL query to insert the postId and userId into the mylibrary table
    const result = await pool.query(
      'INSERT INTO mylibrary (post_id, user_id) VALUES ($1, $2) RETURNING *', // SQL query
      [postId, userId] // Values for the query placeholders
    );
    // Respond with the inserted row from the database
    res.status(200).json({
      message: "Post successfully added to library",
      data: result.rows[0],
    });
  } catch (error) {
    // Log the error and respond with a 500 status code for server errors
    console.error("Error adding post to library:", error);
    res.status(500).json({ message: "An internal server error occurred while adding the post to the library." });
  }
};

export const fetchPostbyUserId = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    // Query to get the post IDs for the specified user
    const libraryResult = await pool.query(
      'SELECT post_id FROM mylibrary WHERE user_id = $1',
      [userId]
    );
    // Extract post IDs from the result
    const postIds: number[] = libraryResult.rows.map((row: { post_id: number }) => row.post_id);
    // If no post IDs are found, return an empty array and exit
    if (postIds.length === 0) {
      res.status(200).json([]);
      return; // Ensure no further code is executed
    }
    // Query to get posts based on the post IDs
    const postResult = await pool.query(
      'SELECT * FROM post WHERE id = ANY($1::int[])',
      [postIds]
    );
    // Return the posts
    res.status(200).json(postResult.rows);
  } catch (error) {
    // Log the error and return a 500 status code
    console.error("Error fetching library posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteFromLibrary = async (req: Request, res: Response): Promise<void> => {
  const { userId, postId } = req.params; // Extracting userId and postId from the request parameters
  try {
    // Execute a SQL query to delete the post from mylibrary where user_id and post_id match
    const result = await pool.query(
      'DELETE FROM mylibrary WHERE user_id = $1 AND post_id = $2', // SQL query
      [userId, postId] // Values for the query placeholders
    );

    // Check if any rows were affected (i.e., if the post was found and deleted)
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Post not found in library" }); // Respond with 404 if no rows were deleted
      return; // Ensure no further code is executed
    }

    // Respond with a success message
    res.status(200).json({ message: "Post removed from library" });
  } catch (error) {
    // Log the error and respond with a 500 status code for server errors
    console.error("Error deleting post from library:", error);
    res.status(500).json({ message: "Server error" });
  }
};
