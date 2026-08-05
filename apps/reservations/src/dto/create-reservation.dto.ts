import { Type } from "class-transformer";
import { IsDate, IsDefined, IsNotEmpty,  IsNotEmptyObject, IsString, ValidateNested } from "class-validator";
import { CreateChargeDto } from "@app/common/dto/create-charge";

export class CreateReservationDto {
    @IsDate()
    @Type(() => Date)
    startDate!: Date;

    @IsDate()
    @Type(() => Date)
    endDate!: Date;

    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CreateChargeDto)
    charge!: CreateChargeDto;
    

}
