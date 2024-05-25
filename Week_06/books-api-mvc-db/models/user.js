const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
  constructor(id, username, email) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  // Create User
  static async createUser(newUserData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Users (username, email) VALUES (@username, @email); SELECT SCOPE_IDENTITY() AS id;`; // Retrieve ID of inserted record

    const request = connection.request();
    request.input("username", newUserData.username);
    request.input("email", newUserData.email);

    const result = await request.query(sqlQuery);

    connection.close();

    // Retrieve the newly created book using its ID
    return this.getUserById(result.recordset[0].id);
  }

  // Get All Users // Works
  static async getAllUsers() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users`;

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new User(row.id, row.username, row.email)
    ); // Convert rows to User objects
  }

  // GetUserById // Works
  static async getUserById(userId) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users WHERE id = @userId`;

    const request = connection.request();
    request.input("userId", userId);

    const result = await request.query(sqlQuery);

    connection.close();

    if (result.recordset.length === 0) {
      return null;
    }

    const { id, username, email } = result.recordset[0];
    return new User(id, username, email);
  }

  // Update User by ID
  static async updateUserById(userId, newUserData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Users SET username = @username, email = @email WHERE id = @userId`;

    const request = connection.request();
    request.input("userId", userId);
    request.input("username", newUserData.username || null); // Handle optional fields
    request.input("email", newUserData.email || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getUserById(userId);
  }

  // Delete User by ID
  static async deleteUserById(userId) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Users WHERE id = @userId`;

    const request = connection.request();
    request.input("userId", userId);

    await request.query(sqlQuery);

    connection.close();
  }

  // Search Users
  static async searchUsers(searchTerm) {
    const connection = await sql.connect(dbConfig);
    const query = `SELECT *
                   FROM Users
                   WHERE username LIKE '%${searchTerm}%'
                      OR email LIKE '%${searchTerm}%'`;

    try {
      const request = connection.request(); // Optional for prepared statements
      const result = await request.query(query); // Use request.query with prepared statements
      return result.recordset;
    } catch (error) {
      throw new Error("Error searching users");
    } finally {
      await connection.close();
    }
  }
  
  // Get Users with Books
  static async getUsersWithBooks() {
    const connection = await sql.connect(dbConfig);

    try {
      const query = `
        SELECT u.id AS user_id, u.username, u.email, b.id AS book_id, b.title, b.author
        FROM Users u
        LEFT JOIN UserBooks ub ON ub.user_id = u.id
        LEFT JOIN Books b ON ub.book_id = b.id
        ORDER BY u.username;
      `;

      const result = await connection.request().query(query);

      // Group users and their books
      const usersWithBooks = {};
      for (const row of result.recordset) {
        const userId = row.user_id;
        if (!usersWithBooks[userId]) {
          usersWithBooks[userId] = {
            id: userId,
            username: row.username,
            email: row.email,
            books: [],
          };
        }
        usersWithBooks[userId].books.push({
          id: row.book_id,
          title: row.title,
          author: row.author,
        });
      }

      return Object.values(usersWithBooks);
    } catch (error) {
      throw new Error("Error fetching users with books");
    } finally {
      await connection.close();
    }
  }

}

module.exports = User;
