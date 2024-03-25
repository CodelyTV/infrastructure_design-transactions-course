import { MariaDBConnection } from "../../../shared/infrastructure/MariaDBConnection";
import { LegacyUser } from "../domain/LegacyUser";
import { LegacyUserRepository } from "../domain/LegacyUserRepository";

export class MySqlLegacyUserRepository implements LegacyUserRepository {
	constructor(private readonly connection: MariaDBConnection) {}

	async save(user: LegacyUser): Promise<void> {
		const userPrimitives = user.toPrimitives();

		const query = `INSERT INTO legacy__users (id, name) VALUES ('${userPrimitives.id}', '${userPrimitives.name}');`;

		await this.connection.execute(query);
	}
}
