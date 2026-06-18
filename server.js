import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/common/config/db.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;
app.use(cookieParser());

const start = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    })
}

start().catch((err)=>{
    console.error('Faild to start server', err);
    process.exit(1);
})