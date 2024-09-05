const env = process.env;

export default {
  server_port: env.SERVER_PORT,
  secret: env.SECRET,
  frontend_server: env.FRONTEND_SERVER,
  db_url: env.DB_URL,
  db_name: env.DB_NAME,
  db_user: env.DB_USER,
  db_password: env.DB_PASSWORD,
  db_host: env.DB_HOST,
  db_port: env.DB_PORT,
};
