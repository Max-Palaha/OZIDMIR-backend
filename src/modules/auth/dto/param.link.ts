import { ApiProperty } from '@nestjs/swagger';

export class ParamActivationLinkDto {
  @ApiProperty({ example: 'Activation link', description: 'Activation link' })
  readonly activationLink: string;
}
