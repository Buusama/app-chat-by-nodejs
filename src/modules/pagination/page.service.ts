import { Repository, SelectQueryBuilder } from 'typeorm';
import { PageDto } from './dto/page.dto';
import { SortEnum } from 'src/commons/enums/sort/sort-enum';

export class PageService {
  protected paginate<T>(
    repository: Repository<T>,
    pageDto: PageDto,
    rawAndLeftJoin: boolean = false,
  ): SelectQueryBuilder<T> {
    const queryBuilder = repository.createQueryBuilder('table');

    if (pageDto.sort_by && pageDto.sort_enum) {
      queryBuilder.addOrderBy(`table.${pageDto.sort_by}`, pageDto.sort_enum);
    }

    if (pageDto.skip !== null && pageDto.take !== null) {
      queryBuilder.offset(pageDto.skip).limit(pageDto.take);
    }

    return queryBuilder;
  }
}
