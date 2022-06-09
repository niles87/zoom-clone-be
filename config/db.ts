import dotenv from "dotenv";

dotenv.config();

type config = {
  database: string;
};

export const config: config = {
  // @ts-ignore
  database: process.env.DB_CONNECTION,
};
