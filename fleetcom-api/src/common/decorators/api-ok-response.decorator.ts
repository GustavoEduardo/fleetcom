import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/api-response.dto';

// Criado para documentar nova estrutura padrão de retorno da API.

/*

  Uso no controller antes:
    // @ApiResponse({
    //   status: 200,
    //   description: 'Lista retornada com sucesso',
    //   type: [ResUserDto],
    // })

  Uso Agora:
    @ApiOkResponseWrapped(ResUserDto, {
      isArray: true,
      description: 'Mensagem opcional',
    })

*/

export const ApiOkResponseWrapped = <TModel extends Type<any>>(
  model: TModel,
  options?: {
    isArray?: boolean;
    description?: string;
  },
) => {
  const isArray = options?.isArray ?? false;
  const description = options?.description ?? 'Operação realizada com sucesso';

  return applyDecorators(
    ApiExtraModels(ApiResponseDto, model),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  }
                : { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};
