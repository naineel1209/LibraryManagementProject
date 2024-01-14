const { Router } = require('express');
const router = Router();

//PATH: /books-helper - authenticated users 
router
    .route('/')
    .get((req, res) => {
        console.log(req.user);
        res.statusMessage = "GET request successful"

        res.status(200).json({
            message: "GET request successful",
            instructions: `
                1. Send a GET request to /books to get all available the books - ✔️
                2. Send a GET request to /books/:id to get a specific book - ✔️
                3. Send a POST request to /books to add a new book - ✔️
                4. Send a PATCH request to /books/:id to update a book - update the details of the book - ✔️
                5. Send a DELETE request to /books/:id to delete a book - ✔️
                    
                for users who want to rent a book:
                6. Send a POST request to /books/:id/rent to rent a book ✔️
                7. Send a POST request to /books/:id/return to return a book ✔️
                8. Send a GET request to /books/rented to get all the books rented by the current user ✔️

                for personal user:
                9. Send a GET request to /profile-user to get the profile of the current user with all the books he published and he rented ✔️
                
                --> Additional Work - 
                
                `
        })
    })

module.exports = router;