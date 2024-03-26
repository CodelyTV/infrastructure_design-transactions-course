import { MariaDBConnection } from "../../../../../src/contexts/shared/infrastructure/MariaDBConnection";
import { LegacyUserMother } from "../../../../../tests/contexts/rrss/legacy_users/domain/LegacyUserMother";
import { MySqlLegacyUserRepository } from "./MySqlLegacyUserRepository";

describe("MySqlLegacyUserRepository should", () => {
	const connection = new MariaDBConnection();
	const repository = new MySqlLegacyUserRepository(connection);

	beforeEach(async () => await connection.truncate("legacy__users"));
	afterAll(async () => await connection.close());

	it("save a user", async () => {
		const user = LegacyUserMother.create();

		await repository.save(user);
	});
});
