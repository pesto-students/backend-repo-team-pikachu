export default {
  secret: process.env.JWT_SECRET as string,
  expiresIn: "1h",
};
