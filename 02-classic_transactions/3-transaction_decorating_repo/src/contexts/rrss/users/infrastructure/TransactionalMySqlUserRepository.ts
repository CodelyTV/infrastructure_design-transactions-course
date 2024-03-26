import { Criteria } from "../../../shared/domain/criteria/Criteria";
import { MariaDBConnection } from "../../../shared/infrastructure/MariaDBConnection";
import { User } from "../domain/User";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";
import { MySqlUserRepository } from "./MySqlUserRepository";

export class TransactionalMySqlUserRepository implements UserRepository {
	constructor(
		private readonly repository: MySqlUserRepository,
		private readonly connection: MariaDBConnection,
	) {}

	async save(user: User): Promise<void> {
		await this.connection.transactional(async () => {
			await this.repository.save(user);
		});
	}

	async search(id: UserId): Promise<User | null> {
		return await this.repository.search(id);
	}

	async matching(criteria: Criteria): Promise<User[]> {
		return await this.repository.matching(criteria);
	}
}
