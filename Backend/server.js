import app from './src/app.js';
import ConntectToDb from './src/config/database.js';

ConntectToDb();


app.listen(6060, () => {
    console.log("Server running at port 6060");
})