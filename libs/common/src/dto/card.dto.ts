import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CardDto {
  @IsString()
  @IsNotEmpty()
  number!: string;

  @IsNumber()
  @IsNotEmpty()
  exp_month!: number;

  @IsNumber()
  @IsNotEmpty()
  exp_year!: number;

  @IsString()
  @IsNotEmpty()
  cvc!: string;
}
