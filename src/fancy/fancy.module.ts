import { Module } from "@nestjs/common";
import { FancyController } from "./fancy.controller";
import { FancyService } from "./fancy.service";
import { PrismaModule } from "src/prisma";
import { RedisModule } from "src/redis";

@Module({
  imports:[PrismaModule,RedisModule],
  controllers:[FancyController],
  providers:[FancyService]
})
export class FancyModule{}