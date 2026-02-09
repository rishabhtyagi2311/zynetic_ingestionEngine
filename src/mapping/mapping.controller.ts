import { Body, Controller, Post } from '@nestjs/common';
import { MappingService } from './mapping.service';
import { CreateMappingDto } from './dto/create-mapping.dto';

@Controller('v1/mappings')
export class MappingController {

  constructor(
    private readonly service: MappingService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateMappingDto,
  ) {
    return this.service.createMapping(
      dto.vehicleId,
      dto.meterId,
    );
  }
}
