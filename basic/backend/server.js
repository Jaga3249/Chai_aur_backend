import express from "express";
const app = express();
app.use(express.static("dist"));
//route
// app.get("/", (req, res) => {
//   res.send("server started");
// });
//get jokes
app.get("/api/jokes", (req, res) => {
  const jokes = [
    { id: 1, title: "jokes 1", content: "1st jokes" },
    { id: 1, title: "jokes 2", content: "2nd jokes" },
    { id: 1, title: "jokes 3", content: "3rd jokes" },
    { id: 1, title: "jokes 4", content: "4th jokes" },
    { id: 1, title: "jokes 5", content: "5th jokes" },
  ];
  res.send(jokes);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(` server at http://localhost:${port}`);
});
