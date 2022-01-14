# social-media-API's using NODEJS, EXPRESS, POSTGRESQL

<h1>Problem Statement</h1>

Build APIs for a social media platform in either NodeJS. The API should support features like getting a user profile, follow a user, upload a post, delete a post, like a post, unlike a liked post, and comment on a post. Design the database schema and implement in PostgreSQL.

<h2>Working of backend</h2>
Your can use POSTMAN to check the working, API Endpoints are given below
<h5>baseurl : https://api-postgre-nodejs.herokuapp.com/</h5>

<h3>Dummy Users</h3>
<table>
  <tr>
    <th>Email</th>
    <th>Password</th>
  </tr>
  <tr>
    <td>demo@gmail.com</td>
    <td>demopassword</td>
  </tr>
  <tr>
    <td>demo2@gmail.com</td>
    <td>demopassword</td>
  </tr>
  <tr>
    <td>demo3@gmail.com</td>
    <td>demopassword</td>
  </tr>
</table>

**API Endpoints**

- POST /api/authenticate should perform user authentication and return a JWT token.
    - INPUT: Email, Password
    - RETURN: JWT token
    
    <aside>
    ➡️ **NOTE:** Use dummy email & password for authentication. No need to create endpoint for registering new user.
    </aside>
  
  
    <h5>
    ➡️ **NOTE:** After authenticating please add Token as a bearer token and than only below API's will work
    </h5>
    
- POST /api/follow/{id} authenticated user would follow user with {id}
- POST /api/unfollow/{id} authenticated user would unfollow a user with {id}
- GET /api/user should authenticate the request and return the respective user profile.
    - RETURN: User Name, number of followers & followings.
- POST api/posts/ would add a new post created by the authenticated user.
    - Input: Title, Description
    - RETURN: Post-ID, Title, Description, Created Time(UTC).
- DELETE api/posts/{id} would delete post with {id} created by the authenticated user.
- POST /api/like/{id} would like the post with {id} by the authenticated user.
- POST /api/unlike/{id} would unlike the post with {id} by the authenticated user.
- POST /api/comment/{id} add comment for post with {id} by the authenticated user.
    - Input: Comment
    - Return: Comment-ID
- GET api/posts/{id} would return a single post with {id} populated with its number of likes and comments
- GET /api/all_posts would return all posts created by authenticated user sorted by post time.
    - RETURN: For each post return the following values
        - id: ID of the post
        - title: Title of the post
        - desc: Description of the post
        - created_at: Date and time when the post was created
        - comments: Array of comments, for the particular post
        - likes: Number of likes for the particular post