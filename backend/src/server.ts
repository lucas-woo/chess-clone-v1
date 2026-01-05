import { createApp } from "./create-app.ts";

const PORT = Number(process.env.PORT) || 3000;

(async() => {
  const app = await createApp()
  app.listen(PORT, () => {
    console.log(`listening on PORT: ${PORT}`)
  })
})()
