const env = process.env.NODE_ENV;
let url = "http://localhost:3000";

if (env === "production") url = "https://orium.vercel.app";

export default url;