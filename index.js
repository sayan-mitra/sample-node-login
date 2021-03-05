const express = require("express");
const pg = require("pg");
const bodyParser = require("body-parser");
const uuid = require("uuid-v4");

// example config by country code
const config = {
  IN: {
    name: {
      type: "string"
    },
    email: {
      type: "string"
    },
    dob: {
      type: "string"
    }
  },
  AU: {
    email: {
      type: "string"
    },
    dob: {
      type: "string"
    }
  }
};

// find user and password
const pool = new pg.Pool({
  user: "ubuntu",
  password: "ubuntu",
  host: "localhost",
  port: 5432,
  database: "login"
});

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json("booting up");
});

app.post("/login", (req, res) => {
  //console.log(req.body);
  const { id, cc } = req.body;
  getUser(id)
    .then(userDetailsArray => {
      if (userDetailsArray.length == 0) {
        res.status(200);
        res.json({ config: config[cc] });
      } else {
        updateUser(id)
          .then(success => {
            res.status(200);
            res.json({ success: new Date().getTime() });
          })
          .catch(err => {
            res.status(500);
            res.json({ error: "failed to update user" });
          });
      }
    })
    .catch(err => {
      res.status(500);
      res.json({ err: "failed to get user data" });
    });
});

// make port configurable
app.listen(3001, () => {
  console.log("server accepting connection");
});

function getUser(id) {
  return new Promise((resolve, reject) => {
    //sample db select
    pool.query(
      "select * from user_details where id = " + id,
      (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        //console.log(response.rows);
        resolve(response.rows);
      }
    );
  });
}

function updateUser(id) {
  return new Promise((resolve, reject) => {
    //sample db select
    pool.query(
      "update user_details set last_login = " +
        new Date().getTime() +
        " where id= " +
        id,
      (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        //console.log(response);
        resolve(response);
      }
    );
  });
}

// 1614773792472
// 1614773850694

// function createUser(userDetails) {
//     return new Promise((resolve, reject) => {
//         //sample db select
//         pool.query(
//           "insert into user_details values (id, name, dob, email, last_login)" + ,
//           (err, response) => {
//             if (err) {
//               reject(err);
//             }
//             console.log(response.rows);
//             resolve(response.rows);
//           }
//         );
//       });
// }

//sample db select
// pool.query("select * from user_details", (err, response) => {
//   console.log(response.rows);
// });

//sample db update
// pool.query(
//   "update user_details set last_login= " + new Date().getTime(),
//   (err, response) => {
//     console.log(err);
//     //console.log(response);
//   }
// );

// let the id be coming as post body
