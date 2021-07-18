const Koa = require("koa");

const app = new Koa()

app.use(async (ctx, next) => {
    Math.random() > 0.8 ? aa() : "2";
    await next();
    ctx.response.type === "text/html";
    ctx.response.body = "<h1>Hello Koa!</h1>"
});

if (!module.parent) {
    app.listen(3000);
    console.log("app start at port 3000")
} else {
    console.log("i am parent")
    module.exports = app;
}