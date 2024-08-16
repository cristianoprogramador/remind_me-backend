import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
      next();
    }
  );

  if (process.env.ENABLE_SWAGGER === "true") {
    const config = new DocumentBuilder()
      .setTitle("App Watch API")
      .setDescription(
        "API documentation for the application monitoring called App Watch API"
      )
      .setVersion("1.0")
      .addBearerAuth({ in: "header", type: "http" })
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document, {
      swaggerOptions: {
        tagsSorter: "alpha",
        defaultModelsExpandDepth: -1,
        operationsSorter: function (a: any, b: any) {
          const order = {
            post: "0",
            get: "1",
            put: "2",
            delete: "3",
            patch: "4",
          };
          return (
            order[a.get("method")].localeCompare(order[b.get("method")]) ||
            a.get("path").localeCompare(b.get("path"))
          );
        },
      },
    });
  }

  await app.listen(3333);
}

bootstrap();
