import crypto from "crypto";

const generateToken = () => {
    const rewToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rewToken).digest("hex");

    return { rewToken, hashedToken };
}

export { generateToken };
