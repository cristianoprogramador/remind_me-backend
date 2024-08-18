import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { join } from "path";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("docs")
  @ApiExcludeEndpoint()
  getDocs(@Res() res: Response): void {
    res.send(this.appService.getDocs());
  }

  @Get("swagger-json")
  @ApiExcludeEndpoint()
  getSwaggerJson(@Res() res: Response): void {
    res.sendFile(join(__dirname, "../swagger.json"));
  }
}
