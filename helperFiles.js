require('dotenv').config();
const bcrypt = require('bcrypt');
const ShortUniqueId = require('short-unique-id');

(async () => {
    const hashedPass = await bcrypt.hash('123456', Number(process.env.SALT), (err, hash) => {
        if (err) {
            console.log(err);
        }
        console.log("Hash ", hash);
    });
});


const uid = new ShortUniqueId({
    dictionary: 'number',
});

console.log(uid.randomUUID(5));
console.log(uid.randomUUID(5));