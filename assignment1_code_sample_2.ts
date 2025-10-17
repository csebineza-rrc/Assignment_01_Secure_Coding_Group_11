import * as readline from 'readline';
import * as mysql from 'mysql';
import * as dotenv from 'dotenv';
import https from "https";
const nodemailer = require('nodemailer');

dotenv.config()

const dbConfig = {
    // Using environment variables to avoid exposing sensitive information
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
};

function getUserInput(): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Enter your name: ', (answer) => {
            // Validating user input
            const validCharacter = /^[a-zA-Z0-9_ -]+$/.test(answer);
            if (!validCharacter) {
                console.log("Invalid input");
                rl.close();
                resolve(answer);
            }
            
        });
    });
}

function sendEmail(to: string, subject: string, body: string) {
    // Instead of sending email using exec() we can use nodemailer which 
    // more safer and encrypted
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'email-password',
                pass: 'email-password',
            },
        });

        let mailingOptions = {
            from: 'sender-email',
            to: 'recipient-email',
            body: 'Hello, how are you doing?',
        };

        transporter.sendEmail(mailingOptions, (error: string) => {
            if (error) {
                console.error(`Error sending email: ${error}`);
            }
        });

    } catch {}

}

function getData(): Promise<string> {
    return new Promise((resolve, reject) => {
        // Switching to https for the data is more secure
        https.get('http://insecure-api.com/get-data', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function saveToDb(data: string) {
    const connection = mysql.createConnection(dbConfig);
    //const query = `INSERT INTO mytable (column1, column2) VALUES ('${data}', 'Another Value')`;

    // Implementing parameterised queries to prevent SQL injection
    const query = "INSERT INTO mytable (column1, column2) VALUES (?, ?)";

    connection.connect();
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
        } else {
            console.log('Data saved');
        }
        connection.end();
    });
}

(async () => {
    const userInput = await getUserInput();
    const data = await getData();
    saveToDb(data);
    sendEmail('admin@example.com', 'User Input', userInput);
})();