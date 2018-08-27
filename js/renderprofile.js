const sql = require('sync-mysql');
const fs = require('fs');
const con = new sql({
    host: 'localhost',
    user: 'root',
    database: 'ready'
});

const notFound = fs.readFileSync('./404.html', 'utf8');
const proFile = fs.readFileSync('./profile.html', 'utf8');

exports.getByName = (name) => {
    var data = con.query(`SELECT * FROM profiles WHERE name='${name}'`);
    if(!data[0]) {
        return notFound;
    }
    roundone = proFile.replace(/\$purl/g, data[0].purl);
    roundtwo = roundone.replace(/\$name/g, data[0].name);
    roundthree = roundtwo.replace(/\$nick/g, data[0].nick);
    roundfour = roundthree.replace(/\$bio/g, data[0].bio);
    output = roundfour.replace(/\$editable/g, '');
    return output;
}
exports.getById = (id) => {
    var data = con.query(`SELECT * FROM profiles WHERE ID='${id}'`);
    if(!data[0]) {
        return notFound;
    }
    roundone = proFile.replace(/\$purl/g, data[0].purl);
    roundtwo = roundone.replace(/\$name/g, data[0].name);
    roundthree = roundtwo.replace(/\$nick/g, data[0].nick);
    roundfour = roundthree.replace(/\$bio/g, data[0].bio);
    output = roundfour.replace(/\$editable/g, '');
    return output;
}
exports.self = (name) => {
    var data = con.query(`SELECT * FROM profiles WHERE name='${name}'`);
    if(!data[0]) {
        con.query(`INSERT INTO profiles (purl, name, nick, bio) VALUES ('./img/sooHappy.png', '${name}', '${name}', ' ')`);
        var data = con.query(`SELECT * FROM profiles WHERE name='${name}'`);
    }
    roundone = proFile.replace(/\$purl/g, data[0].purl);
    roundtwo = roundone.replace(/\$name/g, data[0].name);
    roundthree = roundtwo.replace(/\$nick/g, data[0].nick);
    roundfour = roundthree.replace(/\$bio/g, data[0].bio);
    output = roundfour.replace(/\$editable/g, `<button href='/edit'>Edit</button>`);
    return output;
}